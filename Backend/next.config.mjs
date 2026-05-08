/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Avoid permission/EPERM issues on Windows when Next tries to write trace/build artifacts.
  // Use a dedicated folder that should be writable.
  distDir: ".next_backend",
};

export default nextConfig;
