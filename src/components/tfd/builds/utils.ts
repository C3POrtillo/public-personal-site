import type { DirectionValues } from '@/components/inputs/types';
import type {
  BuildData,
  DescendantBuild,
  ImportBuildData,
  LiveModuleData,
  WeaponBuild,
} from '@/components/tfd/builds/types';
import type { DescendantFilterMap, FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { ModuleAPIData, ModuleFilterMap } from '@/components/tfd/module/types';
import type { FormattedWeaponData, WeaponFilterMap } from '@/components/tfd/weapon/types';

import { moduleTiers, moduleTypes } from '@/components/tfd/module/types';
import { weaponFilterKeys } from '@/components/tfd/weapon/types';
import { getDPS, getDPSCritical, getDPSCriticalWeakpoint } from '@/components/tfd/weapon/utils';
import { compareStrings } from '@/utils/utils';

export const resetFilter = (filter: ModuleFilterMap, boolean: boolean) => {
  Object.keys(filter).forEach(key => {
    filter[key] = boolean;
  });
  filter['Transcendent'] = false;
  filter['Sub-Attack'] = false;

  return filter;
};

export const setTranscendent = (filter: ModuleFilterMap) => {
  resetFilter(filter, true);
  moduleTiers.forEach(key => {
    filter[key] = false;
  });
  filter['Transcendent'] = true;

  return filter;
};

export const setSubAttack = (filter: ModuleFilterMap) => {
  resetFilter(filter, true);
  moduleTypes.forEach(key => {
    filter[key] = false;
  });
  filter['Sub-Attack'] = true;

  return filter;
};

export const getModuleCost = (module: ModuleAPIData, level: number, catalyst?: boolean, isSubAttack?: boolean) => {
  if (!module) {
    return 0;
  }
  const { module_stat } = module;
  const baseCost = module_stat[level].module_capacity;
  if (isSubAttack) {
    return catalyst ? Math.floor(baseCost * 1.5) : baseCost;
  }

  return catalyst ? Math.ceil(baseCost / 2) : baseCost;
};

export const isValidModule = (
  newModule: ModuleAPIData,
  existingModules: (LiveModuleData | null)[],
  selected: LiveModuleData | null,
): boolean => {
  const { module_type } = newModule;
  const newType = module_type;
  const hasDuplicate = existingModules.some(mod => mod && mod.module_type === newType && newType !== 'None');

  if (module_type === 'Sub-Attack') {
    return true;
  }

  if (!selected) {
    return !hasDuplicate;
  } else {
    return !hasDuplicate || newType === module_type;
  }
};

const negative = ['Skill Cost%', 'Skill Cooldown%', 'Reload Time', 'Recoil%'];

export const formatValue = (key: string, value: number) => {
  const percent = key.slice(-1) === '%' ? ' %' : '';
  const sign = value > 0 ? '+' : '-';
  const x = key.endsWith('Ratio') ? ' x' : '';
  const noSign = Math.abs(value).toString();
  const removeLeadingZero = noSign[0] === '0' ? noSign.slice(1) : noSign;

  return `${value === 0 ? '' : sign}${removeLeadingZero}${percent}${x}`;
};

export const getValueColor = (key: string, value: number) => {
  const compareValue = value * (negative.includes(key) ? -1 : 1);

  return compareValue > 0 ? 'text-green-500' : 'text-red-500';
};

export const getTextColor = (total: number, base: number, key: string) => {
  if (total === base) {
    return undefined;
  }
  const compare = negative.includes(key) ? base > total : base < total;

  return compare ? 'text-green-500' : 'text-red-500';
};

const priorityOrder = [
  'Max HP%',
  'Max HP',
  'Max Shield%',
  'Max Shield',
  'Max MP%',
  'DEF%',
  'DEF',
  'Skill Power',
  'Skill Power%',
  'Sub-Attack Power',
  'Optimization Skill Power Multiplier%',
];

const startsWithOrder = [
  /^Skill/,
  /^Non-Attribute Skill/,
  /^Fire Skill/,
  /^Chill Skill/,
  /^Electric Skill/,
  /^Toxi[c|n] Skill/,
  /^Singular Skill/,
  /^Dimension Skill/,
  /^Fusion Skill/,
  /^Tech Skill/,
  /^Explosive ATK/,
  /^Firearm ATK/,
  /^Fire Rate/,
  /^Firearm.*Rate/,
  /^Firearm.*Damage/,
  /^Weak Point/,
  /^Reload Time/,
];

const endsWithOrder = [/Resistance%?$/];

const defaultOrder = priorityOrder.length + startsWithOrder.length + endsWithOrder.length + 2;

export const sortStats = (a: string, b: string) => {
  const getPriority = (key: string) => {
    const exactIndex = priorityOrder.findIndex(priority => key === priority);
    if (exactIndex !== -1) {
      return exactIndex;
    }

    const startsWithIndex = startsWithOrder.findIndex(prefix => key.match(prefix));
    if (startsWithIndex !== -1) {
      return priorityOrder.length + startsWithIndex;
    }

    const endsWithIndex = endsWithOrder.findIndex(prefix => key.match(prefix));
    if (endsWithIndex !== -1) {
      return priorityOrder.length + startsWithOrder.length + endsWithIndex;
    }

    return defaultOrder;
  };

  const priorityA = getPriority(a);
  const priorityB = getPriority(b);

  if (priorityA === priorityB || (priorityA === defaultOrder && priorityB === defaultOrder)) {
    return a.localeCompare(b);
  }

  return priorityA - priorityB;
};

type ImportOptions = {
  buildFor?: string;
  user_id?: string;
  id?: string;
};

export const importBuilds = async (options?: ImportOptions) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  try {
    const url = `${baseUrl}/api/importBuildData`;
    const body = options ? JSON.stringify(options) : null;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const result = await response.json();

    if (result.length === 0) {
      throw new Error('No Data Retrieved');
    }

    const buildData = result
      .map((build: Record<string, string>) => {
        const { modules, equipment } = build;

        return {
          ...build,
          modules: JSON.parse(modules),
          equipment: JSON.parse(equipment),
        };
      })
      .reduce((acc: ImportBuildData, data: BuildData) => {
        const { build } = data;
        acc[build] ??= [];
        acc[build].unshift(data);

        return acc;
      }, {} as ImportBuildData);

    return buildData;
  } catch (error) {
    return null;
  }
};

