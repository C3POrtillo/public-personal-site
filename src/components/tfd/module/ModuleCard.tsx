import Image from 'next/image';
import { useState } from 'react';

import type { ModuleAPIData } from '@/components/tfd/module/types';
import type { FC, MouseEventHandler } from 'react';

import Icon from '@/components/icon/Icon';
import ModuleLevel from '@/components/tfd/module/ModuleLevel';
import { classImages, socketImages } from '@/components/tfd/module/types';
import { getBackgroundLinear, getLabelClass, joinStrings } from '@/utils/utils';

interface ModuleCardProps extends ModuleAPIData {
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  isMaxLevel?: boolean;
}

const ModuleCard: FC<ModuleCardProps> = ({
  module_name,
  image_url,
  module_type,
  module_tier,
  module_socket_type,
  module_class,
  module_stat,
  onClick,
  isMaxLevel,
}) => {
  const [level, setLevel] = useState(isMaxLevel ? module_stat[module_stat.length - 1].level : 0);
  const labelClass = getLabelClass(module_tier);
  const imageBackground = getBackgroundLinear(module_tier);
  const { module_capacity, value } = module_stat[level];
  const isSubAttack = module_type === 'Sub-Attack';

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={joinStrings([
        'h-80 w-52 rounded-lg border-2 border-black bg-neutral-800 shadow-lg shadow-black',
        onClick && 'input-hover',
      ])}
      onClick={onClick}
    >
      <div className="relative flex justify-center">
        <div className="absolute -top-4 z-10 flex flex-row items-center gap-2 rounded-md border-2 border-black bg-neutral-800 px-2 py-1 shadow-md shadow-black">
          <Icon src={socketImages[module_socket_type]} alt={module_socket_type} size="6" />
          <span className="min-w-6 text-center">
            {isSubAttack && '+'}
            {module_capacity}
          </span>
        </div>
      </div>
      <div className="flex size-full flex-col items-center justify-between overflow-hidden rounded-md">
        <div className="relative flex w-full justify-center gap-1 bg-neutral-900 pb-3 pt-8 ">
          <ModuleLevel currentLevel={level} maxLevel={module_stat.length} setLevel={setLevel} isMaxLevel={isMaxLevel}>
            <div className="module-image relative size-24 overflow-hidden rounded-md border-2 border-black shadow-md shadow-black">
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
        <div className="group relative flex size-full flex-col items-center justify-between text-center shadow-inner shadow-black">
          <h3 className={['bg-hover mx-auto mt-2 text-wrap rounded-md px-2 text-lg font-bold ', labelClass].join(' ')}>
            {module_name}
          </h3>
          <p className="scroll-bar-thin absolute top-0 hidden h-36 w-full overflow-auto whitespace-pre-wrap bg-neutral-700 p-1 pt-2 shadow-inner shadow-black group-hover:block">
            {module_tier === 'Rare' ? value.replace(', ', '\n') : value}
          </p>
        </div>
        <div className="min-h-8 w-full bg-neutral-900 py-1 text-center">{module_type !== 'None' && module_type}</div>
      </div>
    </div>
  );
};

export default ModuleCard;
