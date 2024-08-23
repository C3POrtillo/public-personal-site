export type PathType = {
  path?: string;
  label?: string;
  options?: PathType[];
  isExternal?: boolean;
};

export const breadcrumbLabels = {
  dps: 'Weapon DPS',
  'ehp-calc': 'EHP Calculator',
} as Record<string, string>;

export const root = [
  {
    path: '/tfd',
  },
] as const;

export const supportEmail = {
  path: 'mailto:support@ortillo.cam',
  label: 'Contact Support',
} as const;

export const paths = {
  '/tfd': {
    path: '',
    label: '/tfd',
  },
  'New Build': {
    path: '/builds/new',
    label: 'New',
  },
  'All Builds': {
    path: '/builds',
    label: 'All',
  },
  'Descendant Builds': {
    path: '/builds/descendants',
    label: 'Descendants',
  },
  'Weapon Builds': {
    path: '/builds/weapons',
    label: 'Weapons',
  },
  Wishlist: {
    path: '/wishlist',
    label: 'Wishlist',
  },
  'Void Shards': {
    path: '/void-shards',
    label: 'Void Shards',
  },
  Descendants: {
    path: '/descendants',
    label: 'Descendants',
  },
  Weapons: {
    path: '/weapons',
    label: 'Weapons',
  },
  'Weapon Sub Stats': {
    path: '/weapons/substats',
    label: 'Weapon Sub Stats',
  },
  DPS: {
    path: '/dps',
    label: breadcrumbLabels['dps'],
  },
  'External Components': {
    path: '/external-components',
    label: 'External Components',
  },
  Reactors: {
    path: '/reactors',
    label: 'Reactors',
  },
  Modules: {
    path: '/modules',
    label: 'All',
  },
  'Module Costs': {
    path: '/modules/costs',
    label: 'Upgrade Costs',
  },
  'Module Combinations': {
    path: '/modules/combinations',
    label: 'Combinations',
  },
  'EHP Calculator': {
    path: '/ehp-calc',
    label: breadcrumbLabels['ehp-calc'],
  },
  'Privacy Policy': {
    path: '/privacy-policy',
    label: 'Privacy Policy',
  },
  'Basic Materials': {
    path: '/basic-materials',
    label: 'Basic Materials',
  },
} as const;

export const tfd = [
  paths['/tfd'],
  {
    label: 'Builds',
    options: [paths['New Build'], paths['All Builds'], paths['Descendant Builds'], paths['Weapon Builds']],
  },
  {
    label: 'Farming',
    options: [
      paths['Wishlist'],
      paths['Void Shards'],
      paths['Descendants'],
      paths['Weapons'],
      paths['Basic Materials'],
    ],
  },
  {
    label: 'Equipment',
    options: [paths['DPS'], paths['Weapon Sub Stats'], paths['External Components'], paths['Reactors']],
  },
  {
    label: 'Modules',
    options: [paths['Modules'], paths['Module Costs'], paths['Module Combinations']],
  },
  {
    label: 'Tools',
    options: [paths['EHP Calculator']],
  },
] as PathType[];