const getFlat = (stats: Record<string, number>, key: string, value: number) =>
  stats[`${key}`] ? value + stats[`${key}`] : value;

const accuracy = ['Hip Fire Accuracy', 'Aimed Shot Accuracy'];

const getModifier = (stats: Record<string, number>, key: string) => {
  if (key === 'Reload Time') {
    const stat = stats['Reload Time Modifier%'];

    return stat ? 1 - stat / 100 : 1;
  }
  if (accuracy.includes(key)) {
    const stat = stats['Accuracy%'];

    return stat ? stat / 100 + 1 : 1;
  }

  const stat = stats[`${key}%`];

  return stat ? stat / 100 + 1 : 1;
};

export const calculateStat = (stats: Record<string, number>, key: string, value: number) => {
  const flat = getFlat(stats, key, value);
  const modifier = getModifier(stats, key);

  return flat * modifier;
};

const suffixMap = {
  'Firearm Critical Hit Rate': '%',
  'Firearm Critical Hit Damage': 'x',
  'Weak Point Damage': 'x',
  'Attribute Status Effect Trigger Rate': '%',
  'ATK Drop-off Modifier': 'x',
  Burst: '%',
  Pierce: '%',
  Crush: '%',
} as Record<string, string>;

const enforceDecimal = [
  'Firearm Critical Hit Rate',
  'Firearm Critical Hit Damage',
  'Weak Point Damage',
  'Attribute Status Effect Trigger Rate',
  'ATK Drop-off Modifier',
  'Shield Recovery Out of Combat',
  'Shield Recovery In Combat',
];

