import { Inconsolata } from 'next/font/google';
import '@/styles/globals.css';
import Script from 'next/script';

import type { AppProps } from 'next/app';

import { AuthProvider } from '@/components/tfd/accounts/AuthProvider';

const inconsolata = Inconsolata({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inconsolata',
});

const MyApp = ({ Component, pageProps }: AppProps) => (
  <AuthProvider>
    <main className={`${inconsolata.variable} flex grow flex-col justify-between gap-4 font-sans`}>
      <Component {...pageProps} />
    </main>
    <Script src="https://kit.fontawesome.com/8a3bf2a858.js" crossOrigin="anonymous" />
  </AuthProvider>
);

export default MyApp;
