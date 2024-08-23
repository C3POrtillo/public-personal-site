import type { FilterOptionsData } from '@/components/inputs/types';
import type {
  BlueprintDataMap,
  BlueprintFilterMap,
  BlueprintPart,
  BlueprintTypes,
  DescendantParts,
  HardRates,
  MissionFilterMap,
  NormalRates,
  Pattern,
  RateTypes,
  WeaponParts,
} from '@/components/tfd/patterns/types';

import {
  blueprintSet,
  descendantParts,
  enhance,
  hardRates,
  missionTypes,
  normalRates,
  weaponParts,
} from '@/components/tfd/patterns/types';
import { sortRounds } from '@/components/tfd/weapon/utils';
import { sortAttributes } from '@/utils/attributes/utils';
import { compareRates, compareStrings, createFilterMap, kebabCase } from '@/utils/utils';

const getAttribute = (descendant: string) => {
  switch (descendant) {
    case 'Lepic':
    case 'Ultimate Lepic':
      return 'Fire';
    case 'Ultimate Bunny':
      return 'Electric';
    case 'Ultimate Viessa':
    case 'Viessa':
      return 'Chill';
    default:
      return 'Non-Attribute';
  }
};

const getRounds = (weapon: string) => {
  switch (weapon) {
    case 'Afterglow Sword':
    case 'Executor':
    case 'Smithereens':
    case 'Piercing Light':
    case 'Restored Relic':
      return 'High-Power Rounds';
    case 'Blue Beetle':
    case "Nazeistra's Devotion":
    case 'Perforator':
    case 'Wave of Light':
      return 'Impact Rounds';
    case 'Clairvoyance':
    case "Greg's Reversed Fate":
    case "King's Guard Lance":
    case 'Secret Garden':
      return 'Special Rounds';
    default:
      return 'General Rounds';
  }
};

export const getRarity = (item: string) => {
  switch (item) {
    case item.match(/Catalyst/)?.input:
      return 'Rare';
    default:
      return 'Ultimate';
  }
};

const processParts = (
  blueprint: string,
  parts: readonly string[],
  transform: (part: string) => string,
): string | null => {
  for (const part of parts) {
    if (blueprint.includes(part)) {
      return transform(blueprint.split(part)[0].trim());
    }
  }

  return null;
};

export const getBlueprintClass = (blueprint: string): string =>
  processParts(blueprint, enhance, getRarity) ||
  processParts(blueprint, descendantParts, getAttribute) ||
  processParts(blueprint, weaponParts, getRounds) ||
  '';

const isEnhance = (blueprint: string) => enhance.some(item => blueprint.includes(item));

const extractAndAddToSet = (blueprint: string, parts: readonly string[], set: Set<string>) =>
  parts.every(part => {
    if (blueprint.includes(part)) {
      set.add(blueprint.split(part)[0].trim());

      return false;
    }

    return true;
  });

type BlueprintWithRate = {
  rate: NormalRates | HardRates;
  blueprint: RateTypes;
  name?: string;
};

const getRates = (pattern: Pattern) => (pattern['38%'] ? normalRates : hardRates);

export const getBlueprints = (pattern: Pattern, withRates?: boolean): RateTypes[] | BlueprintWithRate[] => {
  const keys = getRates(pattern);

  if (withRates) {
    return keys.map(rate => ({ rate, blueprint: pattern[rate] })) as BlueprintWithRate[];
  }

  return keys.map(rate => pattern[rate]) as RateTypes[];
};

const isValidMission = (mT: boolean, mS: boolean, s: boolean) => {
  if (mT && !mS && s) {
    return false;
  }

  return mT || (mS && s);
};

type FilterCount = {
  pattern: Pattern;
  blueprints: BlueprintWithRate[];
};

const sortFilterCount = (a: FilterCount, b: FilterCount) => {
  const aLength = a.blueprints.length;
  const bLength = b.blueprints.length;

  if (aLength === 1 && bLength === 1) {
    const { name: aName, rate: aRate, blueprint: aBlueprintName } = a.blueprints[0];
    const { name: bName, rate: bRate, blueprint: bBlueprintName } = b.blueprints[0];

    if (aName === bName) {
      return aRate === bRate
        ? compareStrings(aBlueprintName as string, bBlueprintName as string)
        : compareRates(bRate, aRate);
    }

    return compareStrings(aName as string, bName as string);
  }

  return bLength - aLength;
};

const getName = (blueprint: string) => {
  const filteredPart = [...weaponParts, ...descendantParts].filter(part => blueprint.includes(part))[0];

  return blueprint.replace(filteredPart, '').trim();
};

const createValidBlueprint = (rate: NormalRates | HardRates, blueprint: BlueprintTypes, isValid?: boolean | number) => {
  if (isValid) {
    const name = getName(blueprint);

    return { rate, blueprint, name };
  }

  return false;
};

type FilterAndSortPatternsOptions = {
  missionFilter: MissionFilterMap;
  itemFilter?: BlueprintFilterMap;
  isAll?: boolean;
};

