import type { HeadersType } from '@/components/table/types';

import { hardHeaders, normalHeaders } from '@/components/tfd/patterns/types';
import { calculateAttempts } from '@/utils/utils';

const formatData = (array: readonly (string | number)[]): HeadersType[] =>
  array.map(key => {
    const isNumber = typeof key === 'number';
    const data = isNumber ? `${key}%` : key;
    const { expectedAttempts, nearlyGuaranteed, nearlyGuaranteedRange } = isNumber
      ? calculateAttempts(key)
      : { expectedAttempts: '', nearlyGuaranteed: '', nearlyGuaranteedRange: '' };

    return {
      key: data,
      header: (
        <div key={data} className={['flex flex-row items-center gap-4 px-2 py-1 md:py-4'].join(' ')}>
          <span className="text-lg lg:text-2xl">{data}</span>
          {isNumber && (
            <div className="flex w-1/2 flex-col text-nowrap text-sm lg:text-base">
              <div className="text-left">Expected: {expectedAttempts}</div>
              <div className="text-left">
                Nearly Guaranteed: {nearlyGuaranteed} ± {nearlyGuaranteedRange}
              </div>
            </div>
          )}
        </div>
      ),
    };
  });

const PatternHeaders = (type: 'normal' | 'hard'): HeadersType[] =>
  type === 'normal' ? formatData(normalHeaders) : formatData(hardHeaders);

export default PatternHeaders;
