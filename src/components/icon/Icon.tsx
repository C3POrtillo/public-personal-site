import Image from 'next/image';

import type { Backgrounds } from '@/components/icon/types';
import type { FC } from 'react';

export interface IconProps {
  src?: string;
  alt?: string;
  backgroundClass?: Backgrounds;
  size?: '6' | '8' | '10';
  className?: string;
}

const Icon: FC<IconProps> = ({ src, alt, backgroundClass, size = '8', className }) => {
  const getSize = () => `size-${size} `;

  return (
    src && (
      <div className={className}>
        <div className={['relative flex min-h-6 min-w-6 flex-wrap', getSize()].join(' ')}>
          {backgroundClass && <div className={backgroundClass} />}
          <Image fill sizes="100%" src={src} alt={alt || ''} quality={100} loading="lazy" />
        </div>
      </div>
    )
  );
};

export default Icon;
