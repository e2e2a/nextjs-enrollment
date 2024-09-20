/** @type {import('next').NextConfig} */
const nextConfig = {
  //   compiler: {
  //     removeConsole: true,
  //   },
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
