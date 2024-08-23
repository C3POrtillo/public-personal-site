import Image from 'next/image';
import { useEffect, useState } from 'react';

import type { LiveModuleData } from '@/components/tfd/builds/types';
import type { FC, MouseEventHandler } from 'react';

import Icon from '@/components/icon/Icon';
import Checkbox from '@/components/inputs/Checkbox/Checkbox';
import { useBuild } from '@/components/tfd/builds/BuildProvider';
import { getModuleCost } from '@/components/tfd/builds/utils';
import ModuleLevel from '@/components/tfd/module/ModuleLevel';
import { classImages, socketImages } from '@/components/tfd/module/types';
import { getBackgroundLinear, getLabelClass, joinStrings } from '@/utils/utils';

interface BuildModuleCardProps extends LiveModuleData {
  index: number;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  selected?: boolean;
  disabled?: boolean;
}

const BuildModuleCard: FC<BuildModuleCardProps> = ({ index, onClick, selected, disabled, ...module }) => {
  const { module_id, module_name, image_url, module_type, module_tier, module_socket_type, module_class, module_stat } =
    module;
  const defaultLevel = module_tier === 'Transcendent' || module_type === 'Sub-Attack' ? module_stat.length - 1 : 0;
  const { modules, setModules, currentCost, maxCost } = useBuild();
  const [catalyst, setCatalyst] = useState(!!module.catalyst);
  const [level, setLevel] = useState(module.level || defaultLevel);
  const labelClass = getLabelClass(module_tier);
  const imageBackground = getBackgroundLinear(module_tier);
  const { value } = module_stat[level];
  const isSubAttack = module_type === 'Sub-Attack';

  const disableIncrease = module_tier !== 'Transcendent' && module_type !== 'Sub-Attack' && currentCost >= maxCost;
  const disableDecrease = (module_tier === 'Transcendent' || module_type === 'Sub-Attack') && currentCost >= maxCost;

  useEffect(() => {
    modules[index] = {
      module_id,
      module_name,
      image_url,
      module_type,
      module_tier,
      module_socket_type,
      module_class,
      module_stat,
      level,
      catalyst,
    };
    setModules([...modules]);
  }, [level, catalyst]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="mx-auto h-72 w-48 shadow-md shadow-black" onClick={onClick}>
      <div className="relative flex justify-center">
        <div className="absolute -top-4 z-10 flex flex-row items-center gap-2 rounded-md border-2 border-black bg-neutral-800 px-2 py-1 shadow-md shadow-black">
          <Icon src={socketImages[module_socket_type]} alt={module_socket_type} size="6" />
          <span className={joinStrings(['min-w-6 text-center', catalyst && 'text-green-400'])}>
            {isSubAttack && '+'}
            {getModuleCost(module, level, catalyst, module_type === 'Sub-Attack')}
          </span>
        </div>
        {!disabled && (
          <button
            className="absolute left-2 top-2 z-10 flex items-center justify-center text-lg text-red-500 hover:text-red-400"
            onClick={() => {
              modules[index] = null;
              setModules([...modules]);
            }}
          >
            {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
            <i className="fa fa-xmark" />
          </button>
        )}
      </div>
      <div
        className={[
          'input-hover flex size-full flex-col items-center justify-between overflow-hidden rounded-lg border-2 bg-neutral-800 shadow-lg shadow-black',
          selected ? 'border-yellow-200' : 'border-black',
        ].join(' ')}
      >
        <div className="relative flex w-full justify-center gap-1 bg-neutral-900 pb-3 pt-8">
          <ModuleLevel
            currentLevel={level}
            maxLevel={module_stat.length}
            setLevel={setLevel}
            disableIncrease={disableIncrease || disabled}
            disableDecrease={disableDecrease || disabled}
            disabled={disabled}
          >
            <div className="module-image relative size-8 overflow-hidden rounded-md border-2 border-black shadow-md shadow-black">
              <Image
                src={image_url}
                fill
                alt={module_name}
                sizes="96px"
                className={['object-contain', imageBackground].join(' ')}
              />
            </div>
          </ModuleLevel>
          <Icon
            className="absolute right-1 top-1"
            src={classImages[module_class]}
            alt={module_class}
            backgroundClass="diamond"
          />
        </div>
        <div className="flex size-full flex-col items-center justify-between text-center shadow-inner shadow-black">
          <div className="group relative w-full">
            <h3
              className={['bg-hover mx-auto mt-2 text-wrap rounded-md px-2 text-lg font-bold ', labelClass].join(' ')}
            >
              {module_name}
            </h3>
            <p className="scroll-bar-thin absolute top-0 hidden h-28 w-full overflow-auto whitespace-pre-wrap bg-neutral-700 p-1 pt-2 shadow-inner shadow-black group-hover:block">
              {module_tier === 'Rare' ? value.replace(', ', '\n') : value}
            </p>
          </div>
          {!disabled && (
            <div className="w-min text-nowrap">
              <Checkbox
                name="enhance"
                defaultChecked={catalyst}
                value={`Catalyst-${index}`}
                label="Catalyst"
                textSize="text-lg"
                onChange={e => setCatalyst(e.target.checked)}
              />
            </div>
          )}
        </div>
        <div className="min-h-8 w-full bg-neutral-900 py-1 text-center">{module_type !== 'None' && module_type}</div>
      </div>
    </div>
  );
};

export default BuildModuleCard;
