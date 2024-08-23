import type { ModuleTiersType } from '@/components/tfd/module/types';
import type { FC } from 'react';

import Table from '@/components/table/Table';
import ModuleCombinationRow from '@/components/tfd/module/ModuleCombinationRow';
import ModuleTierLabel from '@/components/tfd/module/ModuleTierLabel';
import { probabilities } from '@/components/tfd/module/probabilities';
import { moduleTiers } from '@/components/tfd/module/types';

const ModuleCombinationTable: FC = () => {
  const headers = ['Input', ...moduleTiers].map((label, index) => ({
    key: label,
    header: (
      <div className="flex size-full flex-col justify-end text-xl xl:text-2xl">
        {index === 0 ? label : <ModuleTierLabel label={label as ModuleTiersType} />}
      </div>
    ),
  }));

  return (
    <Table
      className="rounds tiers"
      label="Combination Probabilities"
      headers={headers}
      body={Object.entries(probabilities).map(([input, probability]) => (
        <ModuleCombinationRow key={input} input={input} probability={probability} />
      ))}
      isStickyHeader
      isColumnSticky
    />
  );
};

export default ModuleCombinationTable;
