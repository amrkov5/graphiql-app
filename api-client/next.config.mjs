import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: '/GET',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0', 
        },
      ],
    },
  ],
  experimental: {
    urlImports: ['https://unpkg.com/'],
  },
};

export default withNextIntl(nextConfig);
