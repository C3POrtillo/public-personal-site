import type { FilterOptionsData } from '@/components/inputs/types';
import type { BaseStat, TiersType } from '@/utils/types';

import { tiers } from '@/utils/types';

export const externalComponentStats = {
  stat: ['HP', 'DEF', 'Shield'],
  subStats: {
    'Auxiliary Power': {
      'Max HP': {
        min: '411',
        max: '914',
      },
      'Fire Resistance': {
        min: '1608',
        max: '3860',
      },
      'Module Drop Rate': {
        min: '0.111x',
        max: '0.191x	',
      },
      'Kuiper Drop Rate': {
        min: '0.111x',
        max: '0.191x	',
      },
      'MP Recovery out of Combat': {
        min: '1.791',
        max: '2.454',
      },
      'DBNO Duration': {
        min: '0.208x',
        max: '0.318x',
      },
    },
    Sensor: {
      'Max MP': {
        min: '110',
        max: '160',
      },
      'Chill Resistance': {
        min: '1608',
        max: '3860',
      },
      'Consumable Drop Rate': {
        min: '0.111x',
        max: '0.191x	',
      },
      'Character EXP Gain Modifier': {
        min: '0.111x',
        max: '0.191x	',
      },
      'Shield Recovery out of Combat': {
        min: '11.582',
        max: '16.591',
      },
      'MP Recovery in Combat': {
        min: '0.208',
        max: '0.284',
      },
      'HP Recovery Modifier': {
        min: '0.057',
        max: '0.085',
      },
    },
    Memory: {
      DEF: {
        min: '1724',
        max: '4249',
      },
      'Electric Resistance': {
        min: '1608',
        max: '3860',
      },
      'Gold Drop Rate': {
        min: '0.111x',
        max: '0.191x	',
      },
      'Firearm Proficiency Gain Modifier': {
        min: '0.111x',
        max: '0.191x	',
      },
      'Shield Recovery in Combat': {
        min: '3.271',
        max: '5.033',
      },
      'MP Recovery Modifier': {
        min: '0.108',
        max: '0.160',
      },
      'Ecive Search Radius': {
        min: '50.60%',
        max: '76.60%',
      },
    },
    Processor: {
      'Max Shield': {
        min: '124',
        max: '283',
      },
      'Toxin Resistance': {
        min: '1608',
        max: '3860',
      },
      'Equipment Drop Rate': {
        min: '0.111x',
        max: '0.191x	',
      },
      'Shield Recovery Modifier': {
        min: '0.057',
        max: '0.085',
      },
      'Item Acquisition DIstance': {
        min: '0.165x',
        max: '0.253x',
      },
      'Ecive Display Time': {
        min: '50.90%',
        max: '97.20%',
      },
    },
  },
} as const;

type T = typeof externalComponentStats;
export type ExternalComponentTypes = keyof T['subStats'];
type MainStatTypes = T['stat'][number];

type SetOptionData = {
  set_option: string;
  set_count: number;
  set_option_effect: string;
};

type BaseComponentData = {
  external_component_name: string;
  external_component_id: string;
  image_url: string;
};

type ExternalComponentAPIData = BaseComponentData & {
  external_component_equipment_type: ExternalComponentTypes;
  external_component_tier: TiersType;
  set_option_detail?: SetOptionData[];
};

type ExternalComponentBaseStat = BaseStat &
  {
    level: number;
  }[];

export const mainStatMap = {
  '105000001': 'HP',
  '105000029': 'DEF',
  '105000025': 'Shield',
} as const;

export const mainStats = Object.values(mainStatMap) as MainStatTypes[];

export type MainStatMapKeys = keyof typeof mainStatMap;

export type ExternalComponentData = ExternalComponentAPIData & {
  base_stat: ExternalComponentBaseStat[];
};

export type FormattedExternalComponentData = ExternalComponentAPIData & {
  stat: BaseStat;
};

type ExternalComponent = BaseComponentData & {
  stat: BaseStat;
};

export type FormattedSetData = {
  external_component_set_name: string;
  external_component_tier: TiersType;
  set_option_detail: SetOptionData[];
} & Record<ExternalComponentTypes, ExternalComponent>;

export type BasicDataType = {
  image_url: string;
  Standard?: BaseStat[];
  Rare?: BaseStat[];
  Ultimate?: BaseStat[];
};

export type FormattedBasicData = Record<ExternalComponentTypes, BasicDataType>;

export type FormattedExternalComponent = ExternalComponent & {
  external_component_tier: TiersType;
  external_component_set_name?: string;
  set_option_detail?: SetOptionData[];
};

export type FormattedExternalComponentsByType = Record<ExternalComponentTypes, FormattedExternalComponent[]>;

export const externalComponentsArray = Object.keys(externalComponentStats.subStats) as ExternalComponentTypes[];

export const filterOptions: FilterOptionsData = {
  label: 'Tier',
  name: 'external_component_tier',
  data: tiers.slice(1).map(value => ({ value })),
};
type ExternalComponentsFilterTypes = ExternalComponentTypes | TiersType;
export type ExternalComponentsFilterMap = Partial<Record<ExternalComponentsFilterTypes, boolean | undefined>>;
