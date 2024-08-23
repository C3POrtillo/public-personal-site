import type { FormattedExternalComponent } from '@/components/tfd/externalComponents/types';
import type { FC } from 'react';

import { getLabelClass } from '@/utils/utils';

interface SetDataProps {
  components: (FormattedExternalComponent | null)[];
}
const SetData: FC<SetDataProps> = ({ components }) => {
  const uniqueSets = [...components].reduce((acc, component) => {
    if (component && component.set_option_detail?.length) {
      const { set_option_detail, external_component_tier } = component;
      acc.add(JSON.stringify({ set_option_detail, external_component_tier }));
    }

    return acc;
  }, new Set<string>());

  return (
    !!uniqueSets.size && (
      <>
        <hr />
        {Array.from(uniqueSets).map(data => {
          const { set_option_detail, external_component_tier } = JSON.parse(data) as FormattedExternalComponent;
          const setName = set_option_detail && set_option_detail[0].set_option;

          return (
            set_option_detail && (
              <div key={setName} className="my-1">
                <h5 className={getLabelClass(external_component_tier)}>{setName}</h5>
                {set_option_detail.map(({ set_count, set_option_effect }) => (
                  <div key={set_count}>
                    <h6 className="pl-3">Set Count: {set_count}</h6>
                    <p className="pl-6 font-semibold">{set_option_effect}</p>
                  </div>
                ))}
              </div>
            )
          );
        })}
      </>
    )
  );
};

export default SetData;