const formatTotal = (total: number, key: string) => {
  if (enforceDecimal.includes(key) && total) {
    return total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  return Number(total.toFixed(2)).toLocaleString('en', { useGrouping: true });
};

export const formatStat = (total: number, key: string) => {
  const formattedTotal = formatTotal(total, key);

  return suffixMap[key] ? `${formattedTotal}${suffixMap[key]}` : formattedTotal;
};

export const getBuildDPS = (
  stats: Record<string, number>,
  {
    firearmAtk,
    magazineSize,
    fireRate,
    criticalChance,
    criticalDamage,
    weakPointDamage,
    reloadTime,
  }: FormattedWeaponData,
) => {
  const dps = getDPS({
    firearmAtk: calculateStat(stats, 'Firearm ATK', firearmAtk),
    fireRate: calculateStat(stats, 'Fire Rate', fireRate),
    magazineCapacity: calculateStat(stats, 'Rounds per Magazine', magazineSize),
    reloadTime: calculateStat(stats, 'Reload Time', reloadTime),
  });

  const critical = getDPSCritical({
    dps,
    criticalChance: calculateStat(stats, 'Firearm Critical Hit Rate', criticalChance),
    criticalDamage: calculateStat(stats, 'Firearm Critical Hit Damage', criticalDamage),
  });

  const weakPoint = getDPSCriticalWeakpoint({
    dpsCritical: critical,
    weakPointDamage: calculateStat(stats, 'Weak Point Damage', weakPointDamage),
  });

  return {
    DPS: Number(Math.round(critical).toFixed(0)).toLocaleString('en', { useGrouping: true }),
    'Weak Point DPS': Number(Math.round(weakPoint).toFixed(0)).toLocaleString('en', { useGrouping: true }),
  };
};

export const sortBuilds = (
  builds: DescendantBuild[] | WeaponBuild[],
  sortDirection: DirectionValues,
  sortColumn: string,
) =>
  builds.sort(
    (
      { buildFor: aFor, upvotes: aUpvotes, downvotes: aDownvotes, updated_at: aDate },
      { buildFor: bFor, upvotes: bUpvotes, downvotes: bDownvotes, updated_at: bDate },
    ) => {
      if (sortDirection === 0) {
        return compareStrings(aFor, bFor);
      }
      const isReversed = sortDirection === 2;
      let a = (aUpvotes || 0) - (aDownvotes || 0);
      let b = (bUpvotes || 0) - (bDownvotes || 0);
      if (sortColumn === 'Date' && aDate && bDate) {
        a = new Date(aDate).valueOf();
        b = new Date(bDate).valueOf();
      }

      return isReversed ? b - a : a - b;
    },
  );

export const filterDescendantBuilds = (
  builds: DescendantBuild[] | WeaponBuild[],
  descendants: Record<string, FormattedDescendantData>,
  filterMap: DescendantFilterMap,
  searchFilter: string,
) => {
  const regex = new RegExp(searchFilter, 'i');

  const filteredBuilds = (builds as DescendantBuild[]).filter(({ buildFor, title, username }) => {
    const { attribute, is_ultimate, descendant_name } = descendants[buildFor];
    const isValidAttribute = filterMap[attribute];
    const isValidTier = is_ultimate ? filterMap['Ultimate'] : filterMap['Standard'];
    const isValidSearch =
      !searchFilter ||
      regex.test(descendant_name) ||
      regex.test(attribute) ||
      regex.test(title) ||
      (username && regex.test(username));

    return isValidAttribute && isValidTier && isValidSearch;
  });

  return filteredBuilds;
};

export const filterWeaponBuilds = (
  builds: DescendantBuild[] | WeaponBuild[],
  weapons: Record<string, FormattedWeaponData>,
  filterMap: WeaponFilterMap,
  searchFilter: string,
) => {
  const regex = new RegExp(searchFilter, 'i');

  const filteredBuilds = builds.filter(({ buildFor, title, username }) => {
    const { weapon_name, weapon_rounds_type, weapon_type } = weapons[buildFor];
    const isValidWeapon = weaponFilterKeys.every(key => filterMap[weapons[buildFor][key]]);
    const isValidSearch =
      !searchFilter ||
      regex.test(weapon_name) ||
      regex.test(weapon_rounds_type) ||
      regex.test(weapon_type) ||
      regex.test(title) ||
      (username && regex.test(username));

    return isValidWeapon && isValidSearch;
  });

  return filteredBuilds;
};
