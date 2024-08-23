import Error from 'next/error';
import { useState } from 'react';

import type { DirectionValues } from '@/components/inputs/types';
import type { BuildData } from '@/components/tfd/builds/types';
import type { DescendantAPIData, FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import BuildCard from '@/components/tfd/builds/BuildCard';
import SortButtons from '@/components/tfd/builds/SortButtons';
import { importBuilds, sortBuilds } from '@/components/tfd/builds/utils';
import DescendantCard from '@/components/tfd/descendants/DescendantCard';
import { formatDescendantData } from '@/components/tfd/descendants/utils';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import TFDLink from '@/components/tfd/header/Link';
import { getTfdSeo, kebabCase } from '@/utils/utils';

interface IndexProps {
  slug: string;
  seo: NextSeoProps;
  descendant: FormattedDescendantData;
  builds: BuildData[] | null;
}

const Index: FC<IndexProps> = ({ slug, seo, descendant, builds }) => {
  const [sortDirection, setSortDirection] = useState(2 as DirectionValues);
  const [sortColumn, setSortColumn] = useState('Date');

  if (!descendant) {
    return <Error statusCode={404} />;
  }
  const { is_ultimate, attribute, descendant_image_url, descendant_name } = descendant;

  const sortButtons = (
    <SortButtons
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
      sortColumn={sortColumn}
      setSortColumn={setSortColumn}
    />
  );

  return (
    <>
      <Header seo={seo} slug={[slug]} />
      <Container className="attributes tiers zones">
        <div className="flex w-full flex-col justify-center gap-4 2xl:flex-row">
          <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/4 2xl:flex-col">
            <div className="flex w-full flex-col gap-4">
              <DescendantCard {...descendant} />
              {sortButtons}
              <TFDLink path={`/builds/descendants/${slug}/builder`}>
                <Button>New Build</Button>
              </TFDLink>
            </div>
          </div>
          <div className="mt-4 flex flex-col flex-wrap gap-2 2xl:mt-0 2xl:w-3/4">
            {builds ? (
              sortBuilds(builds, sortDirection, sortColumn).map(build => (
                <div key={`${build.id} ${build.title}`} className="w-full">
                  <BuildCard
                    {...build}
                    slug={slug}
                    labelType={is_ultimate ? 'Ultimate' : attribute}
                    imageSrc={descendant_image_url}
                    imageAlt={descendant_name}
                    imageBackground={is_ultimate ? 'bg-ultimate' : 'bg-standard'}
                  />
                </div>
              ))
            ) : (
              <h2 className="h-min px-6 py-2 text-center text-4xl">No Builds Found</h2>
            )}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticPaths = (async () => {
  if (!process.env.DESCENDANT_JSON) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const descendants = (await (await fetch(process.env.DESCENDANT_JSON)).json()) as DescendantAPIData[];
  const paths = descendants.map(({ descendant_name }) => ({
    params: {
      slug: kebabCase(descendant_name),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  if (!process.env.DESCENDANT_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const slug = params?.slug as string;
  const descendant = formatDescendantData(
    (await (await fetch(process.env.DESCENDANT_JSON)).json()).filter(
      ({ descendant_name }: DescendantAPIData) => slug === kebabCase(descendant_name),
    ),
  )[0];

  const builds = (await importBuilds({ buildFor: descendant.descendant_name }))?.descendant || null;

  const title = `${descendant.descendant_name} Builds | The First Descendant`;
  const description = `View all ${descendant.descendant_name} builds in The First Descendant (TFD)`;

  return {
    props: {
      slug,
      descendant,
      builds,
      seo: getTfdSeo({ title, description, slug: `/builds/descendants/${slug}` }),
    },
    revalidate: 60,
  };
}) satisfies GetStaticProps;

export default Index;
