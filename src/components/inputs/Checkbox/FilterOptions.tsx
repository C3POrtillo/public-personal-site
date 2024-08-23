import type { FilterMap, FilterOptionsData } from '@/components/inputs/types';
import type { FC, FieldsetHTMLAttributes } from 'react';

import Carousel from '@/components/carousel/Carousel';
import MultiCheckbox from '@/components/inputs/Checkbox/MultiCheckbox';
import { kebabCase } from '@/utils/utils';

interface FilterOptionsProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  checkboxContainerClasses?: string;
  filterOptions: FilterOptionsData[];
  filter?: FilterMap;
  setFilter?: React.Dispatch<React.SetStateAction<FilterMap>>;
  type?: 'carousel' | 'containers' | 'accordion';
  labelClassName?: string;
}

const FilterOptions: FC<FilterOptionsProps> = ({
  checkboxContainerClasses,
  filterOptions,
  type = 'containers',
  ...props
}) => {
  const filtersArray = filterOptions.map(({ defaultChecked, ...options }) => (
    <MultiCheckbox
      checkboxContainerClasses={checkboxContainerClasses}
      id={kebabCase(options.label)}
      key={options.label}
      defaultChecked={defaultChecked ?? true}
      type={type}
      {...options}
      {...props}
    />
  ));

  switch (type) {
    case 'carousel':
      return <Carousel slides={filtersArray} width="max-w-[90vw] lg:max-w-[39vw]" />;
    default:
      return <>{filtersArray}</>;
  }
};

export default FilterOptions;
