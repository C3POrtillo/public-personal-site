import type { FormattedReactorData, ReactorArchesType, ReactorAttributesType } from '@/components/tfd/reactor/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Carousel from '@/components/carousel/Carousel';
import Container from '@/components/container/Container';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import ReactorCard from '@/components/tfd/reactor/ReactorCard';
import ReactorLabel from '@/components/tfd/reactor/ReactorLabel';
import { reactorData } from '@/components/tfd/reactor/reactors';
import { reactorArches, reactorAttributes, reactorStats, unusedCombinations } from '@/components/tfd/reactor/types';
import { formatStat, getSortedReactors } from '@/components/tfd/reactor/utils';
import { getTfdSeo } from '@/utils/utils';

interface ReactorsProps {
  seo: NextSeoProps;
  reactors: FormattedReactorData[];
  date: string;
}

const Reactors: FC<ReactorsProps> = ({ reactors, seo, date }) => {
  const reactorAttackStats = {
    'Skill Power': reactors[0].skill_atk_power,
    'Sub-Attack Power': reactors[0].sub_skill_atk_power,
  };
  const reactorCards = reactors.map(reactor => (
    <div key={reactor.attribute} className="md:max-w-56 xl:min-w-56">
      <ReactorCard {...reactor} />
    </div>
  ));

  const reactorCombos = Object.keys(reactorAttributes).flatMap(attribute =>
    Object.keys(reactorArches).map(arche => {
      const name = [attribute, arche].join('\n');
      const borderClass = `overflow-hidden border-2 rounded-lg shadow-md shadow-black ${
        unusedCombinations.includes(name) ? 'border-red-400' : 'border-black'
      }`;

      return (
        <ReactorLabel
          key={`${attribute}-${arche}`}
          attribute={attribute as ReactorAttributesType}
          arche={arche as ReactorArchesType}
          name={name}
          wrapperClass={borderClass}
        />
      );
    }),
  );

  const attackStats = Object.entries(reactorAttackStats).map(([label, stat]) => (
    <div className="flex flex-col justify-center py-2" key={label}>
      <div>{label}</div>
      <div className="text-4xl">{stat}</div>
    </div>
  ));

  const optimization = (
    <div
      className="flex flex-col items-center justify-center bg-neutral-800 py-2 text-center text-xl"
      key="optimization"
    >
      <div className="">{'Optimization Skill Power Multiplier'}</div>
      <div className="flex flex-col">
        <div className="label-rare">Rare: {reactorStats.rare}</div>
        <div className="label-ultimate">Ultimate: {reactorStats.ultimate}</div>
      </div>
    </div>
  );

  const stats = Object.entries(reactorStats.subStats).map(([label, { min, max }]) => (
    <div
      key={label}
      className="flex h-min max-w-full flex-col items-center justify-center rounded-xl border-2 border-black bg-neutral-800 px-5 py-2 text-center shadow-md shadow-black sm:whitespace-pre-wrap"
    >
      {formatStat(label)}
      <span>
        <span className="label-standard">{min}</span>
        {' to '}
        <span className="label-ultimate">{max}</span>
      </span>
    </div>
  ));

  return (
    <>
      <Header seo={seo} />
      <Container className="attributes tiers">
        <fieldset className="flex flex-col justify-center overflow-hidden rounded-xl border-2 border-black bg-neutral-900 shadow-lg shadow-black xl:w-1/2">
          <legend className="px-2 text-center sm:px-4">
            <h2 className="text-3xl md:text-4xl">Reactor Stats</h2>
          </legend>
          <div className="self-center p-4 xl:min-w-full">
            {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
            <div className="hidden justify-center gap-4 xl:flex xl:min-w-[780px] xl:flex-row xl:flex-nowrap">
              {reactorCards}
            </div>
            <Carousel slides={reactorCards} className="xl:hidden" width="max-w-[85vw] sm:max-w-[50vw]" />
          </div>
          <div className="border-y-2 border-black bg-neutral-800 text-center text-xl">
            <div className="hidden grid-cols-3 md:grid">{[attackStats[0], optimization, attackStats[1]]}</div>
            <div className="flex flex-col items-center md:hidden">
              <div className="flex w-full flex-row justify-around">{attackStats}</div>
              {optimization}
            </div>
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 bg-neutral-700 p-4 text-xl shadow-inner shadow-black">
            {stats}
          </div>
        </fieldset>
      </Container>
      <Container className="attributes tiers ">
        <fieldset className="flex w-full flex-col justify-center gap-4 rounded-xl border-2 border-black bg-neutral-900 p-4 text-center shadow-lg shadow-black sm:w-auto">
          <legend className="px-2 sm:px-4">
            <h2 className="text-3xl md:text-4xl">Reactor Types</h2>
          </legend>
          <div className="flex flex-col text-xl">
            <p>
              As of <span className="text-yellow-200">{date}</span>
            </p>
            <p>
              No Descendant benefits from reactors marked in <span className="text-red-400">red</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 text-lg sm:text-xl md:grid-cols-2 lg:grid-cols-4">{reactorCombos}</div>
        </fieldset>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = (async () => {
  if (!process.env.REACTOR_JSON) {
    return {
      props: {
        error: true,
      },
    };
  }

  const reactors = getSortedReactors(reactorData);

  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  const title = 'Reactors | The First Descendant';
  const description = `Tool for Reactor data in The First Descendant (TFD).
  Contains stats for a Reactor at level 100. 
  Lists possible sub stats and all combinations of Reactors.`;
  const slug = '/reactors';

  return {
    props: {
      reactors,
      date: `${month}/${day}/${year}`,
      seo: getTfdSeo({ title, description, slug }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default Reactors;
