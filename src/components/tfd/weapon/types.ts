import type { FilterOptionsData } from '@/components/inputs/types';
import type { BaseStat, TiersType } from '@/utils/types';

import { tiers } from '@/utils/types';
import { kebabCase } from '@/utils/utils';

type FirearmAtk = {
  level: number;
  firearm: {
    firearm_atk_type: string;
    firearm_atk_value: number;
  }[];
};

export const statData = {
  '105000023': 'Fire Rate',
  '105000021': 'Magazine\nSize',
  '105000095': 'Reload\nTime',
  '105000030': 'Critical\nChance',
  '105000031': 'Critical\nDamage',
  '105000170': 'Status\nChance',
  '105000035': 'Weak Point\nDamage',
} as const;

export const weaponTableHeaders = [
  'Weapon\n(Lvl. 100)',
  'Firearm\nATK',
  ...Object.values(statData),
  'Base DPS',
  'Critical DPS',
  'Critical w/\nWeak Point DPS',
] as const;

export const weaponRounds = {
  'General Rounds': ['Assault Rifle', 'Handgun', 'Machine Gun', 'Submachine Gun'],
  'Impact Rounds': ['Hand Cannon', 'Scout Rifle'],
  'Special Rounds': ['Beam Rifle', 'Tactical Rifle'],
  'High-Power Rounds': ['Launcher', 'Shotgun', 'Sniper Rifle'],
} as const;

export type RoundsType = keyof typeof weaponRounds;
export const roundsArray = Object.keys(weaponRounds) as RoundsType[];

export type WeaponType = (typeof weaponRounds)[keyof typeof weaponRounds][number];
export const weaponArray: WeaponType[] = Object.values(weaponRounds).flat();

export type WeaponFilterTypes = RoundsType | TiersType | WeaponType;
export const weaponFilterKeys = ['weapon_rounds_type', 'weapon_tier', 'weapon_type'] as const;
export type WeaponFilterMap = Partial<Record<WeaponFilterTypes, boolean | undefined>>;

export const roundsImages = roundsArray.reduce((acc, rounds) => {
  acc[rounds] = `/assets/images/rounds/${kebabCase(rounds)}.png`;

  return acc;
}, {} as Record<RoundsType, string>);

const weaponToRounds = (weapon: WeaponType): RoundsType => {
  for (const [rounds, weapons] of Object.entries(weaponRounds)) {
    if ((weapons as unknown as WeaponType[]).includes(weapon)) {
      return rounds as RoundsType;
    }
  }

  return 'General Rounds';
};

export const tierOptions = {
  label: 'Tier',
  name: 'tier',
  data: tiers.map(value => ({ value })),
};

export const weaponOptions: FilterOptionsData[] = [
  tierOptions,
  {
    label: 'Rounds',
    name: 'rounds-type',
    data: Object.entries(roundsImages).map(([rounds, icon]) => ({
      value: rounds,
      icon: {
        src: icon,
        backgroundClass: 'diamond',
      },
    })),
  },
  {
    label: 'Type',
    name: 'weapon-type',
    data: weaponArray.map(value => ({
      value,
      icon: {
        src: roundsImages[weaponToRounds(value)],
        backgroundClass: 'diamond',
      },
    })),
  },
] as const;

export type WeaponAPIData = {
  base_stat: BaseStat[];
  firearm_atk: FirearmAtk[];
  image_url: string;
  weapon_id: string;
  weapon_name: string;
  weapon_perk_ability_description: string | null;
  weapon_perk_ability_image_url: string | null;
  weapon_perk_ability_name: string | null;
  weapon_rounds_type: RoundsType;
  weapon_tier: TiersType;
  weapon_type: WeaponType;
};

export type FormattedWeaponData = WeaponAPIData & {
  firearmAtk: number;
  magazineSize: number;
  fireRate: number;
  criticalChance: number;
  criticalDamage: number;
  weakPointDamage: number;
  reloadTime: number;
  statusChance: number;
  baseDps: number;
  criticalDps: number;
  criticalWWeakPointDps: number;
};

export const statFilter = [
  'Firearm ATK',
  'Fire Rate',
  'Firearm Critical Hit Rate',
  'Firearm Critical Hit Damage',
  'Weak Point Damage',
];

