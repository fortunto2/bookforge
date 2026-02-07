import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer needs webpack config for browser PDF generation
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
