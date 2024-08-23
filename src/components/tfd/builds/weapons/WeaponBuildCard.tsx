import Image from 'next/image';

import type { FormattedWeaponData } from '@/components/tfd/weapon/types';
import type { FC } from 'react';

import Icon from '@/components/icon/Icon';
import Checkbox from '@/components/inputs/Checkbox/Checkbox';
import { useBuild } from '@/components/tfd/builds/BuildProvider';
import { roundsImages } from '@/components/tfd/weapon/types';
import { getBackgroundLinear, getLabelClass } from '@/utils/utils';

interface WeaponBuildCardProps extends FormattedWeaponData {
  disabled?: boolean;
}

const WeaponBuildCard: FC<WeaponBuildCardProps> = ({
  weapon_name,
  weapon_tier,
  weapon_type,
  weapon_rounds_type,
  image_url,
  disabled,
}) => {
  const { activator, setActivator, currentCost, maxCost } = useBuild();
  const lessMoreColor = currentCost <= maxCost ? undefined : 'text-red-500';
  const costColor = currentCost === maxCost ? 'text-green-500' : lessMoreColor;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border-2 border-black bg-neutral-800 pb-2 text-center text-lg shadow-md shadow-black">
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
          sizes="356px"
          loading="lazy"
          className={['object-cover', getBackgroundLinear(weapon_tier)].join(' ')}
        />
      </div>
      <div className="flex flex-col gap-2 border-t-2 border-black px-2 pt-2">
        <span className={getLabelClass(weapon_tier)}>{weapon_name}</span>
        <span className={getLabelClass(weapon_rounds_type)}>{weapon_type}</span>
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

export default WeaponBuildCard;
