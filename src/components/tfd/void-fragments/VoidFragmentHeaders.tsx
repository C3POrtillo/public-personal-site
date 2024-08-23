import type { HeadersType } from '@/components/table/types';
import type { ShardsType } from '@/components/tfd/void-fragments/types';

import Icon from '@/components/icon/Icon';
import { shardsArray, shardsImages, voidFragmentTableHeaders } from '@/components/tfd/void-fragments/types';

const VoidFragmentHeaders = (): HeadersType[] =>
  voidFragmentTableHeaders.map(key => {
    const hasIcon = shardsArray.includes(key as ShardsType);
    const data = hasIcon && {
      key,
      header: (
        <div key={key} className="flex flex-row items-center justify-center gap-2">
          {<Icon alt={key} src={shardsImages[key as ShardsType]} size="10" />}
          <div className={shardsImages[key as ShardsType] ? 'hidden 2xl:flex' : undefined}>{key}</div>
        </div>
      ),
      sortReversed: hasIcon ? true : undefined,
    };

    return data || key;
  });

export default VoidFragmentHeaders;
