import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["decimal.js", "zod"],
  },
};

export default nextConfig;
