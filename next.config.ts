import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/order_management", destination: "/counter", permanent: false },
      { source: "/order_management/:path*", destination: "/counter/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
