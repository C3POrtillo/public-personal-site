import { getRarity } from '@/components/tfd/patterns/utils';
import { createWeaponLabel } from '@/components/tfd/weapon/utils';

export const setChecked = (defaultChecked: boolean, filter?: boolean): boolean => filter ?? defaultChecked;

export const getLabelValue = (name: string, value: string): string => {
  switch (name) {
    case 'weapon-type':
      return createWeaponLabel(value);
    case 'enhance':
      return getRarity(value);
    default:
      return value;
  }
};

export const getCheckboxContainerClasses = (className?: string, dataLength?: number) => {
  const threshold = dataLength && dataLength > 6;
  const defaultClass = threshold
    ? 'grid-cols-2 lg:grid-flow-col lg:grid-rows-4 lg:grid-cols-0'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-1';

  return className || defaultClass;
};
