module.exports = {
  env: {
    WEAPON_JSON: process.env.WEAPON_JSON,
    MODULE_JSON: process.env.MODULE_JSON,
    STAT_JSON: process.env.STAT_JSON,
    DESCENDANT_JSON: process.env.DESCENDANT_JSON,
    REACTOR_JSON: process.env.REACTOR_JSON,
    EXTERNAL_COMPONENT_JSON: process.env.EXTERNAL_COMPONENT_JSON,
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'open.api.nexon.com',
        port: '',
        pathname: '/static/tfd/**',
      },
    ]
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  staticPageGenerationTimeout: 600,
}
