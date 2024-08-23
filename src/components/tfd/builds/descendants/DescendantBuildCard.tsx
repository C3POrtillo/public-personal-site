import Image from 'next/image';

import type { FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { FC } from 'react';

import Icon from '@/components/icon/Icon';
import Checkbox from '@/components/inputs/Checkbox/Checkbox';
import { useBuild } from '@/components/tfd/builds/BuildProvider';
import ReactorLabel from '@/components/tfd/reactor/ReactorLabel';
import { attributesImages } from '@/utils/attributes/types';
import { getBackgroundRadial, getLabelClass, joinStrings } from '@/utils/utils';

interface DescendantBuildCardProps extends FormattedDescendantData {
  disabled?: boolean;
}

const DescendantBuildCard: FC<DescendantBuildCardProps> = ({
  descendant_name,
  descendant_image_url,
  is_ultimate,
  attribute,
  disabled,
}) => {
  const { activator, setActivator, currentCost, maxCost, reactor } = useBuild();
  const labelClass = getLabelClass(attribute);
  const ultimateClass = is_ultimate && 'label-ultimate';
  const imageBackground = is_ultimate ? 'bg-ultimate' : 'bg-standard';
  const lessMoreColor = currentCost <= maxCost ? undefined : 'text-red-500';
  const costColor = currentCost === maxCost ? 'text-green-500' : lessMoreColor;
  const { attribute: reactorAttribute, arche } = reactor || {};
  const reactorName = reactor && `${reactorAttribute} ${arche}`;
  const reactorLabel = (
    <div
      className={joinStrings([
        'flex size-full items-center justify-center rounded-lg bg-neutral-700 shadow-inner shadow-black 2xl:w-full',
        !reactor && 'border-2 border-black',
      ])}
    >
      {reactor ? (
        <ReactorLabel
          key={`${attribute}-${arche}`}
          name={reactorName || ''}
          wrapperClass="overflow-hidden rounded-lg border-2 border-black"
          labelClass={`border-l-2 border-black shadow-inner shadow-black bg-neutral-700 ${getBackgroundRadial(
            reactor.tier || 'Ultimate',
          )}`}
          {...reactor}
        />
      ) : (
        <div className="flex h-24 items-center">Add a Reactor</div>
      )}
    </div>
  );

  const icon = (
    <Icon
      className="hidden sm:block"
      src={attributesImages[attribute].attribute}
      alt={attribute}
      backgroundClass="hexagon"
    />
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border-2 border-black bg-neutral-900 shadow-lg shadow-black">
      <div className="flex flex-row">
        <div className="descendant-image relative">
          <Image
            src={descendant_image_url}
            fill
            alt={descendant_name}
            sizes="128px"
            className={['object-contain', imageBackground].join(' ')}
          />
        </div>
        <div
          className={[
            'flex flex-col justify-center gap-2 text-nowrap border-l-2 border-black p-4 text-xl lg:text-2xl',
            labelClass,
          ].join(' ')}
        >
          <h3 className={['font-bold', ultimateClass].join(' ')}>{descendant_name}</h3>
          <div className="flex flex-row items-center gap-2 xl:w-52">
            {icon}
            {attribute}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 border-t-2 border-black bg-neutral-800 p-2 md:flex-row xl:flex-col">
        {reactorLabel}
        <div className="flex size-full flex-col items-center overflow-hidden rounded-lg border-2 border-black bg-neutral-700 py-2 shadow-inner shadow-black 2xl:w-full">
          <div className="w-min text-nowrap">
            <Checkbox
              name="enhance"
              defaultChecked={activator}
              value="Energy Activator"
              textSize="text-lg"
              onChange={e => setActivator(e.target.checked)}
              disabled={disabled}
            />
          </div>
          <span
            className={['p-2 text-center text-lg', costColor].join(' ')}
          >{`Capacity: ${currentCost}/${maxCost}`}</span>
        </div>
      </div>
    </div>
  );
};

export default DescendantBuildCard;
