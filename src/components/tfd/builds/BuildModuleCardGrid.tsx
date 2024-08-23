import type { Dispatch, FC, SetStateAction } from 'react';

import Button from '@/components/inputs/Button/Button';
import BuildModuleCard from '@/components/tfd/builds/BuildModuleCard';
import { useBuild } from '@/components/tfd/builds/BuildProvider';
import { joinStrings } from '@/utils/utils';

interface BuilderModuleCardGridProps {
  selected?: number;
  setSelected?: Dispatch<SetStateAction<number | undefined>>;
  className?: string;
  disabled?: boolean;
}

const BuildModuleCardGrid: FC<BuilderModuleCardGridProps> = ({ selected, setSelected, className, disabled }) => {
  const { build, modules } = useBuild();

  const handleClick = (index: number) => {
    setSelected?.(index);
  };

  const buildModuleCards = modules.map((module, index) =>
    module ? (
      <BuildModuleCard
        key={module.module_name}
        index={index}
        {...module}
        onClick={() => {
          handleClick(index);
        }}
        selected={selected === index}
        disabled={disabled}
      />
    ) : (
      /* eslint-disable-next-line react/no-array-index-key */
      <div key={index} className="mx-auto h-72 w-48">
        <Button
          className="h-full"
          bgColor="bg-neutral-700"
          onClick={() => {
            handleClick(index);
          }}
          selected={index === selected}
          size="button-0"
        >
          <i
            className={joinStrings([
              'fa fa-tablet text-5xl',
              build !== 'weapon' && index === 0 && 'text-emerald-200',
              build !== 'weapon' && index === 6 && 'text-orange-300',
            ])}
          />
        </Button>
      </div>
    ),
  );

  return (
    <div
      className={joinStrings([
        'xl:min-w-none mb-3 flex h-max w-full flex-col items-center gap-x-2 gap-y-6 px-2 pb-2 pt-6 md:grid md:grid-flow-col md:grid-cols-2 lg:mt-0 lg:min-w-[1205px] lg:grid-flow-row lg:grid-rows-2',
        modules.length === 12 ? 'md:grid-rows-6 lg:grid-cols-6' : 'md:grid-rows-5 lg:grid-cols-5',
        className,
      ])}
    >
      {buildModuleCards}
    </div>
  );
};

export default BuildModuleCardGrid;
