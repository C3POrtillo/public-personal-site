import type { FilterOptionsData } from '@/components/inputs/types';

export const attributesArray = ['Non-Attribute', 'Chill', 'Fire', 'Electric', 'Toxic'] as const;
export type AttributesType = (typeof attributesArray)[number];

type AttributesImages = {
  attribute: string;
  fragment: string;
};

export const attributesImages = attributesArray.reduce((acc, attribute) => {
  acc[attribute] = {
    attribute: `/assets/images/attribute/${attribute.toLowerCase()}.png`,
    fragment: `/assets/images/fragment/${attribute.toLowerCase()}.png`,
  };

  return acc;
}, {} as Record<AttributesType, AttributesImages>);

const archesArray = ['Dimension', 'Fusion', 'Singular', 'Tech'] as const;
export type ArchesType = (typeof archesArray)[number];

export const archesImages = archesArray.reduce((acc, arche) => {
  acc[arche] = `/assets/images/arche/${arche.toLowerCase()}.png`;

  return acc;
}, {} as Record<ArchesType, string>);

export const attributeOptions: FilterOptionsData = {
  label: 'Attribute',
  name: 'attribute',
  data: Object.entries(attributesImages).map(([value, { attribute: src }]) => ({
    value,
    icon: {
      src,
      backgroundClass: 'hexagon',
    },
  })),
};
