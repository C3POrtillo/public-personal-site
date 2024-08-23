import type { NormalDropType } from '@/components/tfd/patterns/types';
import type { FC } from 'react';

import { descendantParts, weaponParts } from '@/components/tfd/patterns/types';
import { calculateAttempts, getLabelClass, joinStrings } from '@/utils/utils';

interface NormalMissionTableProps {
  data: NormalDropType;
  partsList?: 'descendant' | 'weapon';
}

const NormalMissionTable: FC<NormalMissionTableProps> = ({ data, partsList = 'descendant' }) => {
  const isDescendant = partsList === 'descendant';
  const parts = (isDescendant ? descendantParts : weaponParts).map(part => {
    const { zone, subregion, mission, type, dropRate } = data[part] || {};
    const isPattern = !(typeof mission === 'string');
    const patternLabel = isPattern && (type === 'Outpost' ? `${zone} - ${mission[1]}` : 'Infiltration');
    const patternValue = isPattern && (type === 'Outpost' ? 'Reactor' : mission[1]);
    const patternClass = isPattern && 'grid grid-cols-2 gap-2';
    const missionText = isPattern ? mission[0] : mission;
    const { expectedAttempts, nearlyGuaranteed, nearlyGuaranteedRange } = calculateAttempts(dropRate);
    const labelClass = zone && getLabelClass(zone);
    const label = subregion ? `${zone} - ${subregion}` : zone;
    const attempts = dropRate !== 0 && (
      <div className="flex flex-col justify-center text-sm lg:text-base">
        <div className="text-left">Expected: {expectedAttempts}</div>
        <div className="text-left">
          Nearly Guaranteed: {nearlyGuaranteed} ± {nearlyGuaranteedRange}
        </div>
      </div>
    );

    return (
      <div
        key={part}
        className="flex flex-col text-nowrap rounded-md border-2 border-black bg-neutral-700 text-left shadow-md shadow-black"
      >
        <div className="w-full bg-neutral-900 p-2">
          <p className="self-center whitespace-pre-wrap lg:text-2xl">{`${part}${
            isPattern ? ' (Amourphous Material)' : ''
          }`}</p>
        </div>
        {dropRate && (
          <div className="flex w-full flex-row flex-wrap items-center gap-4 bg-neutral-800 p-2">
            <span className="w-1/6 text-right text-lg lg:text-2xl">{`${dropRate}%`}</span>
            {attempts}
            {isPattern && (
              <div className="grid w-full grid-cols-2">
                <span>Pattern From:</span>
                <span>Opens At:</span>
              </div>
            )}
          </div>
        )}
        <div
          className={joinStrings([
            'size-full p-2 text-lg shadow-inner shadow-black 2xl:text-xl',
            patternClass,
            labelClass,
          ])}
        >
          <div className="flex w-full flex-col">
            {label && <span>{label}</span>}
            <span>{type}</span>
            {missionText && <span>{missionText}</span>}
          </div>
          {isPattern && (
            <div className="flex w-full flex-col">
              <span>{patternLabel}</span>
              <span>{patternValue}</span>
            </div>
          )}
        </div>
      </div>
    );
  });

  return <div className="my-auto grid h-min grid-cols-1 gap-2 overflow-hidden py-4 pr-4 lg:grid-cols-2">{parts}</div>;
};

export default NormalMissionTable;
