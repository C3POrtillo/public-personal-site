import type { WeaponType } from '@/components/tfd/weapon/types';
import type { FC } from 'react';

import { commonStats, elementalAtk, factionAtk, subStats } from '@/components/tfd/weapon/types';
import { typeToRounds } from '@/components/tfd/weapon/utils';
import { getLabelClass, joinStrings } from '@/utils/utils';

const WeaponSubStats: FC = () => {
  const [atk, weakpointLabel, ...commonLabels] = Object.keys(commonStats);
  const [elementLabel, ...crit] = Object.keys(subStats['Assault Rifle']);
  const bonusLabel = crit.pop();
  const labels = [
    atk,
    ...elementalAtk.map(element => (
      <span key={element} className={getLabelClass(element)}>{`${element} ${elementLabel}`}</span>
    )),
    weakpointLabel,
    ...crit.map(label => label.split('Critical ').join('Critical\n')),
    ...commonLabels,
    ...factionAtk.map(faction => `${bonusLabel}\n${faction}`),
  ];

  const labelMap = (
    <div className="flex flex-col text-right sm:sticky sm:left-0">
      <h2 className="flex h-16 items-center justify-center bg-neutral-900 text-lg xl:text-xl">Weapon Sub Stats</h2>
      {labels.map(label => (
        <div
          key={typeof label === 'string' ? label : label.key}
          className="m-1 flex flex-row items-center justify-end overflow-hidden rounded-md border-2 border-black shadow-md shadow-black"
        >
          <div className="line-clamp-2 flex h-full w-56 items-center justify-end whitespace-pre-wrap text-wrap bg-neutral-900 px-1">
            {label}
          </div>
          <div className="flex flex-col border-l-2 border-black">
            <span className="bg-neutral-800 px-2 text-red-500">Min:</span>
            <span className="bg-neutral-700 px-2 text-green-500">Max:</span>
          </div>
        </div>
      ))}
    </div>
  );

  const subStatMap = Object.entries(subStats).map(([weapon, stats]) => {
    const { 'Firearm ATK': firearmAtk, 'Weak Point Damage': weakpoint, ...common } = commonStats;
    const {
      ATK,
      'Firearm Critical Hit Rate': critRate,
      'Firearm Critical Hit Damage': critDamage,
      'Bonus Firearm ATK': bonus,
    } = stats;
    const orderedStats = {
      firearmAtk,
      ...elementalAtk.reduce((acc, element) => {
        acc[element] = ATK;

        return acc;
      }, {} as Record<(typeof elementalAtk)[number], { min: string; max: string }>),
      weakpoint,
      critRate,
      critDamage,
      ...common,
      ...factionAtk.reduce((acc, faction) => {
        acc[faction] = bonus;

        return acc;
      }, {} as Record<(typeof factionAtk)[number], { min: string; max: string }>),
    };

    const statMap = Object.entries(orderedStats).flatMap(([label, { min, max }]) => (
      <div
        key={label}
        className="m-1 flex flex-col overflow-hidden rounded-md border-2 border-black text-center shadow-md shadow-black"
      >
        <span className="label-standard bg-neutral-800 px-2">{min}</span>
        <span className="label-ultimate bg-neutral-700 px-2">{max}</span>
      </div>
    ));

    const rounds = typeToRounds(weapon as WeaponType);

    return (
      <div key={weapon} className="flex flex-col">
        <h3
          className={joinStrings([
            'flex h-16 items-center justify-center whitespace-pre-wrap bg-neutral-900 px-2 text-center text-lg xl:text-xl',
            rounds && getLabelClass(rounds),
          ])}
        >
          {weapon.replace(' ', '\n')}
        </h3>
        {statMap}
      </div>
    );
  });

  return (
    <div className="relative flex max-w-sm flex-row overflow-auto rounded-xl border-2 border-black bg-neutral-800 pb-1 shadow-md shadow-black sm:max-w-xl md:max-w-screen-sm lg:max-w-screen-md xl:max-w-none">
      {labelMap}
      {subStatMap}
    </div>
  );
};

export default WeaponSubStats;
