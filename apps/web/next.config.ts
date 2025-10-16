import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@jn74998dv4gxe0f64an4cn8kqs7skcfq/design-tokens",
    "@jn74998dv4gxe0f64an4cn8kqs7skcfq/components"
  ],
  reactStrictMode: true,
};

export default nextConfig;
