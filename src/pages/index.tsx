import Link from 'next/link';
import { NextSeo } from 'next-seo';

import type { FC } from 'react';

import Container from '@/components/container/Container';
import Socials from '@/components/socials/Socials';
import { root } from '@/utils/paths';

const Index: FC = () => (
  <>
    <NextSeo
      title="ortillo.cam"
      description="Personal site for Cam Ortillo"
      openGraph={{
        url: 'https://ortillo.cam',
        title: 'ortillo.cam',
        description: 'Personal site for Cam Ortillo',
        images: [{ url: 'https://ortillo.cam/logo-512x512.png' }],
      }}
    />
    <Container className="m-0 flex size-full max-w-full flex-col items-center justify-center self-center bg-neutral-800 align-middle">
      <h1 className="text-9xl font-normal text-blue-400">cam</h1>
      <Socials />
      <div className="flex flex-row">
        {root.map(({ path }) => (
          <Link
            key={path}
            href={path}
            className="tfd-link text-link text-hover input-hover bg-hover border-2 border-white bg-neutral-900 shadow-md shadow-black"
          >
            {path}
          </Link>
        ))}
      </div>
    </Container>
  </>
);

export default Index;
