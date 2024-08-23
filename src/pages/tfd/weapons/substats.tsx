import type { GetStaticProps } from 'next';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import WeaponSubStats from '@/components/tfd/weapon/WeaponSubStats';
import { getTfdSeo } from '@/utils/utils';

interface SubStatsProps {
  seo: NextSeoProps;
}

const SubStats: FC<SubStatsProps> = ({ seo }) => (
  <>
    <Header seo={seo} />
    <Container className="attributes zones tiers rounds">
      <WeaponSubStats />
    </Container>
    <Footer />
  </>
);

export const getStaticProps = (async () => {
  const title = 'Weapon Sub Stats | The First Descendant';
  const description = `Tool for all weapon sub stats data in The First Descendant (TFD). 
    Lists all weapons and their max stats at Lvl. 100`;
  const slug = '/weapons/substats';

  return {
    props: {
      seo: getTfdSeo({ title, description, slug }),
    },
    revalidate: 86400,
  };
}) satisfies GetStaticProps;

export default SubStats;
