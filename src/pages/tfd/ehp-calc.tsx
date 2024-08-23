import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Calculator from '@/components/tfd/ehp-calc/Calculator';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import { getTfdSeo } from '@/utils/utils';

interface EhpCalcProps {
  seo: NextSeoProps;
}

const EhpCalc: FC<EhpCalcProps> = ({ seo }) => (
  <>
    <Header seo={seo} />
    <Container>
      <fieldset className="flex flex-row gap-4 rounded-xl border-2 border-black bg-neutral-900 p-4 text-3xl shadow-xl shadow-black">
        <legend className="mx-auto p-4 text-center text-3xl md:text-4xl">
          <h2>Effective HP Comparison</h2>
        </legend>
        <Calculator />
        <Calculator />
      </fieldset>
    </Container>
    <Footer />
  </>
);

export const getStaticProps = (async () => {
  const title = 'EHP Calculator | The First Descendant';
  const description = 'Tool for calculating effective health points (ehp) in The First Descendant (TFD)';
  const slug = '/ehp-calc';

  return {
    props: {
      seo: getTfdSeo({ title, description, slug }),
    },
  };
}) satisfies GetStaticProps;

export default EhpCalc;
