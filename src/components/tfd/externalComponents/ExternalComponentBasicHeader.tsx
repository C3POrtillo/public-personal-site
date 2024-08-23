import Image from 'next/image';

import type { BasicDataType } from '@/components/tfd/externalComponents/types';
import type { FC } from 'react';

import { mainStats } from '@/components/tfd/externalComponents/types';
import { getLabelClass, joinStrings } from '@/utils/utils';

interface ExternalComponentBasicHeaderProps extends BasicDataType {
  component: string;
}

const ExternalComponentBasicHeader: FC<ExternalComponentBasicHeaderProps> = ({
  component,
  image_url,
  Standard,
  Rare,
  Ultimate,
}) => (
  <th className="border-b-2 border-black text-center" colSpan={2}>
    <div className="flex w-full flex-row flex-wrap justify-center gap-2 p-2">
      <div className="external-component-image relative w-32 self-center overflow-hidden rounded-md border-2 border-black shadow-md shadow-black">
        <Image
          src={image_url}
          fill
          alt={component}
          sizes="356px"
          loading="lazy"
          className="bg-rare-ultimate object-cover object-center"
        />
      </div>
      <div className="flex flex-col rounded-lg bg-neutral-700 p-2 text-center hover:bg-neutral-600">
        <div className="grid grid-cols-3 text-xl 2xl:max-w-56">
          {mainStats.map(stat => (
            <div key={stat} className="w-full p-2">
              {stat}
            </div>
          ))}
          {Object.entries({ Standard, Rare, Ultimate }).map(
            ([label, array]) =>
              array &&
              array.map(({ stat_value }) => (
                <div key={`${label}-${stat_value}`} className={joinStrings(['w-full px-2', getLabelClass(label)])}>
                  {stat_value}
                </div>
              )),
          )}
        </div>
      </div>
    </div>
  </th>
);

export default ExternalComponentBasicHeader;
