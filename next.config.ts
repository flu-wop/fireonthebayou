import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@flu-wop/design-system"],
  reactStrictMode: true,
  // Allow remote poster/thumbnail images if you later host assets off-domain.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