export const normalMissionDrops = {
  'Fallen Hope': {
    'Polymer Syncytium': {
      zone: 'White-Night Gulch',
      subregion: 'The Mountaintops',
      mission: 'Border Line of Truth',
      type: 'Battlefield',
      dropRate: 20,
    },
    'Synthetic Fiber': {
      zone: 'White-Night Gulch',
      subregion: 'Observatory',
      mission: 'Eye of Truth',
      type: 'Battlefield',
      dropRate: 20,
    },
    'Nano Tube': {
      zone: 'White-Night Gulch',
      subregion: 'Shipment Base',
      mission: 'Altar',
      type: 'Battlefield',
      dropRate: 20,
    },
    Blueprint: {
      zone: 'White-Night Gulch',
      subregion: 'Hatchery',
      mission: 'Lower Hatchery',
      type: 'Battlefield',
      dropRate: 20,
    },
  },
  'Thunder Cage': {
    'Polymer Syncytium': {
      zone: 'Sterile Land',
      subregion: 'Rockfall',
      mission: 'External Reactor',
      type: 'Battlefield',
      dropRate: 20,
    },
    'Synthetic Fiber': {
      zone: 'Sterile Land',
      subregion: 'Repository',
      mission: 'External Reactor',
      type: 'Battlefield',
      dropRate: 20,
    },
    'Nano Tube': {
      zone: 'Sterile Land',
      subregion: 'Restricted Zone',
      mission: 'High-Powered Jammer',
      type: 'Battlefield',
      dropRate: 20,
    },
    Blueprint: {
      zone: 'Sterile Land',
      subregion: 'Ironworks',
      mission: 'Logistics Facility',
      type: 'Battlefield',
      dropRate: 20,
    },
  },
  'The Last Dagger': {
    'Polymer Syncytium': {
      zone: 'Echo Swamp',
      subregion: 'Misty Woods',
      mission: 'Kuiper Transport Route',
      type: 'Battlefield',
      dropRate: 20,
    },
    'Synthetic Fiber': {
      zone: 'Echo Swamp',
      subregion: 'Abandoned Zone',
      mission: 'Abandoned Refinery Unit',
      type: 'Battlefield',
      dropRate: 20,
    },
    'Nano Tube': {
      zone: 'Echo Swamp',
      subregion: 'Muskeg Swamp',
      mission: 'The Tree of Truth',
      type: 'Battlefield',
      dropRate: 20,
    },
    Blueprint: {
      zone: 'Echo Swamp',
      subregion: 'Derelict Covert',
      mission: 'Emergency Landing Strip',
      type: 'Battlefield',
      dropRate: 20,
    },
  },
  'Peace Maker': {
    'Polymer Syncytium': {
      mission: 'Gluttony',
      type: 'Intercept',
      dropRate: 0,
    },
    'Synthetic Fiber': {
      mission: 'Gluttony',
      type: 'Intercept',
      dropRate: 0,
    },
    'Nano Tube': {
      mission: 'Gluttony',
      type: 'Intercept',
      dropRate: 0,
    },
    Blueprint: {
      mission: 'Gluttony',
      type: 'Intercept',
      dropRate: 0,
    },
  },
} as const;

export const elementalAtk = ['Fire', 'Chill', 'Electric', 'Toxic'] as const;
export const factionAtk = [
  '(vs. Colossus)',
  '(vs. Legion of Darkness)',
  '(vs. Order of Truth)',
  '(vs. Legion of Immortality)',
] as const;
export const commonStats = {
  'Firearm ATK': {
    min: '10.00%',
    max: '12.20%',
  },

  'Weak Point Damage': {
    min: '8.20%',
    max: '12.00%',
  },

  'Attribute Status Effect Trigger Rate': {
    min: '16.40%',
    max: '24.00%',
  },

  'Rounds per Magazine': {
    min: '8.20%',
    max: '12.00%',
  },

  Recoil: {
    min: '-0.102x',
    max: '-0.124x',
  },
  'Hip Fire Accuracy': {
    min: '10.20%',
    max: '12.40%',
  },

  'Weapon Change Speed': {
    min: '11.40%',
    max: '16.50%',
  },
} as const;

