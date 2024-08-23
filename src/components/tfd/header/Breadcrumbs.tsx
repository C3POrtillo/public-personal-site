import { useRouter } from 'next/router';

import type { FC } from 'react';

import Container from '@/components/container/Container';
import TFDLink from '@/components/tfd/header/Link';
import { breadcrumbLabels } from '@/utils/paths';
import { titleCase } from '@/utils/utils';

interface BreadcrumbsProps {
  slug?: string[];
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ slug }) => {
  const router = useRouter();
  let buildPathString = '';
  const paths = router.pathname.split('/').slice(2);
  let slugIndex = 0;
  const formattedPaths = paths.map(path => {
    if (slug?.length && slugIndex < slug.length && path.match(/\[.*\]/)) {
      return slug[slugIndex++];
    }

    return path;
  });

  return (
    <Container className="justify-start">
      <div className="flex flex-row flex-wrap gap-2">
        {formattedPaths.map((path, index) => {
          const label = breadcrumbLabels[path] || titleCase(path);
          const copy = buildPathString;
          buildPathString += `${path}/`;

          return (
            <div key={path} className="flex flex-row items-center gap-2">
              <p>/</p>
              <TFDLink
                className="text-hover bg-hover rounded-md px-2 py-1"
                label={label}
                path={`/${copy}${path}`}
                disabled={index === paths.length - 1}
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default Breadcrumbs;
