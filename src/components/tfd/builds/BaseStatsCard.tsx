import type { BaseStat } from '@/utils/types';
import type { FC } from 'react';

import { useBuild } from '@/components/tfd/builds/BuildProvider';
import StatsCard from '@/components/tfd/builds/StatsCard';
import { calculateStat, formatStat, getTextColor } from '@/components/tfd/builds/utils';
import { joinStrings } from '@/utils/utils';

interface BaseStatsCardProps {
  baseStats: BaseStat[];
}
const BaseStatsCard: FC<BaseStatsCardProps> = ({ baseStats }) => {
  const { stats } = useBuild();

  return (
    <StatsCard>
      {baseStats.map(({ stat_id, stat_type, stat_value: value }) => {
        const key = (stat_id || stat_type) as string;
        const total = calculateStat(stats, key, value);
        const formattedValue = formatStat(total, key);

        return (
          value !== 0 && (
            <div key={key} className="flex flex-row items-center justify-between gap-1 px-2 even:bg-neutral-800">
              <p>{key}</p>
              <span className={joinStrings(['text-nowrap', getTextColor(total, value, key)])}>{formattedValue}</span>
            </div>
          )
        );
      })}
    </StatsCard>
  );
};

export default BaseStatsCard;