const filterPatterns = (patternData: Pattern[], { missionFilter, itemFilter }: FilterAndSortPatternsOptions) =>
  patternData.reduce((acc, pattern) => {
    const { type, stealth } = pattern;
    const blueprints =
      isValidMission(!!missionFilter[type], !!missionFilter['Stealth'], !!stealth) &&
      ((getBlueprints(pattern, true) as BlueprintWithRate[])
        .map(({ rate, blueprint }) => {
          if (typeof blueprint === 'string') {
            return createValidBlueprint(rate, blueprint, itemFilter?.[blueprint]);
          }
          const matchingBlueprint = blueprint.filter(drop => itemFilter?.[drop]);

          return createValidBlueprint(rate, matchingBlueprint[0], matchingBlueprint.length);
        })
        .filter(blueprint => blueprint && blueprint.blueprint?.length) as BlueprintWithRate[]);

    if (blueprints && blueprints.length) {
      acc.push({ pattern, blueprints });
    }

    return acc;
  }, [] as FilterCount[]);

export const filterAndSortPatterns = (
  patternData: Pattern[],
  { missionFilter, itemFilter, isAll }: FilterAndSortPatternsOptions,
) => {
  if (isAll) {
    return patternData.filter(({ type, stealth }) =>
      isValidMission(!!missionFilter[type], !!missionFilter['Stealth'], !!stealth),
    );
  }

  return filterPatterns(patternData, { missionFilter, itemFilter })
    .sort(sortFilterCount)
    .map(({ pattern }) => pattern);
};

const createFilterFromSet = (
  set: Set<string>,
  parts: readonly string[],
  transform: (item: string) => string,
  sort: (a: string, b: string) => number,
) =>
  Array.from(set)
    .sort((a, b) => {
      const aTransform = transform(a);
      const bTransform = transform(b);

      if (aTransform !== bTransform) {
        return sort(aTransform, bTransform);
      }

      const aName = a.replace('Ultimate ', '');
      const bName = b.replace('Ultimate ', '');

      if (aName !== bName) {
        return compareStrings(aName, bName);
      }

      if (a.includes('Ultimate')) {
        return 1;
      } else if (b.includes('Ultimate')) {
        return -1;
      }

      return compareStrings(a, b);
    })
    .map(
      (item: string) =>
        ({
          label: item,
          name: transform(item),
          data: parts.map(part => ({
            value: `${item} ${part}`,
            label: part,
          })),
          labelClassName: item.includes('Ultimate') ? 'label-ultimate' : `label-${kebabCase(transform(item))}`,
          defaultChecked: false,
        } as FilterOptionsData),
    );
const filterBlueprints = (name: string, pattern: Pattern): BlueprintWithRate | undefined => {
  const matchingBlueprint = (getBlueprints(pattern, true) as BlueprintWithRate[]).find(({ blueprint }) => {
    const matchingItem = typeof blueprint === 'string' ? blueprint : blueprint.find(item => item.startsWith(name));

    return matchingItem && matchingItem.startsWith(name);
  });

  if (matchingBlueprint) {
    const { rate, blueprint } = matchingBlueprint;
    const matchingItem = typeof blueprint === 'string' ? blueprint : blueprint.find(item => item.startsWith(name));

    if (matchingItem) {
      return { rate, blueprint: matchingItem };
    }
  }

  return undefined;
};

export const patternToBlueprintData = (name: string, patternData: readonly Pattern[]) => {
  const blueprintData = patternData.reduce((acc, pattern) => {
    const filteredBlueprint = filterBlueprints(name, pattern);
    if (!filteredBlueprint || typeof filteredBlueprint.blueprint !== 'string') {
      return acc;
    }
    const { rate, blueprint } = filteredBlueprint;
    const key = blueprint.replace(name, '').trim() as WeaponParts | DescendantParts;
    (acc[key] ??= {} as BlueprintPart)[rate] ??= [];
    acc[key][rate].push(pattern);

    return acc;
  }, {} as BlueprintDataMap);

  if (Object.keys(blueprintData).length) {
    return blueprintData;
  }

  return null;
};

export const createFilters = () => {
  const descendants = new Set<string>();
  const weapons = new Set<string>();
  const itemFilterMap = {} as BlueprintFilterMap;

  blueprintSet.forEach(blueprint => {
    itemFilterMap[blueprint] = false;

    if (isEnhance(blueprint)) {
      return;
    }

    if (extractAndAddToSet(blueprint, descendantParts, descendants)) {
      extractAndAddToSet(blueprint, weaponParts, weapons);
    }
  });

  return {
    itemFilterMap,
    missionFilterMap: createFilterMap(missionTypes) as MissionFilterMap,
    descendantOptions: createFilterFromSet(descendants, descendantParts, getAttribute, sortAttributes),
    weaponOptions: createFilterFromSet(weapons, weaponParts, getRounds, sortRounds),
  };
};

export const patternIsHard = (pattern: string) => Number(pattern) >= 54; // 54 is the first hard pattern
export const isSelected = (item: BlueprintTypes, itemFilter?: BlueprintFilterMap) =>
  itemFilter?.[item] && 'bg-neutral-600 border-1 border-neutral-300';

export const sortPart = (a: string, b: string) => {
  let priorityA, priorityB;
  if (descendantParts.includes(a as DescendantParts)) {
    priorityA = descendantParts.findIndex(priority => a === priority);
    priorityB = descendantParts.findIndex(priority => b === priority);
  } else {
    priorityA = weaponParts.findIndex(priority => a === priority);
    priorityB = weaponParts.findIndex(priority => b === priority);
  }

  return priorityA - priorityB;
};
