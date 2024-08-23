import { useEffect, useState } from 'react';

import type { DirectionValues } from '@/components/inputs/types';
import type { ImportBuildData } from '@/components/tfd/builds/types';
import type { DescendantFilterMap, FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { FormattedWeaponData, WeaponFilterMap } from '@/components/tfd/weapon/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import Text from '@/components/inputs/Text/Text';
import BuildCard from '@/components/tfd/builds/BuildCard';
import SortButtons from '@/components/tfd/builds/SortButtons';
import { filterDescendantBuilds, filterWeaponBuilds, importBuilds, sortBuilds } from '@/components/tfd/builds/utils';
import { tierOptions } from '@/components/tfd/descendants/types';
import { formatDescendantData } from '@/components/tfd/descendants/utils';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import { roundsArray, weaponArray, weaponOptions } from '@/components/tfd/weapon/types';
import { reformatWeaponData } from '@/components/tfd/weapon/utils';
import { attributeOptions, attributesArray } from '@/utils/attributes/types';
import { tiers } from '@/utils/types';
import { createFilterMap, getBackgroundLinear, getTfdSeo, kebabCase } from '@/utils/utils';

interface IndexProps {
  seo: NextSeoProps;
  descendants: Record<string, FormattedDescendantData>;
  descendantsFilterMap: DescendantFilterMap;
  weapons: Record<string, FormattedWeaponData>;
  weaponsFilterMap: WeaponFilterMap;
  builds: ImportBuildData;
}

const noBuilds = <h2 className="h-min px-6 py-2 text-center text-4xl">No Builds Found</h2>;

const Index: FC<IndexProps> = ({ seo, descendants, descendantsFilterMap, weapons, weaponsFilterMap, builds }) => {
  const [filteredDescendants, setFilteredDescendants] = useState(builds?.descendant);
  const [filteredWeapons, setFilteredWeapons] = useState(builds?.weapon);
  const [searchFilter, setSearchFilter] = useState('');
  const [descendantFilter, setDescendantFilter] = useState(descendantsFilterMap);
  const [weaponFilter, setWeaponFilter] = useState(weaponsFilterMap);
  const [type, setType] = useState<'Descendants' | 'Weapons'>('Descendants');
  const [sortDirection, setSortDirection] = useState(2 as DirectionValues);
  const [sortColumn, setSortColumn] = useState('Date');
  const isDescendant = type === 'Descendants';

  const filterProps = {
    filterOptions: isDescendant ? [attributeOptions, tierOptions] : weaponOptions,
    filter: isDescendant ? descendantFilter : weaponFilter,
    setFilter: isDescendant ? setDescendantFilter : setWeaponFilter,
    type: isDescendant ? undefined : ('accordion' as const),
  };

  useEffect(() => {
    if (!isDescendant || !builds?.descendant) {
      return;
    }
    const currentFilter = sortBuilds(
      filterDescendantBuilds(builds.descendant, descendants, descendantFilter, searchFilter),
      sortDirection,
      sortColumn,
    );
    setFilteredDescendants(currentFilter);
  }, [descendantFilter, searchFilter, type, sortDirection, sortColumn]);

  useEffect(() => {
    if (isDescendant || !builds?.weapon) {
      return;
    }
    const currentFilter = sortBuilds(
      filterWeaponBuilds(builds.weapon, weapons, weaponFilter, searchFilter),
      sortDirection,
      sortColumn,
    );
    setFilteredWeapons(currentFilter);
  }, [weaponFilter, searchFilter, type, sortDirection, sortColumn]);

  const viewButtons = (['Descendants', 'Weapons'] as const).map(label => (
    <Button key={label} onClick={() => setType(label)} selected={type === label}>
      {label}
    </Button>
  ));

  const sortButtons = (
    <SortButtons
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
      sortColumn={sortColumn}
      setSortColumn={setSortColumn}
    />
  );

  const descendantBuilds =
    filteredDescendants?.map(build => {
      const { descendant_image_url, is_ultimate, attribute } = descendants[build.buildFor];

      return (
        <div key={`${build.id} ${build.title}`} className="w-full">
          <BuildCard
            {...build}
            slug={kebabCase(build.buildFor)}
            labelType={is_ultimate ? 'Ultimate' : attribute}
            imageSrc={descendant_image_url}
            imageAlt={build.buildFor}
            imageBackground={is_ultimate ? 'bg-ultimate' : 'bg-standard'}
          />
        </div>
      );
    }) || noBuilds;

  const weaponBuilds =
    filteredWeapons?.map(build => {
      const { weapon_tier, image_url } = weapons[build.buildFor];

      return (
        <div key={`${build.id} ${build.title}`} className="w-full">
          <BuildCard
            {...build}
            slug={kebabCase(build.buildFor)}
            labelType={weapon_tier}
            imageSrc={image_url}
            imageAlt={build.buildFor}
            imageBackground={getBackgroundLinear(weapon_tier)}
          />
        </div>
      );
    }) || noBuilds;

  return (
    <>
      <Header seo={seo} />
      <Container className="attributes tiers zones rounds">
        <div className="flex w-full flex-col justify-center gap-4 lg:flex-row">
          <div className="lg:sticky-below-header flex h-min flex-row justify-center gap-4 lg:w-1/4 lg:flex-col 2xl:w-1/6">
            <div className="flex w-full flex-row flex-wrap justify-center gap-4">
              {viewButtons}
              {sortButtons}
              <div className="w-full rounded-md border-2 border-black bg-neutral-800 p-2 shadow-md shadow-black">
                <Text
                  label={isDescendant ? 'Name/Attribute' : 'Name/Rounds/Type'}
                  setState={setSearchFilter}
                  placeholder="Search..."
                  value={searchFilter}
                />
              </div>
              <FilterOptions checkboxContainerClasses="grid-cols-1 md:grid-cols-3 lg:grid-cols-1" {...filterProps} />
            </div>
          </div>
          <div className="mt-4 flex flex-col flex-wrap gap-2 lg:mt-0 lg:w-3/4 2xl:w-5/6">
            {isDescendant ? descendantBuilds : weaponBuilds}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = (async () => {
  const { DESCENDANT_JSON, WEAPON_JSON } = process.env;

  if (!DESCENDANT_JSON || !WEAPON_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const descendants = formatDescendantData(await (await fetch(DESCENDANT_JSON)).json()).reduce((acc, data) => {
    acc[data.descendant_name] ??= data;

    return acc;
  }, {} as Record<string, FormattedDescendantData>);
  const descendantsFilterMap = createFilterMap([...attributesArray, 'Standard', 'Ultimate']) as DescendantFilterMap;
  const weapons = reformatWeaponData(await (await fetch(WEAPON_JSON)).json()).reduce((acc, data) => {
    acc[data.weapon_name] ??= data;

    return acc;
  }, {} as Record<string, FormattedWeaponData>);
  const weaponsFilterMap = createFilterMap([...tiers, ...roundsArray, ...weaponArray]) as WeaponFilterMap;
  const builds = await importBuilds();
  const title = 'All Builds | The First Descendant';
  const description = 'View all builds for The First Descendant (TFD).';
  const slug = '/builds';

  return {
    props: {
      builds,
      descendants,
      descendantsFilterMap,
      weapons,
      weaponsFilterMap,
      seo: getTfdSeo({ title, description, slug }),
    },
    revalidate: 60,
  };
}) satisfies GetStaticProps;

export default Index;
