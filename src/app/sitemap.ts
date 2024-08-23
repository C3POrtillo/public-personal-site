import type { MetadataRoute } from 'next';

import { tfd } from '@/utils/paths';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = 'https://ortillo.cam';
  const tfdPaths = tfd.flatMap(data => {
    if (data.options && data.label?.length) {
      const { options } = data;

      return options.map(nestedData => ({
        url: `${url}/tfd${nestedData.path}`,
        lastModified: new Date(),
        priority: 1,
      }));
    }

    return {
      url: `${url}/tfd${data.path}`,
      lastModified: new Date(),
      priority: 1,
    };
  });

  return [
    {
      url,
      lastModified: new Date(),
      priority: 1,
    },
    ...tfdPaths,
  ];
}
