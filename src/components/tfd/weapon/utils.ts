import type {
  FormattedWeaponData,
  RoundsType,
  WeaponAPIData,
  WeaponFilterMap,
  WeaponType,
} from '@/components/tfd/weapon/types';
import type { BaseStat } from '@/utils/types';

import { roundsArray, statData, weaponFilterKeys, weaponRounds } from '@/components/tfd/weapon/types';
import { statMap } from '@/utils/stats/stats';
import { tiers } from '@/utils/types';
import { compareStrings } from '@/utils/utils';

type DPSProps = Record<string, number>;

export const getDPS = ({ firearmAtk, magazineCapacity, fireRate, reloadTime }: DPSProps) =>
  (firearmAtk * magazineCapacity) / (magazineCapacity / (fireRate / 60) + reloadTime);

export const getDPSCritical = ({ dps, criticalChance, criticalDamage }: DPSProps) =>
  dps * (1 + (criticalChance / 100) * (criticalDamage - 1));

export const getDPSCriticalWeakpoint = ({ dpsCritical, weakPointDamage }: DPSProps) =>
  dpsCritical * (weakPointDamage + 0.5);

export const createWeaponLabel = (value: string) => {
  let rounds = '';

  for (const [key, weapons] of Object.entries(weaponRounds)) {
    const typeSafeArray: string[] = [...weapons];
    if (typeSafeArray.includes(value)) {
      rounds = key;
      break;
    }
  }

  return rounds;
};

export const sortRounds = (a: string, b: string) =>
  roundsArray.findIndex(priority => a === priority) - roundsArray.findIndex(priority => b === priority);

const defaultWeaponSort = (
  {
    weapon_type: aType,
    weapon_rounds_type: aRounds,
    weapon_tier: aTier,
    weapon_name: aName,
  }: WeaponAPIData | FormattedWeaponData,
  {
    weapon_type: bType,
    weapon_rounds_type: bRounds,
    weapon_tier: bTier,
    weapon_name: bName,
  }: WeaponAPIData | FormattedWeaponData,
) => {
  if (aRounds !== bRounds) {
    return sortRounds(aRounds, bRounds);
  }
  if (aType !== bType) {
    return compareStrings(aType, bType);
  }
  if (aTier !== bTier) {
    return tiers.findIndex(priority => bTier === priority) - tiers.findIndex(priority => aTier === priority);
  }

  return compareStrings(aName, bName);
};

const priorityOrder = [
  'Firearm ATK',
  'Fire Rate',
  'Firearm Critical Hit Rate',
  'Firearm Critical Hit Damage',
  'Weak Point Damage',
  'Rounds per Magazine',
  'Reload Time',
  'Attribute Status Effect Trigger Rate',
  'Movement Speed While Aiming',
  'Hip Fire Accuracy',
  'Aimed Shot Accuracy',
];

const defaultOrder = priorityOrder.length;

export const reformatWeaponData = (weaponData: WeaponAPIData[]): FormattedWeaponData[] =>
  weaponData
    .sort(defaultWeaponSort)
    .map(({ image_url, weapon_id, weapon_name, weapon_rounds_type, weapon_tier, weapon_type, base_stat, ...data }) => {
      const firearmAtk = data.firearm_atk[99].firearm[0].firearm_atk_value;
      const statsWithText = [{ stat_id: '105000026', stat_value: firearmAtk }, ...base_stat]
        .map(({ stat_id, stat_value }) => {
          const stat_type = statMap[stat_id as string];
          if (!stat_type) {
            return;
          }

          return { stat_type, stat_value } as BaseStat;
        })
        .filter(stat => !!stat)
        .sort(({ stat_type: aType }, { stat_type: bType }) => {
          const getPriority = (key: string) => {
            const exactIndex = priorityOrder.findIndex(priority => key === priority);
            if (exactIndex !== -1) {
              return exactIndex;
            }

            return defaultOrder;
          };
          const a = getPriority(aType as string);
          const b = getPriority(bType as string);
          if (a === b || (a === defaultOrder && b === defaultOrder)) {
            compareStrings(aType as string, bType as string);
          }

          return a - b;
        });

      const filteredStats = base_stat
        .filter(({ stat_id }) => stat_id && Object.keys(statData).includes(stat_id))
        .reduce((acc: Record<string, number>, { stat_id, stat_value }) => {
          if (stat_id) {
            acc[stat_id] = stat_value;
          }

          return acc;
        }, {});

      const fireRate = filteredStats['105000023'];
      const magazineSize = filteredStats['105000021'];
      const reloadTime = filteredStats['105000095'];
      const criticalChance = filteredStats['105000030'];
      const criticalDamage = filteredStats['105000031'];
      const weakPointDamage = filteredStats['105000035'];

      const baseDps = getDPS({ firearmAtk, magazineCapacity: magazineSize, fireRate, reloadTime });
      const criticalDps = getDPSCritical({ dps: baseDps, criticalChance, criticalDamage });
      const criticalWWeakPointDps = getDPSCriticalWeakpoint({ dpsCritical: criticalDps, weakPointDamage });

      return {
        image_url,
        weapon_id,
        weapon_name,
        weapon_rounds_type,
        weapon_tier,
        weapon_type,
        firearmAtk,
        magazineSize,
        fireRate,
        criticalChance,
        criticalDamage,
        weakPointDamage,
        reloadTime,
        statusChance: filteredStats['105000170'],
        baseDps,
        criticalDps,
        criticalWWeakPointDps,
        base_stat: statsWithText,
        ...data,
      };
    });

export const filterAndSortWeapons = (weapons: FormattedWeaponData[], filter: WeaponFilterMap, searchFilter: string) =>
  weapons
    .filter(weapon => {
      const regex = new RegExp(searchFilter, 'i');
      const { weapon_rounds_type, weapon_tier, weapon_name, weapon_type } = weapon;
      const isValid = weaponFilterKeys.every(key => filter[weapon[key]]);
      const isValidSearch =
        !searchFilter ||
        regex.test(weapon_tier) ||
        regex.test(weapon_rounds_type) ||
        regex.test(weapon_type) ||
        regex.test(weapon_name);

      return isValid && isValidSearch;
    })
    .sort(defaultWeaponSort);

export const typeToRounds = (weaponType: WeaponType) => {
  for (const [round, weapons] of Object.entries(weaponRounds)) {
    if ((weapons as readonly WeaponType[]).includes(weaponType)) {
      return round as RoundsType;
    }
  }

  return undefined;
};
