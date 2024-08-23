import Error from 'next/error';
import { useEffect, useState } from 'react';

import type { DirectionValues } from '@/components/inputs/types';
import type { FormattedWeaponData, WeaponFilterMap } from '@/components/tfd/weapon/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import Table from '@/components/table/Table';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import WeaponHeaders from '@/components/tfd/weapon/WeaponHeaders';
import WeaponRow from '@/components/tfd/weapon/WeaponRow';
import { roundsArray, weaponArray, weaponFilterKeys, weaponOptions } from '@/components/tfd/weapon/types';
import { reformatWeaponData } from '@/components/tfd/weapon/utils';
import { tiers } from '@/utils/types';
import use3xlScreen from '@/utils/use3xlScreen';
import { camelCase, createFilterMap, getTfdSeo, sortData } from '@/utils/utils';

interface WeaponDPSProps {
  error: boolean;
  filterMap: WeaponFilterMap;
  weapons: FormattedWeaponData[];
  seo: NextSeoProps;
}

const WeaponDps: FC<WeaponDPSProps> = ({ error, filterMap, weapons, seo }) => {
  const is3xlScreen = use3xlScreen();
  const [filteredWeapons, setFilteredWeapons] = useState(weapons);
  const [filter, setFilter] = useState(filterMap);
  const [sortDirection, setSortDirection] = useState(0 as DirectionValues);
  const [sortColumn, setSortColumn] = useState('');
  const [isError] = useState(error || !weapons);

  useEffect(() => {
    if (isError) {
      return;
    }
    const sortKey = camelCase(sortColumn) as keyof FormattedWeaponData;
    const statSort = () => {
      if ((sortKey as string) === 'weaponLvl100' && sortDirection === 2) {
        return [...weapons].reverse();
      }

      return [...weapons].sort((a, b) =>
        sortData(a[sortKey] as string | number, b[sortKey] as string | number, sortDirection),
      );
    };

    const sortedWeapons = sortDirection !== 0 ? statSort() : weapons;
    const currentFilter = sortedWeapons.filter(weapon => weaponFilterKeys.every(key => filter[weapon[key]]));

    setFilteredWeapons(currentFilter);
  }, [filter, sortDirection, sortColumn]);

  if (isError) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Header seo={seo} />
      {!is3xlScreen && (
        <Container className="attributes zones tiers rounds">
          <div className=" flex flex-col justify-center gap-4 2xl:flex-row">
            <FilterOptions filterOptions={weaponOptions} filter={filter} setFilter={setFilter} />
          </div>
        </Container>
      )}
      <Container className="attributes zones tiers rounds">
        <div className="flex flex-col justify-center gap-4 2xl:flex-row">
          {is3xlScreen && (
            <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/6 2xl:flex-col 3xl:mt-9">
              {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
              <div className="2xl:scroll-bar-left scroll-bar-thin flex flex-row flex-wrap items-start justify-center gap-4 2xl:max-h-[90vh] 2xl:overflow-auto 2xl:px-2 2xl:pb-2">
                <div className="flex h-min flex-row flex-wrap justify-center gap-4">
                  <FilterOptions
                    checkboxContainerClasses="grid-cols-1"
                    filterOptions={weaponOptions}
                    filter={filter}
                    setFilter={setFilter}
                    type="accordion"
                  />
                </div>
              </div>
            </div>
          )}
          <Table
            label="Weapon DPS Chart"
            headers={WeaponHeaders()}
            body={filteredWeapons.map(row => (
              <WeaponRow key={row.weapon_id} {...row} />
            ))}
            sortDirection={sortDirection}
            sortColumn={sortColumn}
            setSortDirection={setSortDirection}
            setSortColumn={setSortColumn}
            isStickyHeader
            isColumnSticky
          />
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

  const title = 'Weapon DPS Table | The First Descendant';
  const description = `Tool for filtering and sorting weapons in The First Descendant (TFD).
    Filters weapons by rarity, rounds, weapon type. 
    Sorts by Firearm attack (ATK), Magazine Size (Rounds per Magazine), Fire Rate, 
    Critical Hit Chance, Critical Hit Damage, Weak Point Damage, Reload Time, Status Chance, 
    Damage per second (DPS), Critical DPS, Critical with Weak Point DPS`;
  const slug = '/dps';

  return {
    props: {
      filterMap,
      weapons,
      seo: getTfdSeo({ title, description, slug }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default WeaponDps;
