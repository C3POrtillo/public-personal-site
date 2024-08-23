import type {
  BasicDataType,
  ExternalComponentData,
  FormattedBasicData,
  FormattedExternalComponent,
  FormattedExternalComponentData,
  FormattedExternalComponentsByType,
  FormattedSetData,
  MainStatMapKeys,
} from '@/components/tfd/externalComponents/types';

import { mainStatMap } from '@/components/tfd/externalComponents/types';
import { tiers } from '@/utils/types';
import { compareStrings } from '@/utils/utils';

const formatExternalComponentData = (data: ExternalComponentData[]): FormattedExternalComponentData[] =>
  data.map(externalComponent => {
    const statAt100 = externalComponent.base_stat[99];

    return {
      ...externalComponent,
      stat: {
        stat_id: mainStatMap[statAt100.stat_id as MainStatMapKeys],
        stat_value: statAt100.stat_value,
      },
    };
  });

const tiersWeight = tiers.reduce((acc, tier, index) => {
  acc[tier] = index;

  return acc;
}, {} as Record<string, number>);

const partOrder = ['Auxiliary Power', 'Sensor', 'Memory', 'Processor'];

export const sortParts = (a: string, b: string) => {
  const indexA = partOrder.indexOf(a);
  const indexB = partOrder.indexOf(b);

  if (indexA === -1 || indexB === -1) {
    return -1;
  }

  return indexA - indexB;
};

const sortExternalComponentData = (components: ExternalComponentData[]): FormattedExternalComponentData[] =>
  formatExternalComponentData(components).sort((a, b) => {
    const aTier = tiersWeight[a.external_component_tier];
    const bTier = tiersWeight[b.external_component_tier];

    return bTier - aTier;
  });

const addToSetData = (setData: Record<string, FormattedSetData>, component: FormattedExternalComponentData) => {
  const {
    external_component_id,
    external_component_name,
    image_url,
    external_component_equipment_type,
    external_component_tier,
    set_option_detail,
    stat,
  } = component;
  const external_component_set_name = external_component_name
    .replace(/Auxiliary Power|Sensor|Memory|Processor/, '')
    .trim();

  setData[external_component_set_name] ??= {
    external_component_set_name,
    external_component_tier,
    set_option_detail,
  } as FormattedSetData;

  setData[external_component_set_name][external_component_equipment_type] = {
    external_component_id,
    external_component_name,
    image_url,
    stat,
  };

  return setData;
};

const addToBasicData = (basicComponents: FormattedBasicData, component: FormattedExternalComponentData) => {
  const { external_component_equipment_type, external_component_tier, stat, image_url } = component;
  basicComponents[external_component_equipment_type] ??= { image_url } as BasicDataType;
  basicComponents[external_component_equipment_type][external_component_tier] ??= [];
  basicComponents[external_component_equipment_type][external_component_tier].push(stat);

  return basicComponents;
};

export const sortComponentsBySet = (components: ExternalComponentData[]) => {
  const basicComponents = {} as FormattedBasicData;
  const setData = {} as Record<string, FormattedSetData>;
  const sortedData = sortExternalComponentData(components);

  sortedData.forEach(component => {
    if (component.set_option_detail?.[0]) {
      addToSetData(setData, component);
    } else {
      addToBasicData(basicComponents, component);
    }
  });

  const setComponents = Object.values(setData).sort((a, b) => {
    if (a.external_component_tier === b.external_component_tier) {
      return compareStrings(a.external_component_set_name, b.external_component_set_name);
    }

    return compareStrings(b.external_component_tier, a.external_component_tier);
  });

  const setList = setComponents.map(({ external_component_set_name }) => external_component_set_name);
  setList.unshift('All');

  return { basicComponents, setComponents, setList };
};

export const sortComponentsByType = (components: ExternalComponentData[]) => {
  const componentsByType = {} as FormattedExternalComponentsByType;
  const sortedData = sortExternalComponentData(components);

  sortedData.forEach(component => {
    const { external_component_name, external_component_tier } = component;
    if (
      external_component_tier === 'Standard' ||
      (external_component_name.match(/HP|DEF|Shield/) && external_component_tier === 'Rare')
    ) {
      return;
    }

    const { external_component_id, image_url, external_component_equipment_type, set_option_detail, stat } = component;
    const data = {
      external_component_name,
      external_component_id,
      external_component_tier,
      image_url,
      set_option_detail,
      stat,
    } as FormattedExternalComponent;

    data['external_component_set_name'] = external_component_name
      .replace(/Auxiliary Power|Sensor|Memory|Processor/, '')
      .trim();

    componentsByType[external_component_equipment_type] ??= [];
    componentsByType[external_component_equipment_type].push(data);
  });

  return componentsByType;
};

export const filterComponents = (
  components: FormattedExternalComponent[],
  except: FormattedExternalComponent | null,
  search: string,
) =>
  components.filter(({ external_component_id, external_component_set_name, external_component_name, stat }) => {
    if (external_component_id === except?.external_component_id) {
      return false;
    }
    const regex = new RegExp(search, 'i');
    const { stat_id } = stat;
    const validSet = external_component_set_name && regex.test(external_component_set_name);
    const validStat = stat_id && regex.test(stat_id);

    return !search || validSet || regex.test(external_component_name) || validStat;
  });
