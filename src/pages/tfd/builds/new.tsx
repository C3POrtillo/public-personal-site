import { useEffect, useState } from 'react';

import type { DescendantFilterMap, FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { FormattedWeaponData, WeaponFilterMap } from '@/components/tfd/weapon/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import Text from '@/components/inputs/Text/Text';
import DescendantCard from '@/components/tfd/descendants/DescendantCard';
import { tierOptions } from '@/components/tfd/descendants/types';
import { filterAndSortDescendants, formatDescendantData } from '@/components/tfd/descendants/utils';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import TFDLink from '@/components/tfd/header/Link';
import WeaponCard from '@/components/tfd/weapon/WeaponCard';
import { roundsArray, weaponArray, weaponOptions } from '@/components/tfd/weapon/types';
import { filterAndSortWeapons, reformatWeaponData } from '@/components/tfd/weapon/utils';
import { attributeOptions, attributesArray } from '@/utils/attributes/types';
import { tiers } from '@/utils/types';
import { createFilterMap, getTfdSeo, kebabCase } from '@/utils/utils';

interface IndexProps {
  seo: NextSeoProps;
  descendants: FormattedDescendantData[];
  descendantsFilterMap: DescendantFilterMap;
  weapons: FormattedWeaponData[];
  weaponsFilterMap: WeaponFilterMap;
}

const Index: FC<IndexProps> = ({ seo, descendants, descendantsFilterMap, weapons, weaponsFilterMap }) => {
  const [filteredDescendants, setFilteredDescendants] = useState(descendants);
  const [filteredWeapons, setFilteredWeapons] = useState(weapons);
  const [searchFilter, setSearchFilter] = useState('');
  const [descendantFilter, setDescendantFilter] = useState(descendantsFilterMap);
  const [weaponFilter, setWeaponFilter] = useState(weaponsFilterMap);
  const [type, setType] = useState<'Descendants' | 'Weapons'>('Descendants');
  const isDescendant = type === 'Descendants';

  const filterProps = {
    filterOptions: isDescendant ? [attributeOptions, tierOptions] : weaponOptions,
    filter: isDescendant ? descendantFilter : weaponFilter,
    setFilter: isDescendant ? setDescendantFilter : setWeaponFilter,
    type: isDescendant ? undefined : ('accordion' as const),
  };

  useEffect(() => {
    if (!isDescendant) {
      return;
    }
    const currentFilter = filterAndSortDescendants(descendants, descendantFilter, searchFilter);
    setFilteredDescendants(currentFilter);
  }, [descendantFilter, searchFilter, type]);

  useEffect(() => {
    if (isDescendant) {
      return;
    }
    const currentFilter = filterAndSortWeapons(weapons, weaponFilter, searchFilter);
    setFilteredWeapons(currentFilter);
  }, [weaponFilter, searchFilter, type]);

  const descendantCards = filteredDescendants.map(descendant => (
    <TFDLink
      key={descendant.descendant_id}
      path={`/builds/descendants/${kebabCase(descendant.descendant_name)}/builder`}
      className="rounded-lg"
    >
      <DescendantCard {...descendant} hideStats className="input-hover" />
    </TFDLink>
  ));

  const weaponCards = filteredWeapons.map(weapon => (
    <TFDLink
      key={weapon.weapon_id}
      path={`/builds/weapons/${kebabCase(weapon.weapon_name)}/builder`}
      className="rounded-lg"
    >
      <WeaponCard {...weapon} className="input-hover" hideStats />
    </TFDLink>
  ));

  const viewButtons = (['Descendants', 'Weapons'] as const).map(label => (
    <Button key={label} onClick={() => setType(label)} selected={type === label}>
      {label}
    </Button>
  ));

  return (
    <>
      <Header seo={seo} />
      <Container className="attributes tiers zones rounds">
        <div className="flex w-full flex-col justify-center gap-4 2xl:flex-row">
          <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/6 2xl:flex-col">
            {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
            <div className="2xl:scroll-bar-left scroll-bar-thin flex flex-row flex-wrap justify-center gap-4 2xl:max-h-[90vh] 2xl:overflow-auto 2xl:px-2 2xl:pb-2">
              {viewButtons}
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
          {isDescendant ? (
            <div className="grid h-min grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:w-5/6 3xl:grid-cols-4">
              {descendantCards}
            </div>
          ) : (
            <div className="grid h-min grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:w-5/6 3xl:grid-cols-5">
              {weaponCards}
            </div>
          )}
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

  const descendants = formatDescendantData(await (await fetch(DESCENDANT_JSON)).json());
  const descendantsFilterMap = createFilterMap([...attributesArray, 'Standard', 'Ultimate']) as DescendantFilterMap;
  const weapons = reformatWeaponData(await (await fetch(WEAPON_JSON)).json());
  const weaponsFilterMap = createFilterMap([...tiers, ...roundsArray, ...weaponArray]) as WeaponFilterMap;

  const title = 'New Build | The First Descendant';
  const description = 'Create a new Descendant or weapon build in The First Descendant (TFD).';
  const slug = '/builds/new';

  return {
    props: {
      descendants,
      descendantsFilterMap,
      weapons,
      weaponsFilterMap,
      seo: getTfdSeo({ title, description, slug }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default Index;
