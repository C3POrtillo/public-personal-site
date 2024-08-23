import { useEffect, useState } from 'react';

import type { FormattedExternalComponentsByType } from '@/components/tfd/externalComponents/types';
import type {
  FormattedReactorData,
  FormattedReactorDataMap,
  ReactorArchesType,
  ReactorAttributesType,
} from '@/components/tfd/reactor/types';
import type { Dispatch, FC, SetStateAction } from 'react';

import AccordionContained from '@/components/accordion/AccordionContained';
import AccordionDropdownPanel from '@/components/accordion/AccordionDropdownPanel';
import Button from '@/components/inputs/Button/Button';
import Text from '@/components/inputs/Text/Text';
import { useBuild } from '@/components/tfd/builds/BuildProvider';
import ExternalComponentImageCard from '@/components/tfd/externalComponents/ExternalComponentImageCard';
import { filterComponents } from '@/components/tfd/externalComponents/utils';
import ReactorCard from '@/components/tfd/reactor/ReactorCard';
import { reactorArches } from '@/components/tfd/reactor/types';
import { getSortedReactors } from '@/components/tfd/reactor/utils';

interface EquipmentGridProps {
  reactors: FormattedReactorDataMap;
  components: FormattedExternalComponentsByType;
}

const componentTypes = ['Auxiliary Power', 'Sensor', 'Memory', 'Processor'] as const;
const icons = ['fa-battery-full', 'fa-compact-disc', 'fa-sd-card', 'fa-microchip'];

const EquipmentGrid: FC<EquipmentGridProps> = ({ reactors, components }) => {
  const { setReactor, equippedComponents, setEquippedComponents } = useBuild();
  const [component, setComponent] = useState<number | undefined>(undefined);
  const [tier, setTier] = useState<'Rare' | 'Ultimate'>();
  const [attribute, setAttribute] = useState<ReactorAttributesType>();
  const [arche, setArche] = useState<ReactorArchesType>();
  const [searchFilter, setSearchFilter] = useState('');

  const componentButtons = equippedComponents.map((equipped, index) => (
    <div key={equipped?.external_component_id || index} className="size-32 min-h-32 min-w-32 max-w-32">
      {equipped ? (
        <ExternalComponentImageCard {...equipped} selected={component === index} onClick={() => setComponent(index)} />
      ) : (
        <Button
          className="h-full"
          key={componentTypes[index]}
          bgColor="bg-neutral-700"
          selected={component === index}
          onClick={() => setComponent(index)}
          size="button-0"
        >
          <i className={['fa', icons[index], 'text-5xl'].join(' ')} />
        </Button>
      )}
    </div>
  ));

  const componentCards =
    component !== undefined &&
    filterComponents(components[componentTypes[component]], equippedComponents[component], searchFilter).map(data => (
      <ExternalComponentImageCard
        key={data.external_component_id}
        {...data}
        onClick={() => {
          equippedComponents[component] = data;
          setEquippedComponents([...equippedComponents]);
          setComponent(component < equippedComponents.length - 1 ? component + 1 : 0);
        }}
      />
    ));

  useEffect(() => {
    if (!attribute || !arche || !tier) {
      return;
    }
    const label = reactors[attribute].skill_power_coefficient[1].coefficient_stat_id.split(' ');
    label.shift();
    reactors[attribute].skill_power_coefficient[1].coefficient_stat_id = [reactorArches[arche].type, ...label].join(
      ' ',
    );
    const liveReactor = {
      ...reactors[attribute],
      tier,
      arche,
    } as FormattedReactorData;
    setReactor(liveReactor);
  }, [tier, attribute, arche]);

  const reactorCards = getSortedReactors(reactors).map(data => {
    const { attribute: compare } = data;
    const isSelected = attribute === compare;

    return (
      <div key={compare} className="w-32">
        <ReactorCard
          {...data}
          disabled={isSelected}
          selected={isSelected}
          onClick={() => {
            setAttribute(compare);
          }}
          tier={tier}
          arche={arche}
          hideLabel
        />
      </div>
    );
  });

  const reactorOptions = [
    {
      label: 'Tier',
      options: ['Rare', 'Ultimate'],
      selected: tier,
      setSelected: setTier as Dispatch<SetStateAction<string>>,
      hasLabel: true,
    },
    {
      label: 'Arche',
      options: Object.entries(reactorArches),
      selected: arche,
      setSelected: setArche as Dispatch<SetStateAction<string>>,
    },
  ];

  return (
    <div className="attributes tiers flex size-full flex-col gap-2 xl:flex-row">
      <div className="flex size-full flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 px-2 md:flex-row-reverse">
          <div className="flex w-full max-w-80 flex-row gap-2 overflow-auto p-2 md:max-w-none">{reactorCards}</div>
          <div className="relative flex h-36 w-full max-w-60 flex-col gap-2">
            {reactorOptions.map(({ label, ...props }, index) => (
              <div key={label} className={['absolute w-full', index === 0 ? 'top-0 z-20' : 'top-20 z-10'].join(' ')}>
                <AccordionContained label={label} panelClassName="px-0 py-2 gap-1">
                  <AccordionDropdownPanel {...props} />
                </AccordionContained>
              </div>
            ))}
          </div>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-2 lg:flex-row lg:items-start">
          <div className="flex min-w-36 max-w-80 grid-cols-4 flex-row items-center gap-1 overflow-auto p-2 md:max-w-none lg:h-full lg:flex-col">
            {componentButtons}
          </div>
          {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
          <div className="flex max-h-96 grow flex-col gap-2 lg:max-h-[540px]">
            <div className="w-full rounded-md border-2 border-black bg-neutral-800 p-2 shadow-md shadow-black">
              <Text
                label="Name/Stat (HP, DEF, Shield substats are assumed)"
                setState={setSearchFilter}
                placeholder="Search..."
                value={searchFilter}
              />
            </div>
            <div className="flex h-full flex-row flex-wrap items-center justify-center gap-2 overflow-auto py-2">
              {componentCards}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentGrid;
