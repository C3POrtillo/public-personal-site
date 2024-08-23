import { useEffect, useState } from 'react';

import type { DirectionValues } from '@/components/inputs/types';
import type {
  FilterTypes,
  VoidFragmentData,
  VoidFragmentFilterMap,
  VoidFragmentFilterTypes,
  shardsArray,
} from '@/components/tfd/void-fragments/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import Table from '@/components/table/Table';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import VoidFragmentHeaders from '@/components/tfd/void-fragments/VoidFragmentHeaders';
import VoidFragmentRow from '@/components/tfd/void-fragments/VoidFragmentRow';
import {
  fragmentOptions,
  subregionsArray,
  voidFragmentFilterKeys,
  zoneOptions,
  zonesArray,
} from '@/components/tfd/void-fragments/types';
import { reformatZoneData } from '@/components/tfd/void-fragments/utils';
import { attributeOptions, attributesArray } from '@/utils/attributes/types';
import use2xlScreen from '@/utils/use2xlScreen';
import { createFilterMap, getTfdSeo, sortData, titleCase } from '@/utils/utils';

interface VoidShardsProps {
  filterMap: VoidFragmentFilterMap;
  voidFragments: VoidFragmentData[];
  seo: NextSeoProps;
}

const VoidShards: FC<VoidShardsProps> = ({ filterMap, voidFragments, seo }) => {
  const is2xlScreen = use2xlScreen();
  const [filteredRows, setFilteredRows] = useState(voidFragments);
  const [filter, setFilter] = useState(filterMap);
  const [sortDirection, setSortDirection] = useState(0 as DirectionValues);
  const [sortColumn, setSortColumn] = useState('');

  useEffect(() => {
    const sortKey = sortColumn.toLowerCase() as FilterTypes;
    const sortedFragments =
      sortDirection !== 0
        ? [...voidFragments].sort((a, b) => sortData(a[sortKey], b[sortKey], sortDirection))
        : voidFragments;

    const currentFilter = sortedFragments.filter(fragment => {
      const validFragment = voidFragmentFilterKeys.every(key => {
        switch (key) {
          case 'monomer':
          case 'polymer':
          case 'organic':
          case 'inorganic':
            return !filter[titleCase(key) as (typeof shardsArray)[number]] || (fragment[key] as number) > 0;
          default:
            return filter[fragment[key] as VoidFragmentFilterTypes];
        }
      });

      return validFragment;
    });

    setFilteredRows(currentFilter);
  }, [filter, sortDirection, sortColumn]);

  return (
    <>
      <Header seo={seo} />
      {!is2xlScreen && (
        <Container className="attributes zones flex flex-row flex-wrap">
          <FilterOptions
            filterOptions={[fragmentOptions, attributeOptions, zoneOptions[0]]}
            filter={filter}
            setFilter={setFilter}
          />
          <FilterOptions
            filterOptions={[...zoneOptions.slice(1)]}
            filter={filter}
            setFilter={setFilter}
            type="carousel"
          />
        </Container>
      )}
      <Container className="attributes zones">
        <div className="flex flex-col justify-center gap-4 2xl:flex-row">
          {is2xlScreen && (
            <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/6 2xl:flex-col">
              {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
              <div className="2xl:scroll-bar-left scroll-bar-thin flex flex-row flex-wrap items-start justify-center gap-4 2xl:mt-9 2xl:max-h-[90vh] 2xl:overflow-auto 2xl:px-2 2xl:pb-2">
                <div className="flex h-min flex-row flex-wrap justify-center gap-4">
                  <FilterOptions
                    checkboxContainerClasses="grid-cols-1"
                    filterOptions={[fragmentOptions, attributeOptions, ...zoneOptions]}
                    filter={filter}
                    setFilter={setFilter}
                    type="accordion"
                  />
                </div>
              </div>
            </div>
          )}
          <div>
            <Table
              label="Void Fragment Locations"
              sublabel={<p className="pb-2 text-center text-xl text-yellow-200">Fast locations marked in gold</p>}
              headers={VoidFragmentHeaders()}
              body={filteredRows.map(data => (
                <VoidFragmentRow key={data.subregion} data={data} />
              ))}
              sortDirection={sortDirection}
              sortColumn={sortColumn}
              setSortDirection={setSortDirection}
              setSortColumn={setSortColumn}
              isStickyHeader
              isColumnSticky
              stickyColumnIndex={1}
            />
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = (async () => {
  const voidFragments = reformatZoneData();

  const defaultFilter = [...attributesArray, ...zonesArray, ...subregionsArray] as VoidFragmentFilterTypes[];
  const filterMap = createFilterMap(defaultFilter) as VoidFragmentFilterMap;

  const title = 'Void Shards | The First Descendant';
  const description = `Tool for filtering or sorting Void Fragment missions in The First Descedant (TFD). 
    Filters missions based on location, attributes, and void shard type.`;
  const slug = '/void-shards';

  return {
    props: {
      filterMap,
      voidFragments,
      seo: getTfdSeo({ title, description, slug }),
    },
  };
}) satisfies GetStaticProps;

export default VoidShards;
