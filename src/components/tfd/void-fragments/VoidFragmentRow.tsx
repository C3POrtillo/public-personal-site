import type { IconProps } from '@/components/icon/Icon';
import type { FilterTypes, ShardsType } from '@/components/tfd/void-fragments/types';
import type { AttributesType } from '@/utils/attributes/types';
import type { FC } from 'react';

import Icon from '@/components/icon/Icon';
import { shardsArray, voidFragmentTableHeaders } from '@/components/tfd/void-fragments/types';
import { isOptimal } from '@/components/tfd/void-fragments/utils';
import { attributesImages } from '@/utils/attributes/types';
import { createLabelClass, joinStrings } from '@/utils/utils';

interface RowProps {
  data: Record<FilterTypes, string | number>;
}

const VoidFragmentRow: FC<RowProps> = ({ data }) => (
  <tr>
    {voidFragmentTableHeaders.map(key => {
      const lowerCaseKey = key.toLowerCase() as FilterTypes;
      const value = data[lowerCaseKey];
      const isSubregion = lowerCaseKey === 'subregion';

      const labelClass = createLabelClass(isSubregion ? (data['zone'] as string) : lowerCaseKey, value.toString());
      const numberClass = typeof value === 'number' && isOptimal(data['subregion'] as string);
      const centerNumber = typeof value === 'number' && 'pr-7';
      const textClass = shardsArray.includes(key as ShardsType) && 'justify-center';
      const stickyClass = isSubregion && 'sticky left-0 bg-inherit z-10';

      const icon: IconProps = {};
      const attributeIconData = attributesImages[data['attribute'] as AttributesType];
      switch (lowerCaseKey) {
        case 'subregion':
          icon['src'] = attributeIconData.fragment;
          icon['alt'] = attributeIconData.fragment;
          icon['backgroundClass'] = 'diamond';
          break;
        case 'attribute':
          icon['src'] = attributeIconData.attribute;
          icon['alt'] = attributeIconData.attribute;
          icon['backgroundClass'] = 'hexagon';
          break;
      }

      return value !== 0 ? (
        <td key={key} className={joinStrings(['p-4 text-lg 2xl:text-xl', labelClass, numberClass, stickyClass])}>
          <div className={joinStrings(['flex flex-row items-center gap-2', textClass, centerNumber])}>
            {icon.src && <Icon {...icon} />}
            {value}
          </div>
        </td>
      ) : (
        <td key={key} />
      );
    })}
  </tr>
);

export default VoidFragmentRow;
