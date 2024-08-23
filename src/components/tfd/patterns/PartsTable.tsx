import type { BlueprintDataMap } from '@/components/tfd/patterns/types';
import type { FC } from 'react';

import PatternPartCard from '@/components/tfd/patterns/PatternPartCard';
import { sortPart } from '@/components/tfd/patterns/utils';
import { calculateAttempts, compareRates } from '@/utils/utils';

interface NormalMissionTableProps {
  data: BlueprintDataMap;
}

const PartsTable: FC<NormalMissionTableProps> = ({ data }) => {
  const parts = Object.entries(data)
    .sort(([a], [b]) => sortPart(a, b))
    .map(([part, patterns]) => {
      const formattedPatterns = Object.entries(patterns)
        .sort((a, b) => compareRates(b[0], a[0]))
        .map(([rate, rateData]) => {
          const patternCards = rateData.map(({ stealth, variant, vaulted, ...pattern }) => {
            const label = [`${pattern.pattern}${stealth ? '*' : ''}`, variant, vaulted && '(Vaulted)']
              .filter(text => text)
              .join('\n');

            return <PatternPartCard key={label} label={label} {...pattern} />;
          });
          const { expectedAttempts, nearlyGuaranteed, nearlyGuaranteedRange } = calculateAttempts(rate);

          const expected = (
            <div className="flex w-5/6 flex-col text-nowrap text-sm lg:text-base">
              <div className="text-left">Expected: {expectedAttempts}</div>
              <div className="text-left">
                Nearly Guaranteed: {nearlyGuaranteed} ± {nearlyGuaranteedRange}
              </div>
            </div>
          );

          return (
            <div key={rate} className="flex size-full flex-col items-center">
              <div className="flex w-full flex-row items-center gap-4 bg-neutral-800 p-2">
                <span className="w-1/6 text-right text-lg lg:text-2xl">{rate}</span>
                {expected}
              </div>
              <div
                key={rate}
                className="flex size-full flex-col flex-wrap justify-center gap-2 p-4 shadow-inner shadow-black lg:flex-row"
              >
                {patternCards}
              </div>
            </div>
          );
        });

      return (
        <div
          key={part}
          className="flex flex-col rounded-lg border-2 border-black bg-neutral-700 shadow-md shadow-black"
        >
          <h2 className="bg-neutral-900 p-2 text-xl xl:text-2xl">{part}</h2>
          <div className="flex size-full flex-col">{formattedPatterns}</div>
        </div>
      );
    });

  return <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 lg:pl-0">{parts}</div>;
};

export default PartsTable;
