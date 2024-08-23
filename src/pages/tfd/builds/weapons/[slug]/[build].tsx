import Error from 'next/error';
import { useEffect, useState } from 'react';

import type { FilterOptionsData } from '@/components/inputs/types';
import type { BuildData, ImportBuildData } from '@/components/tfd/builds/types';
import type { ModuleAPIData, ModuleFilterMap, TierTypeData } from '@/components/tfd/module/types';
import type { FormattedWeaponData, WeaponAPIData } from '@/components/tfd/weapon/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import { useAuth } from '@/components/tfd/accounts/AuthProvider';
import { BuildProvider } from '@/components/tfd/builds/BuildProvider';
import { importBuilds, resetFilter } from '@/components/tfd/builds/utils';
import WeaponBuild from '@/components/tfd/builds/weapons/WeaponBuild';
import WeaponBuilder from '@/components/tfd/builds/weapons/WeaponBuilder';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import { allHighPowerIds, highPowerIds, moduleSockets, moduleTiers } from '@/components/tfd/module/types';
import { formatModules } from '@/components/tfd/module/utils';
import { reformatWeaponData } from '@/components/tfd/weapon/utils';
import { createFilterMap, getTfdSeo, kebabCase } from '@/utils/utils';

interface BuildProps {
  slug: string;
  seo: NextSeoProps;
  modules: TierTypeData;
  filterMap: ModuleFilterMap;
  weapon: FormattedWeaponData;
  typeOptions: FilterOptionsData;
  build: BuildData | null;
}

const Build: FC<BuildProps> = ({ slug, seo, build, ...props }) => {
  const { isAuthenticated } = useAuth();
  const [isEdit, setEdit] = useState(false);
  const isAuthor = isAuthenticated?.id === build?.user_id;

  useEffect(() => {
    if (!isAuthenticated) {
      setEdit(false);
    }
  }, [isAuthenticated]);

  if (!props.weapon) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Header seo={seo} slug={[slug]} />
      {build && (
        <>
          {isAuthor && (
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
          )}
          <BuildProvider {...build}>
            {isEdit ? <WeaponBuilder {...props} /> : <WeaponBuild weapon={props.weapon} />}
          </BuildProvider>
        </>
      )}
      <Footer />
    </>
  );
};

export const getStaticPaths = (async () => {
  if (!process.env.WEAPON_JSON) {
    return {
      paths: [],
      fallback: true,
    };
  }

  const weapons = (await (await fetch(process.env.WEAPON_JSON)).json()) as WeaponAPIData[];
  const paths = await Promise.all(
    weapons.map(async ({ weapon_name }) => {
      const builds = ((await importBuilds({ buildFor: weapon_name })) as ImportBuildData)?.weapon || null;
      if (!builds) {
        return [];
      }

      return builds.map(({ id, title }) => ({
        params: {
          slug: kebabCase(weapon_name),
          build: `${id}-${kebabCase(title)}`,
        },
      }));
    }),
  );

  return {
    paths: paths.flat(),
    fallback: true,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const { WEAPON_JSON, MODULE_JSON } = process.env;

  if (!WEAPON_JSON || !MODULE_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const slug = params?.slug as string;
  const slug2 = params?.build as string;
  const id = slug2.split('-')[0] as string;
  const weapon = reformatWeaponData(
    (await (await fetch(WEAPON_JSON)).json()).filter(
      ({ weapon_name }: WeaponAPIData) => slug === kebabCase(weapon_name),
    ),
  )[0];
  const filteredModules = ((await (await fetch(MODULE_JSON)).json()) as ModuleAPIData[]).filter(
    ({ module_class, module_id }) => {
      const { weapon_rounds_type, weapon_type } = weapon;
      const validClass = module_class === weapon_rounds_type;
      const isHighPower = allHighPowerIds.includes(module_id);
      const validId = !isHighPower || highPowerIds[weapon_type]?.includes(module_id);

      return validClass && validId;
    },
  );
  const modules = formatModules(filteredModules);
  const typeSet = new Set<string>();
  filteredModules.forEach(({ module_type }) => {
    if (module_type) {
      typeSet.add(module_type);
    } else {
      typeSet.add('None');
    }
  });
  const moduleTypes = Array.from(typeSet);
  const filterMap = resetFilter(
    createFilterMap([...moduleTiers, ...moduleSockets, ...moduleTypes]),
    true,
  ) as ModuleFilterMap;
  const typeOptions: FilterOptionsData = {
    label: 'Type',
    name: 'module-type',
    data: moduleTypes.map(value => ({ value })),
  };
  const build = (await importBuilds({ id }))?.weapon[0] || null;

  const title = `${build.title || `Build for ${weapon.weapon_name}`} | The First Descendant`;
  const description = `Build for ${weapon.weapon_name} by ${build.username || '/tfd'}`;

  return {
    props: {
      slug,
      modules: modules[weapon.weapon_rounds_type],
      filterMap,
      weapon,
      typeOptions,
      build,
      seo: getTfdSeo({
        title,
        description,
        slug: `/builds/weapons/${slug}/${slug2}`,
        canonical: `/builds/weapons/${slug}`,
      }),
    },
    revalidate: 600,
  };
}) satisfies GetStaticProps;

export default Build;
