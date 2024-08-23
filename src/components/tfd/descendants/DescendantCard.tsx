import Image from 'next/image';

import type { FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { FC } from 'react';

import Icon from '@/components/icon/Icon';
import { formatStat } from '@/components/tfd/builds/utils';
import { attributesImages } from '@/utils/attributes/types';
import { getLabelClass, joinStrings } from '@/utils/utils';

interface DescendantCardProps extends FormattedDescendantData {
  hideStats?: boolean;
  className?: string;
}

const DescendantCard: FC<DescendantCardProps> = ({
  descendant_name,
  descendant_image_url,
  descendant_stat,
  is_ultimate,
  attribute,
  hideStats,
  className,
}) => {
  const stats = descendant_stat.stat_detail.map(
    ({ stat_type, stat_value }) =>
      stat_type && (
        <div key={stat_type} className="card-stats border-t-2 border-black odd:bg-neutral-700 even:bg-neutral-800">
          <span className="border-r-1 border-black py-2 pl-4 pr-2 font-bold">{stat_type}</span>
          <span className="border-l-1 border-black py-2 pl-2 pr-4">{formatStat(stat_value, stat_type)}</span>
        </div>
      ),
  );
  const labelClass = getLabelClass(attribute);
  const ultimateClass = is_ultimate && 'label-ultimate';
  const imageBackground = is_ultimate ? 'bg-ultimate' : 'bg-standard';

  return (
    <div
      className={joinStrings([
        'flex w-full flex-col overflow-hidden rounded-lg border-2 border-black bg-neutral-900 shadow-lg shadow-black',
        className,
      ])}
    >
      <div className="flex flex-row">
        <div className="descendant-image relative">
          <Image
            src={descendant_image_url}
            fill
            alt={descendant_name}
            sizes="128px"
            className={['object-contain', imageBackground].join(' ')}
          />
        </div>
        <div
          className={[
            'flex flex-col justify-center gap-2 text-nowrap border-l-2 border-black p-4 text-xl lg:text-2xl',
            labelClass,
          ].join(' ')}
        >
          <h3 className={['font-bold', ultimateClass].join(' ')}>{descendant_name}</h3>
          <div className="flex flex-row items-center gap-2">
            <Icon src={attributesImages[attribute].attribute} alt={attribute} backgroundClass="hexagon" /> {attribute}
          </div>
        </div>
      </div>
      {!hideStats && <div className="flex flex-col">{stats}</div>}
    </div>
  );
};

export default DescendantCard;
