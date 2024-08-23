import type { TiersType } from '@/utils/types';

export const reactorStats = {
  ultimate: '160%',
  rare: '140%',
  subStats: {
    'Skill Effect Range': {
      min: '0.174x',
      max: '0.258x',
    },
    'Skill Duration UP': {
      min: '0.760x',
      max: '0.106x',
    },
    'Skill Cooldown': {
      min: '-0.053x',
      max: '-0.074x',
    },
    'Skill Cost': {
      min: '-0.027x',
      max: '-0.041x',
    },
    'Skill Critical Hit Rate': {
      min: '22.80%',
      max: '33.00%',
    },
    'Skill Critical Hit Damage': {
      min: '22.80%',
      max: '33.00%',
    },
    'Non-Attribute Skill Power Boost Ratio': {
      min: '0.540x',
      max: '0.860x',
    },
    'Fire Skill Power Boost Ratio': {
      min: '0.540x',
      max: '0.860x',
    },
    'Chill Skill Power Boost Ratio': {
      min: '0.540x',
      max: '0.860x',
    },
    'Electric Skill Power Boost Ratio': {
      min: '0.540x',
      max: '0.860x',
    },
    'Toxic Skill Power Boost Ratio': {
      min: '0.540x',
      max: '0.860x',
    },
    'Dimension Skill Power Boost Ratio': {
      min: '0.540x',
      max: '0.860x',
    },
    'Fusion Skill Power Boost Ratio': {
      min: '0.540x',
      max: '0.860x',
    },
    'Singular Skill Power Boost Ratio': {
      min: '0.540x',
      max: '0.860x',
    },
    'Tech Skill Power Boost Ratio': {
      min: '0.540x',
      max: '0.860x',
    },
    'Sub-Attack Power Modifier': {
      min: '12.50%',
      max: '19.00%',
    },
    'Hp Heal Modifier': {
      min: '0.057',
      max: '0.085',
    },
    'Additional Skill ATK When Attacking Colossus': {
      min: '1778.309',
      max: '2633.561',
    },
    'Additional Skill ATK When Attacking Legion of Darkness': {
      min: '1778.309',
      max: '2633.561',
    },
    'Additional Skill ATK When Attacking Order of Truth': {
      min: '1778.309',
      max: '2633.561',
    },
    'Additional Skill ATK When Attacking Legion of Immortaility': {
      min: '1778.309',
      max: '2633.561',
    },
  },
} as const;

export const reactorArches = {
  Singularity: {
    type: 'Singular',
    icon: '/assets/images/arche/singular.png',
    backgroundClass: 'rhombus',
  },
  Phase: {
    type: 'Dimension',
    icon: '/assets/images/arche/dimension.png',
    backgroundClass: 'rhombus',
  },
  Mixture: {
    type: 'Fusion',
    icon: '/assets/images/arche/fusion.png',
    backgroundClass: 'rhombus',
  },
  Mechanics: {
    type: 'Tech',
    icon: '/assets/images/arche/tech.png',
    backgroundClass: 'rhombus',
  },
} as const;

export const reactorAttributes = {
  Materialized: {
    type: 'Non-Attribute',
    icon: '/assets/images/attribute/non-attribute.png',
    backgroundClass: 'hexagon',
  },
  Burning: {
    type: 'Fire',
    icon: '/assets/images/attribute/fire.png',
    backgroundClass: 'hexagon',
  },
  Frozen: {
    type: 'Chill',
    icon: '/assets/images/attribute/chill.png',
    backgroundClass: 'hexagon',
  },
  Tingling: {
    type: 'Electric',
    icon: '/assets/images/attribute/electric.png',
    backgroundClass: 'hexagon',
  },
  Toxic: {
    type: 'Toxic',
    icon: '/assets/images/attribute/toxic.png',
    backgroundClass: 'hexagon',
  },
} as const;

export type ReactorArchesType = keyof typeof reactorArches;
export type ReactorAttributesType = keyof typeof reactorAttributes;

type ReactorSkillPowerType = {
  level: number;
  skill_atk_power: number;
  sub_skill_atk_power: number;
};

type Multiplier = {
  coefficient_stat_id: string;
  coefficient_stat_value: 0.2;
};

export type ReactorAPIData = {
  reactor_name: string;
  image_url: string;
  reactor_tier: TiersType;
  reactor_skill_power: ReactorSkillPowerType[];
  skill_power_coefficient: [Multiplier, Multiplier];
};

export type FormattedReactorData = ReactorSkillPowerType & {
  attribute: ReactorAttributesType;
  arche?: ReactorArchesType;
  tier?: 'Rare' | 'Ultimate';
  image_url: string;
  skill_power_coefficient: [Multiplier, Multiplier];
};

export type FormattedReactorDataMap = Record<ReactorAttributesType, FormattedReactorData>;

export const unusedCombinations = [
  'Frozen\nSingularity',
  'Frozen\nPhase',
  'Tingling\nMechanics',
  'Toxic\nSingularity',
  'Toxic\nMixture',
];
