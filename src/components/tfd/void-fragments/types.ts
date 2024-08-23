import type { FilterOptionsData, LabelData } from '@/components/inputs/types';
import type { AttributesType } from '@/utils/attributes/types';

import { attributesImages } from '@/utils/attributes/types';

export const voidFragmentData = {
  Kingston: {
    id: 0,
    subregions: [
      {
        subregion: 'Grand Square',
        attribute: 'Non-Attribute',
        monomer: 3,
        polymer: 3,
        organic: 3,
        inorganic: 3,
      },
    ],
  },
  'Sterile Land': {
    id: 1,
    subregions: [
      {
        subregion: 'Iron Works',
        attribute: 'Chill',
        monomer: 3,
        polymer: 3,
        organic: 3,
        inorganic: 3,
      },
      {
        subregion: 'Restricted Zone',
        attribute: 'Fire',
        monomer: 3,
        polymer: 3,
        organic: 3,
        inorganic: 3,
      },
      {
        subregion: 'Repository',
        attribute: 'Electric',
        monomer: 19,
        polymer: 0,
        organic: 0,
        inorganic: 4,
      },
      {
        subregion: 'Rockfall',
        attribute: 'Electric',
        monomer: 19,
        polymer: 4,
        organic: 0,
        inorganic: 0,
      },
    ],
  },
  Vespers: {
    id: 2,
    subregions: [
      {
        subregion: 'Timberfall',
        attribute: 'Non-Attribute',
        monomer: 3,
        polymer: 3,
        organic: 3,
        inorganic: 3,
      },
      {
        subregion: 'Moonlight',
        attribute: 'Non-Attribute',
        monomer: 3,
        polymer: 3,
        organic: 3,
        inorganic: 3,
      },
      {
        subregion: 'Ruins',
        attribute: 'Chill',
        monomer: 6,
        polymer: 17,
        organic: 0,
        inorganic: 0,
      },
      {
        subregion: 'Lost Supply',
        attribute: 'Fire',
        monomer: 0,
        polymer: 19,
        organic: 4,
        inorganic: 0,
      },
    ],
  },
  'Echo Swamp': {
    id: 3,
    subregions: [
      {
        subregion: 'Muskeg Swamp',
        attribute: 'Fire',
        monomer: 5,
        polymer: 0,
        organic: 18,
        inorganic: 0,
      },
      {
        subregion: 'Derelict Covert',
        attribute: 'Toxic',
        monomer: 0,
        polymer: 0,
        organic: 3,
        inorganic: 20,
      },
      {
        subregion: 'Abandoned Zone',
        attribute: 'Toxic',
        monomer: 0,
        polymer: 6,
        organic: 0,
        inorganic: 17,
      },
    ],
  },
  'Agna Desert': {
    id: 4,
    subregions: [
      {
        subregion: 'Miragestone',
        attribute: 'Non-Attribute',
        monomer: 3,
        polymer: 3,
        organic: 3,
        inorganic: 3,
      },
      {
        subregion: 'The Storage',
        attribute: 'Fire',
        monomer: 4,
        polymer: 0,
        organic: 19,
        inorganic: 0,
      },
      {
        subregion: 'The Mining Site',
        attribute: 'Electric',
        monomer: 20,
        polymer: 3,
        organic: 0,
        inorganic: 0,
      },
      {
        subregion: 'Vermillion Waste',
        attribute: 'Electric',
        monomer: 0,
        polymer: 0,
        organic: 20,
        inorganic: 3,
      },
    ],
  },
  'White-Night Gulch': {
    id: 5,
    subregions: [
      {
        subregion: 'Moongrave Basin',
        attribute: 'Non-Attribute',
        monomer: 3,
        polymer: 3,
        organic: 3,
        inorganic: 3,
      },
      {
        subregion: 'Observatory',
        attribute: 'Chill',
        monomer: 4,
        polymer: 19,
        organic: 0,
        inorganic: 0,
      },
      {
        subregion: 'Shipment Base',
        attribute: 'Toxic',
        monomer: 0,
        polymer: 0,
        organic: 3,
        inorganic: 20,
      },
      {
        subregion: 'Hatchery',
        attribute: 'Fire',
        monomer: 0,
        polymer: 0,
        organic: 19,
        inorganic: 4,
      },
      {
        subregion: 'The Mountaintops',
        attribute: 'Toxic',
        monomer: 0,
        polymer: 7,
        organic: 0,
        inorganic: 16,
      },
    ],
  },
  Hagios: {
    id: 6,
    subregions: [
      {
        subregion: 'Fractured Monolith',
        attribute: 'Non-Attribute',
        monomer: 3,
        polymer: 3,
        organic: 3,
        inorganic: 3,
      },
      {
        subregion: 'The Corrupted Zone',
        attribute: 'Fire',
        monomer: 6,
        polymer: 0,
        organic: 17,
        inorganic: 0,
      },
      {
        subregion: 'Dune Base',
        attribute: 'Fire',
        monomer: 0,
        polymer: 0,
        organic: 18,
        inorganic: 5,
      },
    ],
  },
  Fortress: {
    id: 7,
    subregions: [
      {
        subregion: 'Defense Line',
        attribute: 'Chill',
        monomer: 3,
        polymer: 20,
        organic: 0,
        inorganic: 0,
      },
      {
        subregion: 'Fallen Ark',
        attribute: 'Electric',
        monomer: 17,
        polymer: 0,
        organic: 0,
        inorganic: 6,
      },
      {
        subregion: 'Frozen Valley',
        attribute: 'Chill',
        monomer: 0,
        polymer: 19,
        organic: 4,
        inorganic: 0,
      },
    ],
  },
} as const;

