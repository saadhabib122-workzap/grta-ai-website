import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // 90 for illustrations: clay textures band and block at the default 75
    qualities: [75, 90],
  },
  async redirects() {
    // Old static URLs keep working after the move to the new site
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/privacy-policy.html', destination: '/legal#privacy', permanent: true },
      { source: '/terms-of-service.html', destination: '/legal#terms', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
