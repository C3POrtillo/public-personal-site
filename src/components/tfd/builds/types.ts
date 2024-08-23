import type { FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { FormattedExternalComponent } from '@/components/tfd/externalComponents/types';
import type { ModuleAPIData } from '@/components/tfd/module/types';
import type { FormattedReactorData } from '@/components/tfd/reactor/types';
import type { FormattedWeaponData } from '@/components/tfd/weapon/types';

export type LiveModuleData = ModuleAPIData & {
  level: number;
  catalyst?: boolean;
};

export type BuildData = {
  id?: number | null;
  user_id: number | null;
  username?: string;
  build: 'descendant' | 'weapon';
  buildFor: string;
  description: string | null;
  modules: (LiveModuleData | null)[];
  equipment: {
    reactor: FormattedReactorData | null;
    equippedComponents: (FormattedExternalComponent | null)[];
  };
  title: string;
  activator: boolean;
  upvotes?: number | null;
  downvotes?: number | null;
  updated_at?: string | null;
};

export type DescendantBuild = BuildData & Partial<FormattedDescendantData>;
export type WeaponBuild = BuildData & Partial<FormattedWeaponData>;
export type ImportBuildData = {
  descendant: DescendantBuild[];
  weapon: WeaponBuild[];
};

export const componentMap = {
  'Auxiliary Power': 'Max HP',
  Memory: 'DEF',
  Processor: 'Max Shield',
} as const;

export const averageComponentSubstats = {
  'Max HP': 865,
  'Max Shield': 263,
  DEF: 3997,
} as const;
