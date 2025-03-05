const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: "en",
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_KEY: process.env.NEXT_PUBLIC_STRAPI_API_KEY,
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  },
};