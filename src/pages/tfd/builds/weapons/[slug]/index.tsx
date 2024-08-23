import Error from 'next/error';
import { useState } from 'react';

import type { DirectionValues } from '@/components/inputs/types';
import type { BuildData } from '@/components/tfd/builds/types';
import type { FormattedWeaponData, WeaponAPIData } from '@/components/tfd/weapon/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import BuildCard from '@/components/tfd/builds/BuildCard';
import SortButtons from '@/components/tfd/builds/SortButtons';
import { importBuilds, sortBuilds } from '@/components/tfd/builds/utils';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import TFDLink from '@/components/tfd/header/Link';
import WeaponCard from '@/components/tfd/weapon/WeaponCard';
import { reformatWeaponData } from '@/components/tfd/weapon/utils';
import { getBackgroundLinear, getTfdSeo, kebabCase } from '@/utils/utils';

interface IndexProps {
  slug: string;
  seo: NextSeoProps;
  weapon: FormattedWeaponData;
  builds: BuildData[] | null;
}

const Index: FC<IndexProps> = ({ slug, seo, weapon, builds }) => {
  const [sortDirection, setSortDirection] = useState(2 as DirectionValues);
  const [sortColumn, setSortColumn] = useState('Date');

  if (!weapon) {
    return <Error statusCode={404} />;
  }
  const { weapon_tier, image_url, weapon_name } = weapon;

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
              <WeaponCard {...weapon} />
              {sortButtons}
              <TFDLink path={`/builds/weapons/${slug}/builder`}>
                <Button>New Build</Button>
              </TFDLink>
            </div>
          </div>
          <div className="mt-4 flex flex-col flex-wrap gap-2 2xl:mt-0 2xl:w-3/4">
            {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
            {builds ? (
              sortBuilds(builds, sortDirection, sortColumn).map(build => (
                <div key={`${build.id} ${build.title}`} className="w-full">
                  <BuildCard
                    {...build}
                    slug={slug}
                    labelType={weapon_tier}
                    imageSrc={image_url}
                    imageAlt={weapon_name}
                    imageBackground={getBackgroundLinear(weapon_tier)}
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
  if (!process.env.WEAPON_JSON) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const weapons = (await (await fetch(process.env.WEAPON_JSON)).json()) as WeaponAPIData[];
  const paths = weapons.map(({ weapon_name }) => ({
    params: {
      slug: kebabCase(weapon_name),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  if (!process.env.WEAPON_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const slug = params?.slug as string;
  const weapon = reformatWeaponData(
    (await (await fetch(process.env.WEAPON_JSON)).json()).filter(
      ({ weapon_name }: WeaponAPIData) => slug === kebabCase(weapon_name),
    ),
  )[0];

  const builds = (await importBuilds({ buildFor: weapon.weapon_name }))?.weapon || null;

  const title = `${weapon.weapon_name} Builds | The First Descendant`;
  const description = `View all ${weapon.weapon_name} builds in The First Descendant (TFD)`;

  return {
    props: {
      slug,
      weapon,
      builds,
      seo: getTfdSeo({ title, description, slug: `/builds/weapons/${slug}` }),
    },
    revalidate: 60,
  };
}) satisfies GetStaticProps;

export default Index;
