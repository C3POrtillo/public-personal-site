import { useEffect, useState } from 'react';

import type { FormattedWeaponData, WeaponFilterMap } from '@/components/tfd/weapon/types';
import type { GetStaticProps } from 'next';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import Text from '@/components/inputs/Text/Text';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import TFDLink from '@/components/tfd/header/Link';
import WeaponCard from '@/components/tfd/weapon/WeaponCard';
import { roundsArray, weaponArray, weaponOptions } from '@/components/tfd/weapon/types';
import { filterAndSortWeapons, reformatWeaponData } from '@/components/tfd/weapon/utils';
import { tiers } from '@/utils/types';
import { createFilterMap, getTfdSeo, kebabCase } from '@/utils/utils';

interface IndexProps {
  seo: NextSeoProps;
  weapons: FormattedWeaponData[];
  filterMap: WeaponFilterMap;
}

const Index: FC<IndexProps> = ({ seo, weapons, filterMap }) => {
  const [filteredWeapons, setFilteredWeapons] = useState(weapons);
  const [searchFilter, setSearchFilter] = useState('');
  const [filter, setFilter] = useState(filterMap);

  useEffect(() => {
    const currentFilter = filterAndSortWeapons(weapons, filter, searchFilter);
    setFilteredWeapons(currentFilter);
  }, [filter, searchFilter]);

  const weaponCards = filteredWeapons.map(weapon => (
    <TFDLink key={weapon.weapon_id} path={`/builds/weapons/${kebabCase(weapon.weapon_name)}`} className="rounded-lg">
      <WeaponCard {...weapon} className="input-hover" hideStats />
    </TFDLink>
  ));

  return (
    <>
      <Header seo={seo} />
      <Container className="attributes zones tiers rounds">
        <div className="flex w-full flex-col justify-center gap-4 2xl:flex-row">
          <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/6 2xl:flex-col">
            {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
            <div className="2xl:scroll-bar-left scroll-bar-thin flex flex-row flex-wrap justify-center gap-4 2xl:max-h-[90vh] 2xl:overflow-auto 2xl:px-2 2xl:pb-2">
              <div className="w-full rounded-md border-2 border-black bg-neutral-800 p-2 shadow-md shadow-black">
                <Text label="Name/Attribute" setState={setSearchFilter} placeholder="Search..." value={searchFilter} />
              </div>
              <FilterOptions
                checkboxContainerClasses="grid-cols-1 md:grid-cols-3 lg:grid-cols-1"
                filterOptions={weaponOptions}
                filter={filter}
                setFilter={setFilter}
                type="accordion"
              />
            </div>
          </div>
          <div className="grid h-min grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:w-5/6 3xl:grid-cols-5">
            {weaponCards}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = (async () => {
  if (!process.env.WEAPON_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const weapons = reformatWeaponData(await (await fetch(process.env.WEAPON_JSON)).json());
  const filterMap = createFilterMap([...tiers, ...roundsArray, ...weaponArray]) as WeaponFilterMap;

  const title = 'Weapon Builds | The First Descendant';
  const description = 'View all weapon builds in The First Descendant (TFD)';
  const slug = '/builds/weapons';

  return {
    props: {
      weapons,
      filterMap,
      seo: getTfdSeo({ title, description, slug }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default Index;
