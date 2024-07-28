/** @type {import('next').NextConfig} */
const nextConfig = {
  //   compiler: {
  //     removeConsole: true,
  //   },
  runtime: 'edge',
  unstable_allowDynamic: ['/node_modules/mongoose/dist/browser.umd.js'],
};

export default nextConfig;
