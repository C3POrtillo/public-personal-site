import type { FormattedSetData } from '@/components/tfd/externalComponents/types';
import type { FC } from 'react';

import ExternalComponentImageCard from '@/components/tfd/externalComponents/ExternalComponentImageCard';
import { sortParts } from '@/components/tfd/externalComponents/utils';
import { getLabelClass } from '@/utils/utils';

const ExternalComponentCard: FC<FormattedSetData> = ({
  external_component_set_name,
  external_component_tier,
  set_option_detail,
  ...component_set_parts
}) => {
  const setParts = Object.entries(component_set_parts)
    .sort((a, b) => sortParts(a[0], b[0]))
    .map(([part, component]) => (
      <div key={component.external_component_id} className="size-32">
        <ExternalComponentImageCard
          external_component_tier={external_component_tier}
          external_component_set_name={part}
          {...component}
        />
      </div>
    ));

  return (
    <fieldset
      className={[
        'tiers flex max-h-min w-full flex-col items-center overflow-hidden rounded-lg border-2 border-black bg-neutral-900 shadow-lg shadow-black',
        getLabelClass(external_component_tier),
      ].join(' ')}
    >
      <legend className="px-2 text-center text-2xl sm:px-4 2xl:text-3xl">
        <h2>{external_component_set_name}</h2>
      </legend>
      <div className="grid w-max grid-cols-2 gap-2 overflow-auto p-2 text-xl">{setParts}</div>
      {!!set_option_detail?.length && (
        <div className="w-full grow border-t-2 border-black bg-neutral-800 p-2 text-left text-lg text-white lg:text-xl">
          {set_option_detail.map(({ set_count, set_option_effect }) => (
            <div key={set_count}>
              <div>Set Count: {set_count}</div>
              <div className="pl-2 font-semibold">{set_option_effect}</div>
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
};

export default ExternalComponentCard;
