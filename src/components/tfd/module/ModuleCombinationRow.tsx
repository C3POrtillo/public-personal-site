import type { Probability } from '@/components/tfd/module/probabilities';
import type { FC } from 'react';

import ModuleTierLabel from '@/components/tfd/module/ModuleTierLabel';
import { decodeChar } from '@/components/tfd/module/probabilities';
import { moduleTiers } from '@/components/tfd/module/types';
import { joinStrings } from '@/utils/utils';

interface ModuleCombinationRowProps {
  input: string;
  probability: Probability;
}

const ModuleCombinationRow: FC<ModuleCombinationRowProps> = ({ input, probability }) => {
  const probabilities = Object.values(probability);
  const max = Math.max(...probabilities);
  const inputData = input.split('').map((tier, index) => {
    const label = decodeChar[tier as keyof typeof decodeChar];

    // eslint-disable-next-line react/no-array-index-key
    return <ModuleTierLabel key={index} label={label} />;
  });

  return (
    <tr>
      <td className="sticky left-0 bg-inherit">
        <div className="flex flex-row flex-wrap justify-center py-2 md:w-72">{inputData}</div>
      </td>
      {moduleTiers.map(tier => {
        const value = probability[tier] || 0;
        const isMax = max === value && 'text-green-500';
        const isMinOrAverage = max !== value && (value < 10 ? 'text-red-500' : 'text-yellow-200');

        return <td key={tier} className={joinStrings(['text-center', isMinOrAverage, isMax])}>{`${value}%`}</td>;
      })}
    </tr>
  );
};

export default ModuleCombinationRow;
