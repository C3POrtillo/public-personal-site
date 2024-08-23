import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import BasicMaterials from '@/components/tfd/consumables/BasicMaterials';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import { getTfdSeo } from '@/utils/utils';

interface EhpCalcProps {
  seo: NextSeoProps;
}

const EhpCalc: FC<EhpCalcProps> = ({ seo }) => (
  <>
    <Header seo={seo} />
    <Container className="zones tiers">
      <BasicMaterials />
    </Container>
    <Footer />
  </>
);

export const getStaticProps = (async () => {
  const title = 'Basic Materials | The First Descendant';
  const description = 'Basic material locations and where to farm them in The First Descendant.';
  const slug = '/basic-materials';

  return {
    props: {
      seo: getTfdSeo({ title, description, slug }),
    },
  };
}) satisfies GetStaticProps;

export default EhpCalc;
