import type { FC, PropsWithChildren } from 'react';

import Accordion from '@/components/accordion/Accordion';
import { checkboxBorderClasses } from '@/components/inputs/types';
import { getLabelClass, joinStrings } from '@/utils/utils';

interface AccordionContainedProps extends PropsWithChildren {
  name?: string;
  label: string;
  panelClassName?: string;
  panelMaxHeight?: number;
  keepOpen?: boolean;
}

const AccordionContained: FC<AccordionContainedProps> = ({ name, label, children, ...props }) => {
  const accordionSize = 'lg:flex-auto lg:basis-[calc(33.333%-1rem)] xl:basis-auto';
  const labelClass = name && getLabelClass(name);

  return (
    <div className={['h-min w-full', checkboxBorderClasses, accordionSize].join(' ')}>
      <Accordion
        className="input-hover"
        label={<div className={joinStrings(['text-lg md:text-xl', labelClass])}>{label}</div>}
        labelIsClickable
        {...props}
      >
        {children}
      </Accordion>
    </div>
  );
};

export default AccordionContained;
