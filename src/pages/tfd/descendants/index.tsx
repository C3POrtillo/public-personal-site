import { useEffect, useState } from 'react';

import type { DescendantFilterMap, FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import Text from '@/components/inputs/Text/Text';
import DescendantCard from '@/components/tfd/descendants/DescendantCard';
import { tierOptions } from '@/components/tfd/descendants/types';
import { filterAndSortDescendants, formatDescendantData } from '@/components/tfd/descendants/utils';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import TFDLink from '@/components/tfd/header/Link';
import { attributeOptions, attributesArray } from '@/utils/attributes/types';
import { createFilterMap, getTfdSeo, kebabCase } from '@/utils/utils';

interface IndexProps {
  seo: NextSeoProps;
  descendants: FormattedDescendantData[];
  filterMap: DescendantFilterMap;
}

const Index: FC<IndexProps> = ({ seo, descendants, filterMap }) => {
  const [filteredDescendants, setFilteredDescendants] = useState(descendants);
  const [searchFilter, setSearchFilter] = useState('');
  const [filter, setFilter] = useState(filterMap);

  useEffect(() => {
    const currentFilter = filterAndSortDescendants(descendants, filter, searchFilter);
    setFilteredDescendants(currentFilter);
  }, [filter, searchFilter]);

  const descendantCards = filteredDescendants.map(descendant => (
    <TFDLink
      key={descendant.descendant_id}
      path={`/descendants/${kebabCase(descendant.descendant_name)}`}
      className="rounded-lg"
    >
      <DescendantCard {...descendant} className="input-hover" />
    </TFDLink>
  ));

  return (
    <>
      <Header seo={seo} />
      <Container className="attributes tiers zones">
        <div className="flex w-full flex-col justify-center gap-4 2xl:flex-row">
          <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/6 2xl:flex-col">
            <div className="flex flex-row flex-wrap justify-center gap-4">
              <div className="w-full rounded-md border-2 border-black bg-neutral-800 p-2 shadow-md shadow-black">
                <Text label="Name/Attribute" setState={setSearchFilter} placeholder="Search..." value="" />
              </div>
              <FilterOptions filterOptions={[attributeOptions, tierOptions]} filter={filter} setFilter={setFilter} />
            </div>
          </div>
          {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
          <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-2 lg:flex lg:flex-row lg:flex-wrap 2xl:w-5/6">
            {descendantCards}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = (async () => {
  if (!process.env.DESCENDANT_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const filterMap = createFilterMap([...attributesArray, 'Standard', 'Ultimate']) as DescendantFilterMap;

  const descendants = formatDescendantData(await (await fetch(process.env.DESCENDANT_JSON)).json());

  const title = 'Descendants | The First Descendant';
  const description = `Tool for all Descendant data in The First Descendant (TFD). 
    Lists all descendants and their max stats at Lvl. 40`;
  const slug = '/descendants';

  return {
    props: {
      descendants,
      filterMap,
      seo: getTfdSeo({ title, description, slug }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default Index;
