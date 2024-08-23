import { useEffect, useState } from 'react';

import type { FormattedWeaponData, WeaponFilterMap } from '@/components/tfd/weapon/types';
import type { GetStaticProps } from 'next/types';
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
    <TFDLink key={weapon.weapon_id} path={`/weapons/${kebabCase(weapon.weapon_name)}`} className="rounded-lg">
      <WeaponCard {...weapon} className="input-hover" />
    </TFDLink>
  ));

  return (
    <>
      <Header seo={seo} />
      <Container className="attributes zones tiers rounds">
        <div className="flex w-full flex-col justify-center gap-4 2xl:flex-row">
          <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/6 2xl:flex-col">
            <div className="flex flex-row flex-wrap justify-center gap-4">
              <div className="w-full rounded-md border-2 border-black bg-neutral-800 p-2 shadow-md shadow-black">
                <Text
                  label="Name/Rounds/Type"
                  setState={setSearchFilter}
                  placeholder="Search..."
                  value={searchFilter}
                />
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

  const title = 'Weapons | The First Descendant';
  const description = `Tool for all weapon data in The First Descendant (TFD). 
    Lists all weapons and their max stats at Lvl. 100`;
  const slug = '/weapons';

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
