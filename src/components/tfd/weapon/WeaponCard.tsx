import Image from 'next/image';

import type { FormattedWeaponData } from '@/components/tfd/weapon/types';
import type { FC } from 'react';

import Icon from '@/components/icon/Icon';
import { formatStat } from '@/components/tfd/builds/utils';
import { roundsImages, statFilter } from '@/components/tfd/weapon/types';
import { getBackgroundLinear, getLabelClass, joinStrings } from '@/utils/utils';

interface WeaponCardProps extends FormattedWeaponData {
  hideStats?: boolean;
  allStats?: boolean;
  className?: string;
}

const WeaponCard: FC<WeaponCardProps> = ({
  weapon_name,
  weapon_tier,
  weapon_type,
  weapon_rounds_type,
  image_url,
  base_stat,
  hideStats,
  className,
  allStats,
}) => {
  const stats = (
    <div className={allStats ? 'scroll-bar-thin scroll-bar-left max-h-96 overflow-auto' : undefined}>
      {base_stat.map(
        ({ stat_type, stat_value }, index) =>
          stat_type &&
          (allStats || statFilter.includes(stat_type)) && (
            <div
              key={stat_type}
              className={joinStrings([
                'card-stats border-black odd:bg-neutral-700 even:bg-neutral-800',
                index !== base_stat.length - 1 && 'border-b-2',
              ])}
            >
              <span className="size-full border-r-1 border-black py-2 pl-4 pr-2 text-left font-bold">{stat_type}</span>
              <span className="flex size-full min-w-24 items-center justify-end border-l-1 border-black py-2 pl-2 pr-4">
                {formatStat(stat_value, stat_type)}
              </span>
            </div>
          ),
      )}
    </div>
  );

  return (
    <div
      className={joinStrings([
        'flex flex-col overflow-hidden rounded-lg border-2 border-black bg-neutral-800 text-center text-lg shadow-lg shadow-black',
        className,
      ])}
    >
      <div className="weapon-image relative shadow-md shadow-black">
        <Icon
          className="absolute right-1 top-1 z-10"
          src={roundsImages[weapon_rounds_type]}
          alt={weapon_rounds_type}
          backgroundClass="diamond"
        />
        <Image
          src={image_url}
          fill
          alt={weapon_name}
          sizes="712px"
          loading="lazy"
          className={['object-cover', getBackgroundLinear(weapon_tier)].join(' ')}
        />
      </div>
      <div className="flex flex-col border-y-2 border-black p-2">
        <span className={getLabelClass(weapon_tier)}>{weapon_name}</span>
        <span className={getLabelClass(weapon_rounds_type)}>{weapon_type}</span>
      </div>
      {!hideStats && stats}
    </div>
  );
};

export default WeaponCard;
