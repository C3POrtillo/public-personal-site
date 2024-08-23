import type { DirectionValues } from '@/components/inputs/types';
import type { FC } from 'react';

import AccordionContained from '@/components/accordion/AccordionContained';
import SortButton from '@/components/inputs/Button/SortButton';

interface SortButtonsProps {
  sortDirection?: DirectionValues;
  setSortDirection: React.Dispatch<React.SetStateAction<DirectionValues>>;
  sortColumn: string;
  setSortColumn: React.Dispatch<React.SetStateAction<string>>;
  sortReversed?: boolean;
}

const SortButtons: FC<SortButtonsProps> = ({ sortDirection, sortColumn, ...props }) => (
  <AccordionContained label="Sort">
    {['Vote', 'Date'].map(label => (
      <SortButton
        key={label}
        id={label}
        sortReversed={true}
        size="button-sm"
        className="rounded-lg"
        sortDirection={sortColumn === label ? sortDirection : 0}
        {...props}
      >
        By {label}
      </SortButton>
    ))}
  </AccordionContained>
);

export default SortButtons;
