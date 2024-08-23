import type { FC, PropsWithChildren } from 'react';

const StatsCard: FC<PropsWithChildren> = ({ children }) => (
  <div className="scroll-bar-thin flex max-h-48 flex-col overflow-auto rounded-md border-2 border-black bg-neutral-700 shadow-md shadow-black">
    {children}
  </div>
);

export default StatsCard;
