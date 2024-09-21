/** @type {import('next').NextConfig} */
const nextConfig = {
  //   compiler: {
  //     removeConsole: true,
  //   },
  async redirects() {
    const isInMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === '1';

    if (isInMaintenanceMode) {
      return [
        {
          source: '/images/:path*', // Allow access to all images
          destination: '/images/:path*', // No redirection
          permanent: false,
        },
        {
          source: '/(?!maintenance|images).*', // Redirect everything except maintenance and images
          destination: '/maintenance',
          permanent: false,
        },
      ];
    }

    return [];
  },
  publicRuntimeConfig: {
    isInMaintenanceMode: true, // Your custom flag
  },
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
