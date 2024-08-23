import { useEffect, useState } from 'react';

import type { FormattedModuleData, ModuleFilterMap } from '@/components/tfd/module/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import Text from '@/components/inputs/Text/Text';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import ModuleCard from '@/components/tfd/module/ModuleCard';
import {
  classOptions,
  descendantNames,
  moduleClasses,
  moduleSockets,
  moduleTiers,
  moduleTypes,
  socketOptions,
  tierOptions,
  typeOptions,
} from '@/components/tfd/module/types';
import { filterModules, flattenModules, formatModules } from '@/components/tfd/module/utils';
import { createFilterMap, getTfdSeo } from '@/utils/utils';

interface IndexProps {
  seo: NextSeoProps;
  modules: FormattedModuleData;
  filterMap: ModuleFilterMap;
}

const Index: FC<IndexProps> = ({ seo, modules, filterMap }) => {
  const [filteredModules, setFilteredModules] = useState(flattenModules(modules));
  const [searchFilter, setSearchFilter] = useState('');
  const [filter, setFilter] = useState(filterMap);

  useEffect(() => {
    setFilteredModules(filterModules(modules, filter, searchFilter));
  }, [filter, searchFilter]);

  const moduleCards = filteredModules.map(module => (
    <div key={module.module_id}>
      <ModuleCard {...module} />
    </div>
  ));

  return (
    <>
      <Header seo={seo} />
      <Container className="rounds tiers">
        <div className="flex w-full flex-col justify-center gap-4 2xl:flex-row">
          <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/6 2xl:flex-col">
            {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
            <div className="2xl:scroll-bar-left scroll-bar-thin flex flex-row flex-wrap items-start justify-center gap-4 2xl:max-h-[90vh] 2xl:overflow-auto 2xl:px-2 2xl:pb-2">
              <div className="w-full rounded-md border-2 border-black bg-neutral-800 p-2 shadow-md shadow-black">
                <Text label="Name/Stats/Type" setState={setSearchFilter} placeholder="Search..." value="" />
              </div>
              <FilterOptions
                filterOptions={[tierOptions, classOptions, socketOptions]}
                filter={filter}
                setFilter={setFilter}
                type="accordion"
              />
              <FilterOptions
                checkboxContainerClasses="grid-cols-1 md:grid-cols-4 2xl:grid-cols-1"
                filterOptions={[typeOptions]}
                filter={filter}
                setFilter={setFilter}
                type="accordion"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-4 gap-y-8 2xl:mt-0 2xl:w-5/6">
            {moduleCards}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = (async () => {
  if (!process.env.MODULE_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const filterMap = createFilterMap([
    ...moduleTiers,
    ...moduleClasses,
    ...moduleSockets,
    ...moduleTypes,
    ...descendantNames,
  ]) as ModuleFilterMap;

  const modules = formatModules(await (await fetch(process.env.MODULE_JSON)).json());

  const title = 'Modules | The First Descendant';
  const description = `Tool for all module data in The First Descendant (TFD). 
    Lists all modules and their stats at every level`;
  const slug = '/modules';

  return {
    props: {
      modules,
      filterMap,
      seo: getTfdSeo({ title, description, slug }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default Index;
