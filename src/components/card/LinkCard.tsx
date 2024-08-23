import Image from 'next/image';

import type { FC } from 'react';

import TFDLink from '@/components/tfd/header/Link';

interface LinkCardProps {
  src?: string;
  alt?: string;
  path: string;
  label: string;
}

const LinkCard: FC<LinkCardProps> = ({ src, alt, path, label }) => (
  <TFDLink
    path={path}
    className="bg-hover input-hover text-link text-hover size-full overflow-hidden rounded-xl border-2 border-black bg-neutral-800 shadow-md shadow-black"
  >
    <div className="flex size-full flex-col justify-end">
      {src && (
        <div className="relative size-full">
          <Image src={src} fill alt={alt || label} sizes="1000px" loading="lazy" className="object-cover" />
        </div>
      )}
      {/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
      <h3 className="w-full bg-neutral-950 bg-opacity-50 py-2">{label}</h3>
    </div>
  </TFDLink>
);

export default LinkCard;
