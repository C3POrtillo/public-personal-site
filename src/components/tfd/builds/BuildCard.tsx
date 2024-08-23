import Image from 'next/image';

import type { BuildData } from '@/components/tfd/builds/types';
import type { RoundsType } from '@/components/tfd/weapon/types';
import type { AttributesType } from '@/utils/attributes/types';
import type { TiersType } from '@/utils/types';
import type { FC } from 'react';

import UpvoteButtons from '@/components/tfd/builds/UpvoteButtons';
import TFDLink from '@/components/tfd/header/Link';
import { getLabelClass, joinStrings, kebabCase, titleCase } from '@/utils/utils';

interface BuildCardProps extends Partial<BuildData> {
  build: 'descendant' | 'weapon';
  slug: string;
  imageSrc?: string;
  imageAlt?: string;
  imageBackground?: string;
  labelType?: TiersType | AttributesType | RoundsType;
}

const BuildCard: FC<BuildCardProps> = ({
  build,
  slug,
  username,
  title,
  buildFor,
  updated_at,
  upvotes,
  downvotes,
  imageSrc,
  imageAlt,
  imageBackground,
  labelType,
  id,
}) => {
  const isWeapon = build === 'weapon';
  const name = buildFor || titleCase(slug);
  const date = new Date(updated_at || Date.now()).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  return (
    <div className="input-hover flex w-full flex-row justify-between overflow-hidden rounded-lg border-2 border-black bg-neutral-900 shadow-lg shadow-black">
      <TFDLink
        className="flex w-full flex-row items-center"
        path={`/builds/${build}s/${slug}/${id}-${kebabCase(title || '')}`}
      >
        <div
          className={joinStrings([
            'relative overflow-hidden',
            isWeapon ? 'h-full w-48' : 'size-24 min-w-24 md:size-32 md:min-w-32',
          ])}
        >
          {imageSrc && (
            <Image
              src={imageSrc}
              fill
              alt={imageAlt || ''}
              sizes={isWeapon ? '360px' : '128px'}
              className={['object-contain', imageBackground].join(' ')}
            />
          )}
        </div>
        <div className="flex h-full flex-col justify-center border-l-2 border-black p-2">
          <h2 className="line-clamp-2 text-ellipsis text-wrap text-base md:text-xl">
            {title || 'Missing Build Title'}
          </h2>
          <p className="line-clamp-1 text-ellipsis text-sm md:text-lg">
            <span className={labelType ? getLabelClass(labelType) : undefined}>{name}</span>
            {` | By: ${username || '?'}`}
          </p>
          <p className="text-sm md:text-lg">{date}</p>
        </div>
      </TFDLink>
      <UpvoteButtons buildId={id} upvotes={upvotes || 0} downvotes={downvotes || 0} />
    </div>
  );
};

export default BuildCard;
