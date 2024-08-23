import Error from 'next/error';
import { useState } from 'react';

import type { FilterOptionsData } from '@/components/inputs/types';
import type { DescendantAPIData, FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { FormattedExternalComponentsByType } from '@/components/tfd/externalComponents/types';
import type { ModuleAPIData, ModuleFilterMap, TierTypeData } from '@/components/tfd/module/types';
import type { FormattedReactorDataMap } from '@/components/tfd/reactor/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import { useAuth } from '@/components/tfd/accounts/AuthProvider';
import { BuildProvider } from '@/components/tfd/builds/BuildProvider';
import DescendantBuild from '@/components/tfd/builds/descendants/DescendantBuild';
import DescendantBuilder from '@/components/tfd/builds/descendants/DescendantBuilder';
import { resetFilter } from '@/components/tfd/builds/utils';
import { formatDescendantData } from '@/components/tfd/descendants/utils';
import { sortComponentsByType } from '@/components/tfd/externalComponents/utils';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import { descendantNames, moduleSockets, moduleTiers } from '@/components/tfd/module/types';
import { formatModules } from '@/components/tfd/module/utils';
import { reactorData } from '@/components/tfd/reactor/reactors';
import { createFilterMap, getTfdSeo, kebabCase } from '@/utils/utils';

interface BuilderProps {
  slug: string;
  seo: NextSeoProps;
  modules: TierTypeData;
  filterMap: ModuleFilterMap;
  descendant: FormattedDescendantData;
  typeOptions: FilterOptionsData;
  reactors: FormattedReactorDataMap;
  components: FormattedExternalComponentsByType;
}

const Builder: FC<BuilderProps> = ({ slug, seo, ...props }) => {
  const { isAuthenticated } = useAuth();
  const [isEdit, setEdit] = useState(true);

  if (!props.descendant) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Header seo={seo} slug={[slug]} />
      {isAuthenticated ? (
        <>
          <Container>
            <div className="flex flex-row gap-2">
              <Button size="button-md" onClick={() => setEdit(false)} selected={!isEdit}>
                View
              </Button>
              <Button size="button-md" onClick={() => setEdit(true)} selected={isEdit}>
                Edit
              </Button>
            </div>
          </Container>
          <BuildProvider build="descendant" buildFor={props.descendant.descendant_name}>
            {isEdit ? <DescendantBuilder {...props} /> : <DescendantBuild descendant={props.descendant} />}
          </BuildProvider>
        </>
      ) : (
        <h2 className="h-min px-6 py-2 text-center text-4xl">Please Log In</h2>
      )}
      <Footer />
    </>
  );
};

export const getStaticPaths = (async () => {
  if (!process.env.DESCENDANT_JSON) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const descendants = (await (await fetch(process.env.DESCENDANT_JSON)).json()) as DescendantAPIData[];
  const paths = descendants.map(({ descendant_name }) => ({
    params: {
      slug: kebabCase(descendant_name),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const { DESCENDANT_JSON, MODULE_JSON, EXTERNAL_COMPONENT_JSON } = process.env;

  if (!DESCENDANT_JSON || !MODULE_JSON || !EXTERNAL_COMPONENT_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const slug = params?.slug as string;
  const reactors = reactorData;
  const descendant = formatDescendantData(
    (await (await fetch(DESCENDANT_JSON)).json()).filter(
      ({ descendant_name }: DescendantAPIData) => slug === kebabCase(descendant_name),
    ),
  )[0];
  const filteredModules = ((await (await fetch(MODULE_JSON)).json()) as ModuleAPIData[]).filter(
    ({ module_class }) => module_class === 'Descendant',
  );
  const modules = formatModules(filteredModules);
  const typeSet = new Set<string>();
  filteredModules.forEach(({ module_type }) => {
    if (module_type && !descendantNames.includes(module_type) && module_type !== 'Sub-Attack') {
      typeSet.add(module_type);
    } else {
      typeSet.add('None');
    }
  });
  const { descendant_name, sort_name } = descendant;
  const moduleTypes = Array.from(typeSet);
  const filterMap = resetFilter(
    createFilterMap([...moduleTiers, ...moduleSockets, ...moduleTypes, descendant_name, sort_name]),
    true,
  ) as ModuleFilterMap;
  const typeOptions: FilterOptionsData = {
    label: 'Type',
    name: 'module-type',
    data: moduleTypes.map(value => ({ value })),
  };
  const components = sortComponentsByType(await (await fetch(EXTERNAL_COMPONENT_JSON)).json());

  const title = `${descendant.descendant_name} Builder | The First Descendant`;
  const description = 'Descendant Builder for The First Descendant (TFD).';

  return {
    props: {
      slug,
      reactors,
      components,
      modules: modules.Descendant,
      filterMap,
      descendant,
      typeOptions,
      seo: getTfdSeo({ title, description, slug: `/builds/descendants/${slug}/builder` }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default Builder;
