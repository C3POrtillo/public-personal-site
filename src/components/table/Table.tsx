import { isValidElement } from 'react';

import type { DirectionValues } from '@/components/inputs/types';
import type { HeadersType } from '@/components/table/types';
import type { FC, ReactNode, TableHTMLAttributes } from 'react';

import SortButton from '@/components/inputs/Button/SortButton';
import { joinStrings } from '@/utils/utils';

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  label?: string;
  labelSize?: string;
  sublabel?: ReactNode;
  headers?: HeadersType[] | ReactNode;
  headerWidths?: string[] | readonly string[];
  body?: ReactNode;
  isStickyHeader?: boolean;
  isColumnSticky?: boolean;
  stickyColumnIndex?: number;
  sortDirection?: DirectionValues;
  sortColumn?: string;
  setSortDirection?: React.Dispatch<React.SetStateAction<DirectionValues>>;
  setSortColumn?: React.Dispatch<React.SetStateAction<string>>;
  isMaxWidth?: boolean;
}

const Table: FC<TableProps> = ({
  label,
  labelSize = 'text-2xl md:text-3xl xl:text-4xl 2x:text-5xl',
  sublabel,
  headers,
  headerWidths,
  body,
  className,
  isStickyHeader,
  isColumnSticky,
  stickyColumnIndex = 0,
  sortDirection,
  sortColumn,
  setSortDirection,
  setSortColumn,
  isMaxWidth,
  ...props
}) => {
  const isSortHeader = setSortDirection && setSortColumn;

  const headersArray =
    headers &&
    !isValidElement(headers) &&
    (headers as unknown[] as HeadersType[]).map((el, index) => {
      const { key, header, sortReversed = false } = typeof el === 'string' ? { key: el, header: el } : el;
      const width = headerWidths?.[index];
      const stickyClass = isColumnSticky && index === stickyColumnIndex && 'sticky left-0 z-10';

      return (
        <th key={key} className={joinStrings(['h-inherit text-lg lg:text-xl', width, stickyClass])}>
          {isSortHeader ? (
            <SortButton
              id={key}
              sortDirection={sortColumn === key ? sortDirection : 0}
              setSortDirection={setSortDirection}
              setSortColumn={setSortColumn}
              sortReversed={sortReversed}
            >
              {header}
            </SortButton>
          ) : (
            header
          )}
        </th>
      );
    });

  return (
    <fieldset
      className={joinStrings([
        'overflow-clip rounded-xl border-2 border-black bg-neutral-900 text-3xl shadow-lg shadow-black',
        isMaxWidth && '2xl:w-full',
        className,
      ])}
    >
      {label && (
        <>
          <legend className={['mx-auto px-2 py-4 text-center sm:px-4', labelSize].join(' ')}>
            <h2>{label}</h2>
          </legend>
          {sublabel && sublabel}
        </>
      )}
      <div
        className={joinStrings([
          'scroll-bar-thin max-w-sm overflow-auto sm:max-w-screen-sm md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-xl 2xl:max-w-full',
          isStickyHeader && 'max-h-[75lvh] md:max-h-[80lvh]',
        ])}
      >
        <table className="w-full" {...props}>
          <thead className={joinStrings(['shadow-md shadow-black', isStickyHeader && 'sticky-table-header'])}>
            <tr className="relative h-1">{headersArray || (isValidElement(headers) && headers)}</tr>
          </thead>
          <tbody>{body}</tbody>
        </table>
      </div>
    </fieldset>
  );
};

export default Table;
