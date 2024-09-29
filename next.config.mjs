/** @type {import('next').NextConfig} */
const nextConfig = {
  //   compiler: {
  //     removeConsole: true,
  //   },
  // Customize Webpack configuration
  // webpack: (config, { isServer }) => {
  //   // Example: Aliases
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     '@components': path.resolve(__dirname, 'src/components'),
  //   };

  //   // Important: return the modified config
  //   return config;
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
