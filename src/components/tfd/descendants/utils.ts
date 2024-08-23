import type {
  DescendantAPIData,
  DescendantFilterMap,
  DescendantStat,
  FormattedDescendantData,
} from '@/components/tfd/descendants/types';

import { sortAttributes } from '@/utils/attributes/utils';
import { compareStrings } from '@/utils/utils';

const isRegularGley = (id: string, stats: DescendantStat) => {
  const match = id === '101000009';
  match &&
    stats.stat_detail.length < 6 &&
    stats.stat_detail.push({
      stat_type: 'Shield Recovery In Combat',
      stat_value: 0,
    });
};

export const formatDescendantData = (descendants: DescendantAPIData[]): FormattedDescendantData[] =>
  descendants
    .map(({ descendant_stat, descendant_name, descendant_skill, ...data }) => {
      const maxStats = descendant_stat[39];
      const [ultimate, ...name] = descendant_name.split(' ');
      const is_ultimate = ultimate === 'Ultimate';
      const attribute = descendant_skill[0].element_type;
      isRegularGley(data.descendant_id, maxStats);

      return {
        ...data,
        descendant_name,
        is_ultimate,
        attribute,
        descendant_stat: maxStats,
        descendant_skill,
        sort_name: is_ultimate ? [...name].join(' ') : descendant_name,
      };
    })
    .sort((a, b) => compareStrings(a.sort_name, b.sort_name));

export const filterAndSortDescendants = (
  descendants: FormattedDescendantData[],
  filter: DescendantFilterMap,
  searchFilter: string,
) =>
  descendants
    .filter(descendant => {
      const { attribute, is_ultimate, descendant_name } = descendant;
      const regex = new RegExp(searchFilter, 'i');
      const isValidAttribute = filter[attribute];
      const isValidTier = is_ultimate ? filter['Ultimate'] : filter['Standard'];
      const isValidSearch = !searchFilter || regex.test(descendant_name) || regex.test(attribute);

      return isValidAttribute && isValidTier && isValidSearch;
    })
    .sort((a, b) => {
      const { attribute: aAttribute, sort_name: aName } = a;
      const { attribute: bAttribute, sort_name: bName } = b;

      if (aAttribute !== bAttribute) {
        return sortAttributes(aAttribute, bAttribute);
      }

      return compareStrings(aName, bName);
    });
