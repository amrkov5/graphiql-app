import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      // Маршрут, для которого нужно отключить кэширование
      source: '/GET', // Или другой маршрут, например, '/:path*' для всех маршрутов
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0', // Запрещаем кэширование
        },
      ],
    },
  ],
  experimental: {
    urlImports: ['https://unpkg.com/'],
  },
};

export default withNextIntl(nextConfig);
