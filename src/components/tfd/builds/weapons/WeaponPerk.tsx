import Image from 'next/image';

import type { FC } from 'react';

interface WeaponPerkProps {
  weapon_perk_ability_description: string | null;
  weapon_perk_ability_image_url: string | null;
  weapon_perk_ability_name: string | null;
}

const WeaponPerk: FC<WeaponPerkProps> = ({
  weapon_perk_ability_description,
  weapon_perk_ability_image_url,
  weapon_perk_ability_name,
}) => {
  if (!weapon_perk_ability_name || !weapon_perk_ability_image_url || !weapon_perk_ability_description) {
    return null;
  }

  return (
    <>
      <hr />
      <div>
        <div className="my-1 flex flex-row items-center gap-2">
          <div className="relative size-12">
            <Image
              src={weapon_perk_ability_image_url}
              fill
              alt={weapon_perk_ability_name}
              sizes="128px"
              className="object-contain"
            />
          </div>
          <h5 className="label-ultimate">{weapon_perk_ability_name}</h5>
        </div>
        <p className="font-semibold">{weapon_perk_ability_description}</p>
      </div>
    </>
  );
};

export default WeaponPerk;
