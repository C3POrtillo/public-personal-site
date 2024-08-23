import { useEffect, useState } from 'react';

import type { IconProps } from '@/components/icon/Icon';
import type { FilterMap, FilterTypes } from '@/components/inputs/types';
import type { ChangeEvent, FC, InputHTMLAttributes } from 'react';

import Icon from '@/components/icon/Icon';
import { getLabelValue } from '@/components/inputs/utils';
import { createLabelClass, joinStrings, kebabCase } from '@/utils/utils';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  name?: string;
  defaultChecked?: boolean;
  filter?: FilterMap;
  setFilter?: React.Dispatch<React.SetStateAction<FilterMap>>;
  icon?: IconProps;
  textSize?: string;
}

const Checkbox: FC<CheckboxProps> = ({
  label,
  value,
  name,
  defaultChecked,
  filter,
  setFilter,
  icon,
  onChange,
  textSize = 'text-lg lg:text-xl',
  ...props
}) => {
  const [isChecked, setChecked] = useState(defaultChecked);
  const id = kebabCase(value);
  const labelValue = getLabelValue(name || '', value);
  const labelClass = name && createLabelClass(name, labelValue);

  const handleFilter = (check?: boolean) => {
    if (filter && setFilter) {
      filter[value as FilterTypes] = check;
      setFilter({ ...filter });
    }
  };

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const check = e.target.checked;
    onChange && onChange(e);
    handleFilter(check);
    setChecked(check);
  };

  return (
    <label
      htmlFor={id}
      className={joinStrings([
        'flex flex-row gap-2 rounded-md p-2',
        textSize,
        labelClass,
        !props.disabled && 'bg-hover',
      ])}
    >
      <input
        type="checkbox"
        className="text-link size-5 self-center rounded bg-neutral-200 shadow-sm shadow-black ring-offset-neutral-800 checked:bg-blue-800 focus:bg-blue-500 focus:ring-2 focus:ring-blue-500 checked:focus:bg-blue-500"
        id={id}
        name={value}
        checked={isChecked}
        onChange={handleChange}
        {...props}
      />
      <div className="flex flex-row items-center justify-center gap-1 xl:gap-2">
        {icon?.src && <Icon {...icon} />}
        {label || value}
      </div>
    </label>
  );
};

export default Checkbox;
