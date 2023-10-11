/** @type {import('next').NextConfig} */

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/sandbox-alt",
        permanent: true,
      },
    ];
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    deviceSizes: [640, 1080, 1440, 1920],
    imageSizes: [80, 160, 160, 320],
  },
};
