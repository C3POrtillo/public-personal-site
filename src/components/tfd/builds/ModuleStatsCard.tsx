import type { FC } from 'react';

import { useBuild } from '@/components/tfd/builds/BuildProvider';
import StatsCard from '@/components/tfd/builds/StatsCard';
import { formatValue, getValueColor, sortStats } from '@/components/tfd/builds/utils';

const ModuleStatsCard: FC = () => {
  const { stats } = useBuild();
  const entries = Object.entries(stats);

  return (
    <StatsCard>
      {entries.length ? (
        entries
          .sort(([keyA], [keyB]) => sortStats(keyA, keyB))
          .map(
            ([key, value]) =>
              value !== 0 && (
                <div key={key} className="flex flex-row justify-between gap-1 px-2 even:bg-neutral-800">
                  <span>{key.replace('%', '')}</span>
                  <span className={getValueColor(key, value)}>{formatValue(key, value)}</span>
                </div>
              ),
          )
      ) : (
        <span className="my-auto justify-center text-center">No modifiers found</span>
      )}
    </StatsCard>
  );
};

export default ModuleStatsCard;
