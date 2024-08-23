import type { FC, PropsWithChildren } from 'react';

import { joinStrings } from '@/utils/utils';

interface PatternCellProps extends PropsWithChildren {
  className?: string;
  isCenter?: boolean;
  noWrap?: boolean;
  isSticky?: boolean;
}
const PatternCell: FC<PatternCellProps> = ({ className, isCenter, noWrap, isSticky, children }) => {
  const centerClass = isCenter && 'justify-center text-center';
  const noWrapClass = noWrap && 'text-nowrap';

  return (
    <td className={joinStrings([' bg-inherit text-lg 2xl:text-xl', isSticky && 'sticky left-0 p-2', className])}>
      {
        <div className={joinStrings(['flex flex-col whitespace-pre-wrap rounded-md', centerClass, noWrapClass])}>
          {children}
        </div>
      }
    </td>
  );
};

export default PatternCell;
