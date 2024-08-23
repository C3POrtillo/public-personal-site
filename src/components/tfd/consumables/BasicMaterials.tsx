import type { Source } from '@/components/tfd/consumables/types';
import type { FC } from 'react';

import Dropdown from '@/components/dropdown/Dropdown';
import { basicMaterials } from '@/components/tfd/consumables/types';
import { getSourceToMaterialLabel } from '@/components/tfd/consumables/utils';
import { getLabelClass, joinStrings } from '@/utils/utils';

const BasicMaterials: FC = () => {
  const zones = Object.entries(basicMaterials).map(([zone, materials]) => {
    const zoneClass = getLabelClass(zone);
    const materialCards = Object.entries(materials).map(([material, data]) => {
      const { source, notes } = data as Source;

      const label = (
        <p className={joinStrings(['whitespace-pre-wrap text-center text-lg xl:text-xl', notes && 'mx-auto p-2'])}>
          <span className={getSourceToMaterialLabel(source)}>{`${material}\n`}</span>
          <span>{source}</span>
        </p>
      );

      // eslint-disable-next-line tailwindcss/no-custom-classname
      const icon = notes && <i className="fa fa-question self-center" />;

      return notes ? (
        <div key={material} className="mx-auto w-full rounded-md bg-neutral-600">
          <Dropdown label={label} icon={icon} labelIsMaxWidth>
            <div className={joinStrings(['max-w-80 whitespace-pre-wrap text-lg sm:max-w-96', zoneClass])}>{notes}</div>
          </Dropdown>
        </div>
      ) : (
        <div key={material} className="flex w-full justify-center rounded-md bg-neutral-600 p-2">
          {label}
        </div>
      );
    });

    return (
      <fieldset
        key={zone}
        className="h-min rounded-lg border-2 border-black bg-neutral-800 p-2 shadow-inner shadow-black"
      >
        <legend className="rounded-lg border-2 border-black bg-neutral-700 px-2 py-1 text-center shadow-md shadow-black">
          <h3 className={joinStrings(['px-2 text-xl xl:text-2xl', zoneClass])}>{zone}</h3>
        </legend>
        <div className="flex flex-col items-center gap-2">{materialCards}</div>
      </fieldset>
    );
  });

  return (
    <fieldset className="gap-2 rounded-xl border-2 border-black bg-neutral-900 p-2 shadow-md shadow-black">
      <legend className="px-2 text-center text-3xl xl:text-4xl">
        <h2>Basic Materials</h2>
      </legend>
      <p className="mb-2 text-center text-lg text-yellow-200 xl:text-xl">Click Materials with ? for notes</p>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{zones}</div>
    </fieldset>
  );
};

export default BasicMaterials;
