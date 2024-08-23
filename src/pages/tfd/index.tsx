import Link from 'next/link';

import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import LinkCard from '@/components/card/LinkCard';
import Container from '@/components/container/Container';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import parseUrl from '@/utils/parseUrl';
import { paths, supportEmail } from '@/utils/paths';
import { getTfdSeo, kebabCase } from '@/utils/utils';

interface IndexProps {
  seo: NextSeoProps;
}

const Index: FC<IndexProps> = ({ seo }) => (
  <>
    <Header seo={seo} />
    <Container>
      <div className="flex flex-col justify-center text-center">
        <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
          <div className="flex w-full flex-col items-center rounded-xl border-2 border-black bg-neutral-900 p-2 shadow-lg shadow-black md:col-span-2">
            <div className="flex flex-col text-wrap rounded-lg border-2 border-black bg-neutral-600 p-2 text-left shadow-inner shadow-black md:max-w-3xl md:text-2xl">
              <h2 className="text-center text-4xl text-yellow-200">Welcome to /tfd!</h2>
              <hr className="my-2" />
              <p className="text-lg xl:text-xl">
                This website is an All-in-One resource for everything you need regarding The First Descendant!
              </p>
              <div className="social text-lg xl:text-xl">
                <span className="">{'Feel free to contact me regarding any issues or suggestions:'}</span>
                <div className="flex flex-row items-center gap-1 px-1">
                  {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                  <i className="fab fa-discord tfd-link-icon w-10 text-center" />
                  {'cam_ilo.'}
                </div>
                <div className="w-min">
                  <Link
                    className="input-hover bg-hover text-hover flex flex-row items-center gap-1 rounded-md px-1"
                    {...parseUrl(supportEmail.path)}
                  >
                    {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                    <i className="fa fa-envelope tfd-link-icon w-10 text-center" />
                    {'support@ortillo.cam'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-52 w-full md:h-96 lg:size-96">
            <LinkCard label="All Builds" path={paths['All Builds'].path} src="/assets/images/homepage/build.png" />
          </div>
          <div className="grid h-96 grid-cols-2 gap-4">
            {(['Wishlist', 'Descendants', 'Void Shards', 'Weapons'] as const).map(label => (
              <LinkCard
                key={label}
                label={label}
                path={paths[label].path}
                src={`/assets/images/homepage/${kebabCase(label)}.png`}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
    <Footer />
  </>
);

export const getStaticProps = (async () => {
  const title = 'Tools for The First Descendant | /tfd';
  const description = `Assistant/Tools/Helper site for The First Descendant (TFD). 
    Features: Descendant/Weapon Builder. Pattern Wishlists, Void Shard/Void Fragment Data, Weapon DPS Data, 
    Effective Health Points (EHP) Calculator, External Component Data, Descendant Data.`;

  return {
    props: {
      seo: getTfdSeo({ title, description }),
    },
  };
}) satisfies GetStaticProps;

export default Index;
