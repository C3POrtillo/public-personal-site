import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import ModuleCombinationTable from '@/components/tfd/module/ModuleCombinationTable';
import { getTfdSeo } from '@/utils/utils';

interface IndexProps {
  seo: NextSeoProps;
}

const Index: FC<IndexProps> = ({ seo }) => (
  <>
    <Header seo={seo} />
    <Container>
      <ModuleCombinationTable />
    </Container>
    <Footer />
  </>
);

export const getStaticProps = (async () => {
  const title = 'Module Combinations | The First Descendant';
  const description = `Tool for module combos in The First Descendant (TFD). 
    Lists all combinations of rarities and the probability of their results`;
  const slug = '/modules/combinations';

  return {
    props: {
      seo: getTfdSeo({ title, description, slug }),
    },
  };
}) satisfies GetStaticProps;

export default Index;
