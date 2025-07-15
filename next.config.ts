import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora erros de lint durante o build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
