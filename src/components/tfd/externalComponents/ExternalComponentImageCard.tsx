import Image from 'next/image';

import type { FormattedExternalComponent } from '@/components/tfd/externalComponents/types';
import type { FC, MouseEventHandler } from 'react';

import { getBackgroundLinear, getBackgroundRadial, getLabelClass, joinStrings } from '@/utils/utils';

interface ExternalComponentImageCardProps extends FormattedExternalComponent {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean;
  selected?: boolean;
}

const ExternalComponentImageCard: FC<ExternalComponentImageCardProps> = ({
  image_url,
  external_component_name,
  external_component_set_name,
  external_component_tier,
  stat,
  onClick,
  disabled,
  selected,
}) => {
  const { stat_id, stat_value } = stat;

  return (
    <button
      className={joinStrings([
        'external-component-image group relative overflow-hidden rounded-xl border-2 border-black shadow-md shadow-black',
        onClick && !disabled && 'input-hover',
        selected && 'selected',
      ])}
      onClick={onClick}
      disabled={disabled || selected || !onClick}
    >
      <Image
        src={image_url}
        fill
        alt={external_component_name}
        sizes="356px"
        loading="lazy"
        className={['object-cover object-center', getBackgroundLinear(external_component_tier)].join(' ')}
      />
      <div
        className={[
          'absolute top-0 z-10 hidden size-32 flex-col justify-center px-2 group-hover:flex',
          getBackgroundRadial(external_component_tier),
        ].join(' ')}
      >
        <span className={getLabelClass(external_component_tier)}>{external_component_set_name}</span>
        <span>
          {stat_id} {stat_value}
        </span>
      </div>
    </button>
  );
};
export default ExternalComponentImageCard;
