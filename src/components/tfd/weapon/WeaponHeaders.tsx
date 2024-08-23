import type { HeadersType } from '@/components/table/types';

import { weaponTableHeaders } from '@/components/tfd/weapon/types';

const WeaponHeaders = (): HeadersType[] =>
  weaponTableHeaders.map(key => ({
    key,
    header: (
      <div key={key} className="text-base">
        {key}
      </div>
    ),
    sortReversed: true,
  }));

export default WeaponHeaders;
