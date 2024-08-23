import Error from 'next/error';
import { useEffect, useState } from 'react';

import type {
  ExternalComponentTypes,
  ExternalComponentsFilterMap,
  FormattedBasicData,
  FormattedSetData,
} from '@/components/tfd/externalComponents/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import AccordionContained from '@/components/accordion/AccordionContained';
import AccordionDropdownPanel from '@/components/accordion/AccordionDropdownPanel';
import Container from '@/components/container/Container';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import Table from '@/components/table/Table';
import ExternalComponentBasicHeader from '@/components/tfd/externalComponents/ExternalComponentBasicHeader';
import ExternalComponentCard from '@/components/tfd/externalComponents/ExternalComponentCard';
import {
  externalComponentStats,
  externalComponentsArray,
  filterOptions,
} from '@/components/tfd/externalComponents/types';
import { sortComponentsBySet } from '@/components/tfd/externalComponents/utils';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import { tiers } from '@/utils/types';
import { createFilterMap, getTfdSeo } from '@/utils/utils';

interface ExternalComponentsProps {
  filterMap: ExternalComponentsFilterMap;
  error: boolean;
  basicComponents: FormattedBasicData;
  setComponents: FormattedSetData[];
  setList: string[];
  seo: NextSeoProps;
}

const ExternalComponents: FC<ExternalComponentsProps> = ({
  filterMap,
  error,
  basicComponents,
  setList,
  setComponents,
  seo,
}) => {
  const [filteredSet, setFilteredSet] = useState(setComponents);
  const [filter, setFilter] = useState(filterMap);
  const [selectedSet, setSelectedSet] = useState(setList[0]);
  const [isError] = useState(error || !setComponents || !basicComponents);
  const isAll = selectedSet === setList[0];

  useEffect(() => {
    const currentFilter = setComponents.filter(component => {
      const validComponent = isAll && filter[component['external_component_tier']];
      const isSelected = selectedSet === component.external_component_set_name;

      return validComponent || isSelected;
    });

    setFilteredSet(currentFilter);
  }, [filter, selectedSet]);

  if (isError) {
    return <Error statusCode={404} />;
  }

  const selectButtons = (
    <AccordionDropdownPanel options={setList} selected={selectedSet} setSelected={setSelectedSet} />
  );

  return (
    <>
      <Header seo={seo} />
      <Container className="tiers">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {Object.entries(externalComponentStats.subStats).map(([component, subStats]) => (
            <Table
              className="h-min"
              key={component}
              label={component}
              labelSize="text-2xl"
              headers={
                <ExternalComponentBasicHeader
                  component={component}
                  {...basicComponents[component as ExternalComponentTypes]}
                />
              }
              body={Object.entries(subStats).map(([label, { min, max }]) => (
                <tr key={label}>
                  <td className="border-r-2 border-black p-2 text-xl font-semibold">{label}</td>
                  <td className="w-48 p-2 text-right text-xl">
                    <span>
                      <span className="label-standard">{min}</span>
                      {' to '}
                      <span className="label-ultimate">{max}</span>
                    </span>
                  </td>
                </tr>
              ))}
            />
          ))}
        </div>
      </Container>
      <Container className="tiers">
        <div className="flex w-full flex-col gap-1 2xl:flex-row 2xl:gap-4">
          <div className="2xl:sticky-below-header flex h-min flex-row justify-center gap-4 2xl:w-1/6 2xl:flex-col">
            <div className="flex w-full flex-row flex-wrap justify-center gap-4">
              <FilterOptions filterOptions={[filterOptions]} filter={filter} setFilter={setFilter} />
              <AccordionContained label="Select Set" panelMaxHeight={384} panelClassName="px-0 py-2 gap-1">
                {selectButtons}
              </AccordionContained>
            </div>
          </div>
          <div className="flex h-min flex-row flex-wrap justify-center gap-4 2xl:mt-4 2xl:w-5/6">
            {filteredSet.map(component => (
              <div
                key={component.external_component_set_name}
                className={['flex', isAll ? 'md:w-[432px]' : 'w-5/12'].join(' ')}
              >
                <ExternalComponentCard {...component} />
              </div>
            ))}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = (async () => {
  if (!process.env.EXTERNAL_COMPONENT_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }
  const { setComponents, basicComponents, setList } = sortComponentsBySet(
    await (await fetch(process.env.EXTERNAL_COMPONENT_JSON)).json(),
  );

  const filterMap = createFilterMap([...tiers, ...externalComponentsArray]) as ExternalComponentsFilterMap;
  const title = 'External Components | The First Descendant';
  const description = `Tool for External Component data in The First Descendant (TFD). 
    Contains main stats, substats, set data for Auxiliary Power, Sensor, Memory, and Processor`;
  const slug = '/external-components';

  return {
    props: {
      filterMap,
      setList,
      setComponents,
      basicComponents,
      seo: getTfdSeo({ title, description, slug }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default ExternalComponents;
