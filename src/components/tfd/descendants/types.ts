import type { FilterOptionsData } from '@/components/inputs/types';
import type { ArchesType, AttributesType } from '@/utils/attributes/types';
import type { BaseStat } from '@/utils/types';

export type DescendantStat = {
  level: number;
  stat_detail: BaseStat[];
};

export type SkillData = {
  skill_type: string;
  skill_name: string;
  element_type: AttributesType;
  arche_type: ArchesType;
  skill_image_url: string;
  skill_description: string;
};

export type DescendantAPIData = {
  descendant_id: string;
  descendant_name: string;
  descendant_image_url: string;
  descendant_stat: DescendantStat[];
  descendant_skill: SkillData[];
};

export type FormattedDescendantData = {
  is_ultimate: boolean;
  descendant_id: string;
  descendant_name: string;
  descendant_image_url: string;
  descendant_stat: DescendantStat;
  descendant_skill: SkillData[];
  attribute: AttributesType;
  sort_name: string;
};

export const normalMissionDrops = {
  Bunny: {
    'Enhanced Cells': {
      zone: 'Kingston',
      subregion: 'Fallen Theater',
      mission: 'Vulgus Field Generator',
      type: 'Battlefield',
      dropRate: 20,
    },
    Stabilizer: {
      zone: 'Kingston',
      mission: 'Magister Lab',
      type: 'Infiltration',
      dropRate: 20,
    },
    'Spiral Catalyst': {
      zone: 'Kingston',
      subregion: 'Grand Square',
      mission: 'Vulgus Data Transmitter',
      type: 'Battlefield',
      dropRate: 20,
    },
    Code: {
      zone: 'Kingston',
      mission: ['Slumber Valley', 'Gravewalker'],
      type: 'Infiltration',
      dropRate: 20,
    },
  },
  Freyna: {
    'Enhanced Cells': {
      zone: 'Vespers',
      mission: 'The Shelter',
      type: 'Infiltration',
      dropRate: 20,
    },
    Stabilizer: {
      zone: 'Vespers',
      subregion: 'Lumber Yard',
      mission: 'Ruins Path',
      type: 'Battlefield',
      dropRate: 20,
    },
    'Spiral Catalyst': {
      zone: 'Vespers',
      subregion: 'Lumber Yard',
      mission: 'Ruins Underground Entrance',
      type: 'Battlefield',
      dropRate: 20,
    },
    Code: {
      zone: 'Sterile Land',
      subregion: 'Rockfall',
      mission: ['', 'Rockfall'],
      type: 'Outpost',
      dropRate: 20,
    },
  },
  Sharen: {
    'Enhanced Cells': {
      zone: 'Echo Swamp',
      mission: 'Seed Vault',
      type: 'Infiltration',
      dropRate: 20,
    },
    Stabilizer: {
      zone: 'Echo Swamp',
      mission: 'The Chapel',
      type: 'Infiltration',
      dropRate: 20,
    },
    'Spiral Catalyst': {
      zone: 'Agna Desert',
      mission: 'The Asylum',
      type: 'Infiltration',
      dropRate: 20,
    },
    Code: {
      zone: 'Agna Desert',
      mission: 'Caligo Ossuary',
      type: 'Infiltration',
      dropRate: 20,
    },
  },
  Blair: {
    'Enhanced Cells': {
      zone: 'White-Night Gulch',
      mission: "Mystery's End",
      type: 'Infiltration',
      dropRate: 20,
    },
    Stabilizer: {
      zone: 'White-Night Gulch',
      mission: 'Bio-Lab',
      type: 'Infiltration',
      dropRate: 20,
    },
    'Spiral Catalyst': {
      zone: 'Hagios',
      mission: 'The Haven',
      type: 'Infiltration',
      dropRate: 20,
    },
    Code: {
      zone: 'Hagios',
      mission: 'Old Mystery',
      type: 'Infiltration',
      dropRate: 20,
    },
  },
} as const;

const tiers = ['Standard', 'Ultimate'] as const;

type TiersType = (typeof tiers)[number];

export type DescendantFilterMap = Partial<Record<AttributesType | TiersType, boolean | undefined>>;

export const tierOptions: FilterOptionsData = {
  label: 'Tier',
  name: 'tier',
  data: tiers.map(value => ({ value })),
};
