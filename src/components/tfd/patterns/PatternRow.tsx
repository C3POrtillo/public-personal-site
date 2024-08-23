import type { BlueprintFilterMap, Pattern, RateTypes } from '@/components/tfd/patterns/types';
import type { FC } from 'react';

import PatternCell from '@/components/tfd/patterns/PatternCell';
import { getBlueprintClass, getBlueprints, isSelected } from '@/components/tfd/patterns/utils';
import { getLabelClass, joinStrings } from '@/utils/utils';

interface RowProps {
  data: Pattern;
  itemFilter: BlueprintFilterMap;
}

const PatternRow: FC<RowProps> = ({ data, itemFilter }) => {
  const { pattern, open, from, variant, vaulted, stealth } = data;
  const blueprints = getBlueprints(data) as RateTypes[];
  const label = data['38%'] ? 'label-rare' : 'label-ultimate';
  const region = getLabelClass(from.split('\n')[0]);
  const formattedValue = [`${pattern}${stealth ? '*' : ''}`, variant, vaulted && '(Vaulted)']
    .filter(text => text)
    .join('\n');

  return (
    <tr>
      <PatternCell className={label} isCenter isSticky>
        {formattedValue}
      </PatternCell>
      {[from, open].map(value => (
        <PatternCell key={value} className={region} noWrap>
          {value}
        </PatternCell>
      ))}
      {blueprints.map(value => {
        if (typeof value === 'string') {
          const blueprintClass = getLabelClass(getBlueprintClass(value));

          return (
            <PatternCell key={value} className={blueprintClass}>
              <p className={joinStrings(['rounded-md p-2', isSelected(value, itemFilter)])}>{value}</p>
            </PatternCell>
          );
        }

        return (
          <PatternCell key={pattern}>
            {value.map((commonDrop, dropIndex) => (
              <>
                <div
                  key={commonDrop}
                  className={['flex items-center p-1', getLabelClass(getBlueprintClass(commonDrop))].join(' ')}
                >
                  <p className={joinStrings(['w-full text-wrap rounded-md p-1', isSelected(commonDrop, itemFilter)])}>
                    {commonDrop}
                  </p>
                </div>
                {dropIndex === 0 && <hr className="mx-1 border-t-1 border-white" />}
              </>
            ))}
          </PatternCell>
        );
      })}
    </tr>
  );
};

export default PatternRow;
