import type { Backgrounds } from '@/components/icon/types';
import type { Dispatch, FC, SetStateAction } from 'react';

import Icon from '@/components/icon/Icon';
import { getLabelClass, joinStrings } from '@/utils/utils';

type Option = [string, { type: string; icon: string; backgroundClass: Backgrounds }];

interface AccordionDropdownPanelProps {
  options: string[] | Option[];
  selected: string | undefined;
  setSelected: Dispatch<SetStateAction<string>>;
  hasLabel?: boolean;
}

const AccordionDropdownPanel: FC<AccordionDropdownPanelProps> = ({ options, selected, setSelected, hasLabel }) => {
  const baseClass = 'text-link text-hover bg-hover flex flex-row gap-2 rounded-md mx-2 p-2';

  return options.map(option => {
    const isString = typeof option === 'string';
    const key = isString ? option : option[0];
    const isDisabled = key === selected;
    const { type = undefined, icon = undefined, backgroundClass = undefined } = isString ? {} : option[1];
    const className = joinStrings([
      baseClass,
      hasLabel && getLabelClass(type || key),
      isDisabled && 'disabled-link bg-neutral-600',
    ]);

    return (
      <button key={key} onClick={() => setSelected(key)} disabled={isDisabled} className={className}>
        {icon && <Icon src={icon} alt={type} backgroundClass={backgroundClass} />}
        {key}
      </button>
    );
  });
};

export default AccordionDropdownPanel;
