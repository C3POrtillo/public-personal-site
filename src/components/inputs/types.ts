import type { IconProps } from '@/components/icon/Icon';
import type { BlueprintTypes, MissionTypes } from '@/components/tfd/patterns/types';
import type { VoidFragmentFilterTypes } from '@/components/tfd/void-fragments/types';
import type { WeaponFilterTypes } from '@/components/tfd/weapon/types';

export type LabelData = {
  value: string;
  label?: string;
  icon?: IconProps;
};

export type FilterOptionsData = {
  label: string;
  labelClassName?: string;
  name: string;
  data: LabelData[];
  defaultChecked?: boolean;
};

export type FilterTypes = WeaponFilterTypes | VoidFragmentFilterTypes | BlueprintTypes | MissionTypes;
export type FilterMap = Partial<Record<FilterTypes, boolean>>;

export type DirectionValues = 0 | 1 | 2;

export const checkboxBorderClasses =
  'overflow-clip rounded-lg border-2 border-black bg-neutral-800 text-3xl shadow-md shadow-black' as const;
