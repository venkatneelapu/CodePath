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
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Proxy to Backend Next.js API server
      },
    ]
  },
};

export default nextConfig;
