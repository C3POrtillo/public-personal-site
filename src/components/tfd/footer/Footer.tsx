import Link from 'next/link';

import type { FC } from 'react';

import Container from '@/components/container/Container';
import TFDLink from '@/components/tfd/header/Link';
import parseUrl from '@/utils/parseUrl';
import { supportEmail } from '@/utils/paths';

const Footer: FC = () => (
  <>
    <Container className="flex grow flex-col" />
    <footer className="flex flex-col place-items-center content-center justify-center gap-2 bg-neutral-900 px-1 py-8 text-center lg:p-8">
      <div className="flex flex-row gap-4">
        <div className="px-4">
          <div className="social flex flex-row place-items-center justify-center gap-1 text-sm md:text-lg">
            <span>Developed by: </span>
            {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
            <i className="fab fa-discord tfd-link-icon" />
            <span>cam_ilo</span>
            <span>|</span>
            <TFDLink path="/privacy-policy" className="input-hover bg-hover text-hover rounded-md px-2">
              Privacy Policy
            </TFDLink>
            <span>|</span>
            <Link className="input-hover bg-hover text-hover rounded-md px-2" {...parseUrl(supportEmail.path)}>
              {supportEmail.label}
            </Link>
          </div>
        </div>
      </div>
      <p className="text-sm md:text-base">
        ortillo.cam is not endorsed or affiliated with NEXON GamesCo., Ltd., NEXON Korea Corp, or any of its
        subsidaries/affiliates
      </p>
    </footer>
  </>
);

export default Footer;
