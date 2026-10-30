import path from "path";
import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  outputFileTracingRoot: path.join(
    path.dirname(fileURLToPath(import.meta.url)),
  ),
  async rewrites() {
    // If an external backend is explicitly provided, rewrite to it; otherwise serve native API routes
    if (process.env.BACKEND_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_URL}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
