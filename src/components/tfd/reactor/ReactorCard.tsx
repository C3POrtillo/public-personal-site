import Image from 'next/image';

import type { FormattedReactorData } from '@/components/tfd/reactor/types';
import type { FC, MouseEventHandler } from 'react';

import ReactorLabel from '@/components/tfd/reactor/ReactorLabel';
import { getBackgroundLinear, joinStrings } from '@/utils/utils';

interface ReactorCardProps extends FormattedReactorData {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean;
  selected?: boolean;
  hideLabel?: boolean;
}

const ReactorCard: FC<ReactorCardProps> = ({
  image_url,
  attribute,
  arche,
  tier,
  onClick,
  disabled,
  selected,
  hideLabel,
}) => {
  const name = `${joinStrings([attribute, arche])}\nReactor`;

  return (
    <button
      className={joinStrings([
        'flex w-full flex-col overflow-hidden rounded-xl border-2 border-black shadow-md shadow-black',
        onClick && !disabled && 'input-hover',
        selected && 'selected',
      ])}
      onClick={onClick}
      disabled={disabled || !onClick}
    >
      <div className="reactor-image relative w-full self-center">
        <Image
          src={image_url}
          fill
          alt={name}
          sizes="356px"
          loading="lazy"
          className={[tier ? getBackgroundLinear(tier) : 'bg-rare-ultimate', 'object-cover', 'object-center'].join(' ')}
        />
      </div>
      {!hideLabel && (
        <ReactorLabel name={name} attribute={attribute} arche={arche} wrapperClass="border-t-2 border-black" />
      )}
    </button>
  );
};

export default ReactorCard;
