import type { ModuleTiersType } from '@/components/tfd/module/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import ModuleCosts from '@/components/tfd/module/ModuleCosts';
import { kuiperCosts } from '@/components/tfd/module/types';
import { getTfdSeo } from '@/utils/utils';

interface IndexProps {
  seo: NextSeoProps;
}

const Index: FC<IndexProps> = ({ seo }) => {
  const moduleCosts = [
    Object.entries(kuiperCosts).map(([label, costs]) => (
      <ModuleCosts key={label} label={label as ModuleTiersType} kuiperPerLevel={costs} />
    )),
  ];

  return (
    <>
      <Header seo={seo} />
      <Container className="rounds tiers">
        <div className="grid grid-cols-1 justify-center gap-3 lg:grid-cols-2 2xl:grid-cols-4">{moduleCosts}</div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = (async () => {
  const title = 'Module Costs | The First Descendant';
  const description = `Tool for module costs in The First Descendant (TFD). 
    Lists all module tiers, their kuiper/gold cost per level and total kuiper/gold cost per level`;
  const slug = '/modules/costs';

  return {
    props: {
      seo: getTfdSeo({ title, description, slug }),
    },
  };
}) satisfies GetStaticProps;

export default Index;