export const optimal = ['Vermillion Waste', 'The Mining SIte', 'The Mountaintops', 'Frozen Valley', 'Fallen Ark'];

export type ZonesTypes = keyof typeof voidFragmentData;
export const zonesArray = Object.keys(voidFragmentData) as ZonesTypes[];

export type SubregionTypes = (typeof voidFragmentData)[ZonesTypes]['subregions'][number]['subregion'];

export const shardsArray = ['Monomer', 'Polymer', 'Organic', 'Inorganic'] as const;
export type ShardsType = (typeof shardsArray)[number];

export const subregionsArray = zonesArray.flatMap(key =>
  voidFragmentData[key].subregions.map(({ subregion }) => subregion),
);

export const voidFragmentTableHeaders = ['Zone', 'Subregion', 'Attribute', ...shardsArray] as const;
export type FilterTypes = Lowercase<(typeof voidFragmentTableHeaders)[number]>;
export type VoidFragmentData = Record<FilterTypes | 'id', ZonesTypes | SubregionTypes | AttributesType | number>;

export type VoidFragmentFilterTypes = ShardsType | AttributesType | ZonesTypes | SubregionTypes;
export const voidFragmentFilterKeys = voidFragmentTableHeaders.map(key =>
  key.toLowerCase(),
) as unknown as FilterTypes[];
export type VoidFragmentFilterMap = Partial<Record<VoidFragmentFilterTypes, boolean | undefined>>;

export const shardsImages = shardsArray.reduce((acc, shard) => {
  acc[shard] = `/assets/images/shard/${shard.toLowerCase()}.png`;

  return acc;
}, {} as Record<ShardsType, string>);

export const fragmentOptions: FilterOptionsData = {
  label: 'Shard',
  name: 'shard',
  data: Object.entries(shardsImages).map(([value, src]) => ({
    value,
    icon: {
      src,
    },
  })),
  defaultChecked: false,
} as const;

export const zoneOptions: FilterOptionsData[] = [
  {
    label: 'Zone',
    name: 'zone',
    data: zonesArray.map(value => ({ value })),
  },
  ...zonesArray.map(key => ({
    label: key,
    name: key,
    data: voidFragmentData[key].subregions.map(({ attribute, subregion }) => ({
      value: subregion,
      icon: {
        src: attributesImages[attribute].fragment,
        backgroundClass: 'diamond',
      },
    })) as LabelData[],
  })),
];