export const subStats = {
  'Assault Rifle': {
    ATK: {
      min: '931',
      max: '1679',
    },
    'Firearm Critical Hit Rate': {
      min: '14.00%',
      max: '15.20%',
    },
    'Firearm Critical Hit Damage': {
      min: '36.90%',
      max: '44.90%',
    },
    'Bonus Firearm ATK': {
      min: '1862',
      max: '3357',
    },
  },
  Handgun: {
    ATK: {
      min: '683',
      max: '1232',
    },
    'Firearm Critical Hit Rate': {
      min: '11.90%',
      max: '13.30%',
    },
    'Firearm Critical Hit Damage': {
      min: '30.20%',
      max: '36.80%',
    },
    'Bonus Firearm ATK': {
      min: '1366',
      max: '2465',
    },
  },
  'Machine Gun': {
    ATK: {
      min: '944',
      max: '1702',
    },
    'Firearm Critical Hit Rate': {
      min: '13.00%',
      max: '14.30%',
    },
    'Firearm Critical Hit Damage': {
      min: '33.80%',
      max: '41.10%',
    },
    'Bonus Firearm ATK': {
      min: '1887',
      max: '3404',
    },
  },
  'Submachine Gun': {
    ATK: {
      min: '680',
      max: '1226',
    },

    'Firearm Critical Hit Rate': {
      min: '11.90%',
      max: '13.30%',
    },
    'Firearm Critical Hit Damage': {
      min: '30.20%',
      max: '36.80%',
    },
    'Bonus Firearm ATK': {
      min: '1360',
      max: '2453',
    },
  },
  'Hand Cannon': {
    ATK: {
      min: '3236',
      max: '5838',
    },

    'Firearm Critical Hit Rate': {
      min: '9.90%',
      max: '11.40%',
    },
    'Firearm Critical Hit Damage': {
      min: '17.70%',
      max: '21.50%',
    },
    'Bonus Firearm ATK': {
      min: '6473',
      max: '11676',
    },
  },
  'Scout Rifle': {
    ATK: {
      min: '2631',
      max: '4747',
    },

    'Firearm Critical Hit Rate': {
      min: '11.90%',
      max: '13.30%',
    },
    'Firearm Critical Hit Damage': {
      min: '26.80%',
      max: '32.70%',
    },
    'Bonus Firearm ATK': {
      min: '5263',
      max: '9494',
    },
  },
  'Beam Rifle': {
    ATK: {
      min: '1101',
      max: '1986',
    },

    'Firearm Critical Hit Rate': {
      min: '11.90%',
      max: '13.30%',
    },
    'Firearm Critical Hit Damage': {
      min: '30.20%',
      max: '36.80%',
    },
    'Bonus Firearm ATK': {
      min: '2202',
      max: '3972',
    },
  },
  'Tactical Rifle': {
    ATK: {
      min: '960',
      max: '1731',
    },

    'Firearm Critical Hit Rate': {
      min: '10.80%',
      max: '12.20%',
    },
    'Firearm Critical Hit Damage': {
      min: '20.20%',
      max: '24.70%',
    },
    'Bonus Firearm ATK': {
      min: '1919',
      max: '3462',
    },
  },
  'Sniper Rifle': {
    ATK: {
      min: '8424',
      max: '15197',
    },

    'Firearm Critical Hit Rate': {
      min: '9.30%',
      max: '10.80%',
    },
    'Firearm Critical Hit Damage': {
      min: '15.20%',
      max: '18.40%',
    },
    'Bonus Firearm ATK': {
      min: '16848',
      max: '30394',
    },
  },
  Shotgun: {
    ATK: {
      min: '1001',
      max: '1806',
    },

    'Firearm Critical Hit Rate': {
      min: '8.00%',
      max: '9.80%',
    },
    'Firearm Critical Hit Damage': {
      min: '9.10%',
      max: '11.10%',
    },
    'Bonus Firearm ATK': {
      min: '2002',
      max: '3612',
    },
  },
  Launcher: {
    ATK: {
      min: '8220',
      max: '14829',
    },

    'Firearm Critical Hit Rate': {
      min: '9.30%',
      max: '10.80%',
    },
    'Firearm Critical Hit Damage': {
      min: '15.20%',
      max: '18.40%',
    },
    'Bonus Firearm ATK': {
      min: '16439',
      max: '29657',
    },
  },
} as const;
