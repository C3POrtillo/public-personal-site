import Link from 'next/link';

const parseUrl = (href: string) => {
  if (!href) {
    return {
      component: 'button',
      href: '',
    } as const;
  }

  const domain = 'ortillo.cam';

  let url: URL;
  try {
    url = new URL(href);
  } catch (error) {
    throw new Error(`Invalid URL: ${href}`);
  }
  const isInternal = url.hostname === `www.${domain}` || url.hostname === domain;

  return {
    component: isInternal ? Link : 'a',
    rel: isInternal ? '' : 'noreferrer noopener',
    target: isInternal ? '' : '_blank',
    href: isInternal ? url.href.split(url.host)[1] : href,
  } as const;
};

export default parseUrl;
