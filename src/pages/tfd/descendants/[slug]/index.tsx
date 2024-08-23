import type { DescendantAPIData, FormattedDescendantData } from '@/components/tfd/descendants/types';
import type { BlueprintDataMap, NormalDropType, Pattern } from '@/components/tfd/patterns/types';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import DescendantCard from '@/components/tfd/descendants/DescendantCard';
import SkillCard from '@/components/tfd/descendants/SkillCard';
import { normalMissionDrops } from '@/components/tfd/descendants/types';
import { formatDescendantData } from '@/components/tfd/descendants/utils';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import TFDLink from '@/components/tfd/header/Link';
import NormalMissionTable from '@/components/tfd/patterns/NormalMissionTable';
import PartsTable from '@/components/tfd/patterns/PartsTable';
import { hardPatterns, normalPatterns } from '@/components/tfd/patterns/types';
import { patternToBlueprintData } from '@/components/tfd/patterns/utils';
import { getTfdSeo, kebabCase } from '@/utils/utils';

interface DescendantProps {
  slug: string;
  seo: NextSeoProps;
  descendant: FormattedDescendantData;
  blueprintData?: BlueprintDataMap;
  normalMissionData?: NormalDropType;
}

const Descendant: FC<DescendantProps> = ({ slug, seo, descendant, blueprintData, normalMissionData }) => (
  <>
    <Header seo={seo} slug={[slug]} />
    <Container className="attributes tiers zones">
      <div className="flex flex-col rounded-xl border-2 border-black bg-neutral-800 shadow-lg shadow-black xl:flex-row">
        <div className="flex flex-col gap-4 p-4">
          <DescendantCard {...descendant} />
          <TFDLink path={`/builds/descendants/${slug}/builder`}>
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
        {normalMissionData && <NormalMissionTable data={normalMissionData} />}
        {blueprintData && <PartsTable data={blueprintData} />}
      </div>
    </Container>
    <Container>
      <div className="flex w-full flex-col items-center rounded-xl border-2 border-black bg-neutral-800 shadow-lg shadow-black">
        <span className="p-4 text-2xl font-bold md:p-2 lg:pt-4 lg:text-3xl">Abilities</span>
        <div className="skill-card-deck">
          {descendant.descendant_skill.map(skill => (
            <SkillCard key={skill.skill_name} {...skill} />
          ))}
        </div>
      </div>
    </Container>
    <Footer />
  </>
);

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
  if (!process.env.DESCENDANT_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const slug = params?.slug as string;
  const descendant = formatDescendantData(
    (await (await fetch(process.env.DESCENDANT_JSON)).json()).filter(
      ({ descendant_name }: DescendantAPIData) => slug === kebabCase(descendant_name),
    ),
  )[0];

  const name = descendant.descendant_name;
  const title = `${name} Data and Farm Locations | The First Descendant`;
  const description = `${name} is a ${descendant.attribute} descendant in The First Descendant (TFD). 
    Contains ${name}'s max stats at Lvl. 40 and skill/ability descriptions.
    Lists where to farm ${name} patterns/blueprints/parts.`;

  const normalMissionData = normalMissionDrops[name as keyof typeof normalMissionDrops] ?? null;
  const blueprintData = patternToBlueprintData(name, [...normalPatterns, ...hardPatterns] as Pattern[]);

  return {
    props: {
      slug,
      descendant,
      blueprintData,
      normalMissionData,
      seo: getTfdSeo({ title, description, slug: `/descendants/${slug}` }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default Descendant;
