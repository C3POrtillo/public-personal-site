import type { ModuleTiersType } from '@/components/tfd/module/types';
import type { FC } from 'react';

import { getBackgroundRadial } from '@/utils/utils';

interface ModuleTierLabelProps {
  label: ModuleTiersType;
}

const ModuleTierLabel: FC<ModuleTierLabelProps> = ({ label }) => {
  const backgroundClass = getBackgroundRadial(label);

  return (
    <div className="m-1 w-32 overflow-hidden rounded-md border-1 border-black shadow-md shadow-black">
      <div className={['size-full text-center text-base xl:text-lg', backgroundClass].join(' ')}>{label}</div>
    </div>
  );
};

export default ModuleTierLabel;
