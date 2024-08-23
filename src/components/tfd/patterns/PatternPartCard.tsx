import type { Pattern } from '@/components/tfd/patterns/types';
import type { FC } from 'react';

import Dropdown from '@/components/dropdown/Dropdown';
import { patternIsHard } from '@/components/tfd/patterns/utils';
import { getLabelClass } from '@/utils/utils';

interface PatternPartCardProps extends Pattern {
  label: string;
}

const PatternPartCard: FC<PatternPartCardProps> = ({ label, pattern, open, from }) => {
  const isHard = patternIsHard(pattern);
  const labelClass = isHard ? 'label-ultimate' : 'label-rare';
  const regionLabel = getLabelClass(from.split('\n')[0]);
  const locations = [
    {
      text: 'Dropped From',
      value: from,
    },
    {
      text: 'Opened At',
      value: open,
    },
  ];

  return (
    <div className="flex flex-col self-center rounded-lg border-2 border-black bg-neutral-900 shadow-md shadow-black">
      <Dropdown label={<h3 className={['whitespace-pre-wrap', labelClass].join(' ')}>{label}</h3>} hasIcon={false}>
        <div className="flex flex-row gap-2">
          {locations.map(({ text, value }) => (
            <div key={text} className="flex flex-col">
              <span>{text}</span>
              <p className={['whitespace-pre-wrap', regionLabel].join(' ')}>{value}</p>
            </div>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};

export default PatternPartCard;
