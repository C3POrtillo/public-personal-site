import type { FormattedWeaponData } from '@/components/tfd/weapon/types';
import type { FC } from 'react';

import WeaponCard from '@/components/tfd/weapon/WeaponCard';
import { addSuffixToValue, delimitNumber, joinStrings, roundToHundreth } from '@/utils/utils';

const WeaponRow: FC<FormattedWeaponData> = ({ ...data }) => {
  const {
    firearmAtk,
    magazineSize,
    fireRate,
    criticalChance,
    criticalDamage,
    weakPointDamage,
    reloadTime,
    statusChance,
    baseDps,
    criticalDps,
    criticalWWeakPointDps,
  } = data;
  const tdClasses = 'text-center text-lg pr-7 md:text-lg lg:text-2xl';
  const formattedStats = [
    delimitNumber(firearmAtk),
    magazineSize,
    fireRate,
    addSuffixToValue(criticalChance, '%'),
    addSuffixToValue(roundToHundreth(criticalDamage), 'x'),
    addSuffixToValue(roundToHundreth(weakPointDamage), 'x'),
    addSuffixToValue(roundToHundreth(reloadTime), 's'),
    addSuffixToValue(roundToHundreth(statusChance), '%'),
  ];

  return (
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    <tr className="relative h-[200px]">
      <td className="sticky left-0 p-2">
        <WeaponCard {...data} hideStats />
      </td>
      {formattedStats.map((value, index) => (
        <td className={tdClasses} key={[data.weapon_id, index].join()}>
          {value}
        </td>
      ))}
      {[baseDps, criticalDps, criticalWWeakPointDps].map((value, index) => (
        <td
          className={joinStrings([
            tdClasses,
            index === 0 && 'text-orange-300',
            index === 1 && 'text-yellow-200',
            index === 2 && 'text-green-500',
          ])}
          key={value}
        >
          {delimitNumber(value)}
        </td>
      ))}
    </tr>
  );
};

export default WeaponRow;
