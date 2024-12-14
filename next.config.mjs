/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  //   compiler: {
  //     removeConsole: true,
  //   },
  // Customize Webpack configuration
  // webpack: (config, { isServer }) => {
  //   // Example: Aliases
  //   // config.resolve.alias = {
  //   //   ...config.resolve.alias,
  //   //   '@components': path.resolve(__dirname, 'src/components'),
  //   // };
  //   config.module.rules.push({
  //     test: /pdf-lib/,
  //     type: 'javascript/auto',
  //   });
  //   return config;
  // },
  // experimental: {
  //   serverComponentsExternalPackages: ['@pdf-lib'],
  // },

  // swcMinify: true,
  // experimental: {
  //   optimizeServerReact: true,
  //   cpus: 15,
  //   optimisticClientCache: true,
  // },

  async redirects() {
    const isInMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === '1';

    if (isInMaintenanceMode) {
      return [
        {
          source: '/((?!maintenance).*)',
          destination: '/maintenance',
          permanent: false,
        },
        {
          source: '/(.*)',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://www.mondrey.dev/:path*',
          permanent: true,
        },
      ];
    }

    return [];
  },
  // pageExtensions: ['ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
  // runtime: 'edge',
  // unstable_allowDynamic: ['/node_modules/mongoose/dist/browser.umd.js'],
};

export default nextConfig;
