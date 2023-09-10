/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true, // Transforms app export to /path/index.html path style
  /**
   * Patch webpack configuration
   * @param {import('webpack').Configuration} config Webpack configuration
   * @returns {import('webpack').Configuration} Webpack configuration
   */
  webpack: (config) => {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    // Provides svg import
    config.module.rules.push({
      test: /\.svg$/,
      use: { loader: "@svgr/webpack", options: { svgo: false } },
    });
    return config;
  },
};

module.exports = nextConfig;
