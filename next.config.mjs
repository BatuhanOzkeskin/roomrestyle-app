/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Allow larger image uploads to Server Actions / route handlers.
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
