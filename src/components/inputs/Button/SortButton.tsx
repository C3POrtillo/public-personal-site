/* eslint-disable tailwindcss/no-custom-classname */
import type { ButtonProps } from '@/components/inputs/Button/Button';
import type { DirectionValues } from '@/components/inputs/types';
import type { FC } from 'react';

import { joinStrings } from '@/utils/utils';

interface SortButtonProps extends ButtonProps {
  id: string;
  sortDirection?: DirectionValues;
  setSortDirection: React.Dispatch<React.SetStateAction<DirectionValues>>;
  setSortColumn: React.Dispatch<React.SetStateAction<string>>;
  sortReversed?: boolean;
}

const SortButton: FC<SortButtonProps> = ({
  id,
  sortDirection = 0,
  setSortDirection,
  setSortColumn,
  sortReversed,
  children,
  className,
  size,
}) => {
  const isNeutral = sortDirection === 0;
  const isAscending = sortDirection === 1;
  const isDescending = sortDirection === 2;

  const arrowClasses =
    (isNeutral && 'justify-between') || (isAscending && 'justify-start') || (isDescending && 'justify-end');

  return (
    <button
      className={joinStrings(['bg-hover flex h-max items-center justify-between gap-1 p-2', className, size])}
      onClick={() => {
        let nextDirection: DirectionValues;
        let nextColumn: string;

        if (sortReversed) {
          if (sortDirection === 0) {
            nextDirection = 2;
            nextColumn = id || '';
          } else {
            nextDirection = (sortDirection - 1) as DirectionValues;
            nextColumn = isNeutral ? '' : id;
          }
        } else if (sortDirection === 2) {
          nextDirection = 0;
          nextColumn = '';
        } else {
          nextDirection = (sortDirection + 1) as DirectionValues;
          nextColumn = id || '';
        }

        setSortDirection(nextDirection);
        setSortColumn(nextColumn);
      }}
    >
      <div className="p-auto flex grow justify-center self-center text-lg">{children}</div>
      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div
        className={[
          'button-arrows max-h[48px] flex h-[48px] flex-col self-center xl:h-[56px] xl:max-h-[56px]',
          arrowClasses,
        ].join(' ')}
      >
        {(isNeutral || isAscending) && <i className="fa fa-chevron-up" />}
        {(isNeutral || isDescending) && <i className="fa fa-chevron-down" />}
      </div>
    </button>
  );
};

export default SortButton;
