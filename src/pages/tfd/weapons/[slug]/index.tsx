import Image from 'next/image';

import type { BlueprintDataMap, NormalDropType, Pattern } from '@/components/tfd/patterns/types';
import type { FormattedWeaponData, WeaponAPIData } from '@/components/tfd/weapon/types';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import TFDLink from '@/components/tfd/header/Link';
import NormalMissionTable from '@/components/tfd/patterns/NormalMissionTable';
import PartsTable from '@/components/tfd/patterns/PartsTable';
import { hardPatterns, normalPatterns } from '@/components/tfd/patterns/types';
import { patternToBlueprintData } from '@/components/tfd/patterns/utils';
import WeaponCard from '@/components/tfd/weapon/WeaponCard';
import { normalMissionDrops } from '@/components/tfd/weapon/types';
import { reformatWeaponData } from '@/components/tfd/weapon/utils';
import { getTfdSeo, kebabCase } from '@/utils/utils';

interface WeaponProps {
  slug: string;
  seo: NextSeoProps;
  weapon: FormattedWeaponData;
  blueprintData?: BlueprintDataMap;
  normalMissionData?: NormalDropType;
}

const Weapon: FC<WeaponProps> = ({ slug, seo, weapon, blueprintData, normalMissionData }) => {
  const { weapon_perk_ability_description, weapon_perk_ability_image_url, weapon_perk_ability_name } = weapon;

  return (
    <>
      <Header seo={seo} slug={[slug]} />
      <Container className="attributes zones tiers rounds">
        <div className="flex flex-col justify-center rounded-xl border-2 border-black bg-neutral-800 shadow-lg shadow-black xl:flex-row">
          <div className="flex flex-col gap-4 p-4 xl:max-w-sm">
            <WeaponCard {...weapon} allStats />
            <TFDLink path={`/builds/weapons/${slug}/builder`}>
              <Button>New Build</Button>
            </TFDLink>
            {blueprintData && (
              <p className="flex flex-col rounded-lg bg-neutral-700 p-2 text-center hover:bg-neutral-600">
                <span>Click Patterns for location details</span>
                <span className="label-ultimate">Gold Patterns are from Hard mode</span>
                <span className="label-ultimate">Patterns marked with * are stealth only</span>
                <span className="label-rare">Purple Patterns are from Normal mode</span>
              </p>
            )}
          </div>
          <div className="lg:max-w-4xl">
            {normalMissionData && <NormalMissionTable data={normalMissionData} partsList="weapon" />}
            {blueprintData && <PartsTable data={blueprintData} />}
            {weapon_perk_ability_name && (
              <div className="mb-2 mr-4 flex flex-col rounded-lg bg-neutral-700 p-2 hover:bg-neutral-600">
                <div className="my-1 flex flex-row items-center gap-2">
                  <div className="relative size-12">
                    {weapon_perk_ability_image_url && (
                      <Image
                        src={weapon_perk_ability_image_url}
                        fill
                        alt={weapon_perk_ability_name}
                        sizes="128px"
                        className="object-contain"
                      />
                    )}
                  </div>
                  <h3 className="label-ultimate text-2xl font-bold md:p-2 lg:pt-4 lg:text-3xl">
                    {weapon_perk_ability_name}
                  </h3>
                </div>
                <p className="text-wrap text-lg font-semibold lg:text-xl">{weapon_perk_ability_description}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticPaths = (async () => {
  if (!process.env.WEAPON_JSON) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const weapons = (await (await fetch(process.env.WEAPON_JSON)).json()) as WeaponAPIData[];
  const paths = weapons.map(({ weapon_name }) => ({
    params: {
      slug: kebabCase(weapon_name),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  if (!process.env.WEAPON_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const slug = params?.slug as string;

  const weapon = reformatWeaponData(
    (await (await fetch(process.env.WEAPON_JSON)).json()).filter(
      ({ weapon_name }: WeaponAPIData) => slug === kebabCase(weapon_name),
    ),
  )[0];

  const name = weapon.weapon_name;
  const title = `${name} Data and Farm Locations | The First Descendant`;
  const description = `${name} is a ${weapon.weapon_type} found in The First Descendant (TFD). 
    Contains ${name}'s max stats at Lvl. 100${weapon.weapon_perk_ability_name ? ' and unique perk' : ''}.
    Lists where to farm ${name} patterns/blueprints/parts.`;

  const normalMissionData = normalMissionDrops[name as keyof typeof normalMissionDrops] ?? null;
  const blueprintData = patternToBlueprintData(name, [...normalPatterns, ...hardPatterns] as Pattern[]);

  return {
    props: {
      slug,
      weapon,
      blueprintData,
      normalMissionData,
      seo: getTfdSeo({ title, description, slug: `/weapons/${slug}` }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default Weapon;
