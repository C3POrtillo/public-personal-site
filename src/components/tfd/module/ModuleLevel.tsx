import { useState } from 'react';

import type { Dispatch, FC, PropsWithChildren, ReactNode, SetStateAction } from 'react';

import { joinStrings } from '@/utils/utils';

interface ModuleLevelProps extends PropsWithChildren {
  currentLevel: number;
  maxLevel: number;
  setLevel: Dispatch<SetStateAction<number>>;
  disableIncrease?: boolean;
  disableDecrease?: boolean;
  isMaxLevel?: boolean;
  disabled?: boolean;
}

const ModuleLevel: FC<ModuleLevelProps> = ({
  currentLevel,
  maxLevel,
  setLevel,
  children,
  disableIncrease,
  disableDecrease,
  isMaxLevel,
  disabled,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const levelPills = [] as ReactNode[];
  for (let i = 1; i < maxLevel; i++) {
    const noDecrease = disableDecrease && i < currentLevel;
    const noIncrease = disableIncrease && i > currentLevel;
    const disablePill = isMaxLevel || noDecrease || noIncrease;
    const isGreen = i <= (hoveredIndex ?? currentLevel);
    const backgroundClass = isGreen ? 'bg-green-500' : 'bg-neutral-900';
    const buttonClass = i < maxLevel - 1 ? 'pt-0.5' : undefined;
    levelPills.push(
      <button
        key={i}
        className={joinStrings(['w-min', buttonClass])}
        onClick={() => {
          if (disablePill) {
            return;
          }
          setLevel(i);
        }}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
        disabled={disablePill}
      >
        <div
          className={['h-[7px] w-3 rounded-sm border-1 border-white hover:bg-green-500', backgroundClass].join(' ')}
        />
      </button>,
    );
  }
  levelPills.reverse();

  const arrowData = [
    {
      hover: 'hover:text-green-500',
      type: 'up',
      onClick: () => {
        if (currentLevel < maxLevel - 1) {
          setLevel(currentLevel + 1);
        }
      },
      disabled: currentLevel === maxLevel - 1 || disableIncrease,
    },
    {
      hover: 'hover:text-red-400',
      type: 'down',
      onClick: () => {
        if (currentLevel > 0) {
          setLevel(currentLevel - 1);
        }
      },
      disabled: currentLevel === 0 || disableDecrease,
    },
  ];

  const arrows = arrowData.map(({ hover, type, onClick, disabled: arrowDisabled }) => (
    <button
      key={type}
      className={joinStrings(['module-card-button', hover, disabled && 'disabled'])}
      onClick={onClick}
      disabled={arrowDisabled}
    >
      <i className={['fa fa-chevron-', type].join('')} />
    </button>
  ));

  return (
    <div className="flex flex-row gap-1">
      <div className="flex w-7 flex-col items-end self-end">{levelPills}</div>
      {children}
      <div className="button-arrows flex w-7 flex-col gap-4 self-center">{!disabled && !isMaxLevel && arrows}</div>
    </div>
  );
};

export default ModuleLevel;
