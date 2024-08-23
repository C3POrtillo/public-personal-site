import { useEffect, useState } from 'react';

import type { FC } from 'react';

import Text from '@/components/inputs/Text/Text';
import { getDamageReduction, getEffectiveHealth } from '@/components/tfd/ehp-calc/utils';
import { addSuffixToValue, delimitNumber, roundToHundreth } from '@/utils/utils';

const Calculator: FC = () => {
  const [health, setHealth] = useState('0');
  const [defense, setDefense] = useState('0');
  const [shield, setShield] = useState('0');
  const [damageReduction, setDamageReduction] = useState(0);
  const [effectiveHealth, setEffectiveHealth] = useState(0);

  useEffect(() => {
    const newDamageReduction = getDamageReduction(Number(defense));
    const totalHealthShields = Number(health) + Number(shield);

    setDamageReduction(newDamageReduction);
    setEffectiveHealth(getEffectiveHealth(totalHealthShields, newDamageReduction));
  }, [health, defense, shield]);

  const inputMap = [
    {
      label: 'Health',
      value: health,
      setState: setHealth,
    },
    {
      label: 'Defense',
      value: defense,
      setState: setDefense,
    },
    {
      label: 'Shield',
      value: shield,
      setState: setShield,
    },
  ] as const;

  const displayMap = [
    {
      label: 'Damage Reduction',
      value: addSuffixToValue(roundToHundreth(damageReduction * 100), '%'),
    },
    {
      label: 'Effective HP',
      value: delimitNumber(effectiveHealth),
    },
  ] as const;

  return (
    <fieldset className="flex flex-col gap-1 rounded-lg border-2 border-black bg-neutral-800 p-4 text-3xl shadow-lg shadow-black md:gap-2">
      {inputMap.map(({ label, value, setState }) => (
        <Text key={label} label={label} value={value} setState={setState} type="number" min={0} />
      ))}
      {displayMap.map(({ label, value }) => (
        <Text key={label} label={label} value={value} className="text-yellow-200" disabled />
      ))}
    </fieldset>
  );
};

export default Calculator;
