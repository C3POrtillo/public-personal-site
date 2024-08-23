import type { VoidFragmentData } from '@/components/tfd/void-fragments/types';

import { optimal, voidFragmentData } from '@/components/tfd/void-fragments/types';

export const reformatZoneData = () =>
  Object.entries(voidFragmentData)
    .flatMap(([zone, { id, subregions }]) => subregions.map(subregion => ({ ...subregion, zone, id })))
    .sort((a, b) => ((a.id as number) - b.id) as number) as VoidFragmentData[];

export const isOptimal = (subregion: string): string | undefined =>
  optimal.includes(subregion) ? 'label-high-value' : undefined;
