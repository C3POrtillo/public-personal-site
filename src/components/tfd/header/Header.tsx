import { NextSeo } from 'next-seo';

import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Accordion from '@/components/accordion/Accordion';
import Dropdown from '@/components/dropdown/Dropdown';
import Button from '@/components/inputs/Button/Button';
import { useAuth } from '@/components/tfd/accounts/AuthProvider';
import Login from '@/components/tfd/accounts/Login';
import Register from '@/components/tfd/accounts/Register';
import Breadcrumbs from '@/components/tfd/header/Breadcrumbs';
import TFDLink from '@/components/tfd/header/Link';
import { tfd } from '@/utils/paths';
import useLgScreen from '@/utils/useLgScreen';

interface HeaderProps {
  slug?: string[];
  seo?: NextSeoProps;
}

const Header: FC<HeaderProps> = ({ slug, seo }) => {
  const isLgScreen = useLgScreen();
  const { isAuthenticated, logout } = useAuth();

  const navLinks = tfd.slice(1).map(data => {
    const className = 'bg-hover tfd-link text-link text-hover';
    if (data.options && data.label?.length) {
      const { label, options } = data;

      const links = options.map(nestedData => <TFDLink className={className} key={nestedData.path} {...nestedData} />);

      return (
        <Dropdown key={label} label={label}>
          <div className="flex flex-col text-center">{links}</div>
        </Dropdown>
      );
    }

    return <TFDLink className={className} key={data.path} {...data} />;
  });

  const accounts = (
    <div className="flex w-full max-w-44 grow flex-row items-center justify-end gap-2">
      {isAuthenticated ? (
        <>
          <h3 className="w-full overflow-hidden text-ellipsis text-right text-xl">{isAuthenticated.username}</h3>
          <div>
            <Button onClick={logout} size="button-sm">
              Logout
            </Button>
          </div>
        </>
      ) : (
        <>
          <Register />
          <Login />
        </>
      )}
    </div>
  );

  const homeLink = (
    <TFDLink key="home" className="home-link text-nowrap lg:p-0" path={tfd[0].path}>
      <h1 className="text-2xl font-semibold lg:text-4xl">{tfd[0].label}</h1>
    </TFDLink>
  );

  return (
    <>
      <NextSeo {...seo} />
      <header className="sticky-header relative flex flex-col place-items-center justify-center bg-neutral-900 text-center shadow-md shadow-black lg:py-3">
        {isLgScreen ? (
          <div className="mx-auto flex min-h-6 w-full max-w-7xl flex-row items-center justify-between gap-4 px-4">
            <div className="flex w-full max-w-44 grow justify-start">
              <div>{homeLink}</div>
            </div>
            <div className="flex flex-row gap-1">{navLinks}</div>
            {accounts}
          </div>
        ) : (
          <div className="flex min-h-8 w-full flex-row">
            <Accordion
              label={
                <div className="flex w-full items-center justify-between p-4">
                  <div>{homeLink}</div>
                  {accounts}
                </div>
              }
              icon="fa-bars"
            >
              <div className="flex flex-col gap-3 text-left">{navLinks}</div>
            </Accordion>
          </div>
        )}
      </header>
      <Breadcrumbs slug={slug} />
    </>
  );
};

export default Header;
