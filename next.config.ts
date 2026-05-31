import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.payrollsynergyexperts.com" }],
        destination: "https://payrollsynergyexperts.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
