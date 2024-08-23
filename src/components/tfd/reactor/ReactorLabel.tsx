import Image from 'next/image';

import type { ReactorArchesType, ReactorAttributesType } from '@/components/tfd/reactor/types';
import type { TiersType } from '@/utils/types';
import type { FC } from 'react';

import Icon from '@/components/icon/Icon';
import { reactorArches, reactorAttributes } from '@/components/tfd/reactor/types';
import { getBackgroundLinear, getLabelClass, joinStrings } from '@/utils/utils';

interface ReactorLabelProps {
  attribute: ReactorAttributesType;
  arche?: ReactorArchesType;
  name: string;
  wrapperClass?: string;
  labelClass?: string;
  backgroundColor?: string;
  image_url?: string;
  tier?: TiersType;
}

const ReactorLabel: FC<ReactorLabelProps> = ({
  attribute,
  arche,
  name,
  wrapperClass,
  labelClass,
  backgroundColor = 'bg-neutral-800',
  image_url,
  tier,
}) => {
  const { type, icon, backgroundClass } = reactorAttributes[attribute];
  const {
    type: archeType = undefined,
    icon: archeIcon = undefined,
    backgroundClass: archeBackground = undefined,
  } = arche ? reactorArches[arche] : {};

  const attributeIcon = <Icon src={icon} alt={type} backgroundClass={backgroundClass} />;

  return (
    <div
      className={joinStrings([
        'flex h-max w-full flex-row overflow-hidden text-center text-base',
        backgroundColor,
        wrapperClass,
        getLabelClass(type),
      ])}
    >
      {image_url && (
        <div className="relative size-24 min-w-24">
          <Image
            src={image_url || ''}
            fill
            alt={name}
            sizes="356px"
            loading="lazy"
            className={['object-cover', getBackgroundLinear(tier || 'Ultimate')].join(' ')}
          />
        </div>
      )}
      <div
        className={joinStrings([
          'flex size-full h-24 flex-row items-center justify-between gap-2 whitespace-pre-wrap px-4 py-2 text-lg',
          labelClass,
        ])}
      >
        {attributeIcon}
        <span>{name}</span>
        {archeIcon ? (
          <Icon src={archeIcon} alt={archeType} backgroundClass={archeBackground} />
        ) : (
          <div className="w-8" />
        )}
      </div>
    </div>
  );
};

export default ReactorLabel;
