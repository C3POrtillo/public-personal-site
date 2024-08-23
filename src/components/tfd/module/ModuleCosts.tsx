/* eslint-disable react/no-array-index-key */
import type { FC } from 'react';

import ModuleTierLabel from '@/components/tfd/module/ModuleTierLabel';
import { type ModuleTiersType, costSublabels, costTypes } from '@/components/tfd/module/types';
import { joinStrings } from '@/utils/utils';

interface ModuleCostsProps {
  label: ModuleTiersType;
  kuiperPerLevel: readonly number[];
}

const ModuleCosts: FC<ModuleCostsProps> = ({ label, kuiperPerLevel }) => {
  const gridClasses = 'grid grid-cols-9';
  const levelClasses = 'pr-2 text-right';

  const rows = kuiperPerLevel.map((currentKuiper, index) => {
    const currentGold = currentKuiper * 10;
    const previousKuiper = index === 0 ? 0 : kuiperPerLevel[index - 1];
    const totalKuiper = previousKuiper + currentKuiper;
    const totalGold = totalKuiper * 10;
    const values = [index + 1, currentKuiper, totalKuiper, currentGold, totalGold];

    return (
      <div key={index} className={['odd:bg-neutral-800 even:bg-neutral-700', gridClasses].join(' ')}>
        {values.map((value, valueIndex) => {
          const spanClass = valueIndex !== 0 ? 'col-span-2' : levelClasses;
          const borderClass = valueIndex % 2 === 1 && 'border-l-1 border-black px-2';
          const textClass = valueIndex !== 0 && valueIndex % 2 === 0 && 'text-yellow-200';

          return (
            <span key={valueIndex} className={joinStrings([spanClass, borderClass, textClass])}>
              {value.toLocaleString('en', { useGrouping: true })}
            </span>
          );
        })}
      </div>
    );
  });

  const headers = costTypes.map((cost, index) => {
    const labelColor = index === 0 ? 'text-sky-400' : 'text-yellow-600';

    return (
      <div key={cost} className="col-span-4 flex flex-col border-l-1 border-black">
        <span className={['pl-2', labelColor].join(' ')}>{cost}</span>
        <div className="grid grid-cols-2">
          {costSublabels.map((sublabel, sublabelIndex) => (
            <span
              key={sublabel}
              className={joinStrings([sublabelIndex === 0 && 'px-2', sublabelIndex === 1 && 'text-yellow-200'])}
            >
              {sublabel}
            </span>
          ))}
        </div>
      </div>
    );
  });

  return (
    // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
    <div className="flex flex-col overflow-clip rounded-lg border-2 border-black bg-neutral-900 shadow-lg shadow-black">
      <h3 className="flex justify-center py-2 text-lg xl:text-xl">
        <ModuleTierLabel label={label} />
      </h3>
      <div className={['mb-1 border-t-1 border-black', gridClasses].join(' ')}>
        <span className={['self-end', levelClasses].join(' ')}>{'Lvl.'}</span>
        {headers}
      </div>
      {rows}
    </div>
  );
};

export default ModuleCosts;
