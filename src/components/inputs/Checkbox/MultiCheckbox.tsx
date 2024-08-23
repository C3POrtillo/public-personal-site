import type { FilterMap, FilterTypes, LabelData } from '@/components/inputs/types';
import type { FC, FieldsetHTMLAttributes } from 'react';

import AccordionContained from '@/components/accordion/AccordionContained';
import Checkbox from '@/components/inputs/Checkbox/Checkbox';
import { checkboxBorderClasses } from '@/components/inputs/types';
import { getCheckboxContainerClasses, setChecked } from '@/components/inputs/utils';
import use2xlScreen from '@/utils/use2xlScreen';

interface MultiCheckboxProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  checkboxContainerClasses?: string;
  label: string;
  labelClassName?: string;
  data: LabelData[];
  filter?: FilterMap;
  setFilter?: React.Dispatch<React.SetStateAction<FilterMap>>;
  type?: 'carousel' | 'containers' | 'accordion';
}

const MultiCheckbox: FC<MultiCheckboxProps> = ({
  checkboxContainerClasses,
  label,
  labelClassName,
  data,
  name,
  defaultChecked = false,
  filter,
  setFilter,
  type,
}) => {
  const is2xlScreen = use2xlScreen();

  const gridSize = getCheckboxContainerClasses(checkboxContainerClasses, data.length);

  const checkboxContainer = (
    <div className={['grid w-full text-lg', gridSize].join(' ')}>
      {data.map(({ label: checkboxLabel, value, icon }) => (
        <Checkbox
          key={value}
          label={checkboxLabel}
          name={name}
          value={value}
          defaultChecked={setChecked(defaultChecked, filter?.[value as FilterTypes])}
          filter={filter}
          setFilter={setFilter}
          icon={icon}
        />
      ))}
    </div>
  );

  return !is2xlScreen || type === 'accordion' ? (
    <AccordionContained label={label} name={name}>
      {checkboxContainer}
    </AccordionContained>
  ) : (
    <fieldset className={['input-hover grow px-2 py-4', checkboxBorderClasses].join(' ')}>
      <legend className="px-4 text-center">
        <h2 className={labelClassName ? labelClassName : undefined}>{label}</h2>
      </legend>
      {checkboxContainer}
    </fieldset>
  );
};

export default MultiCheckbox;
