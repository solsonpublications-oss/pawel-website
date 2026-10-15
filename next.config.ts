import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.space-z.ai",
    "preview-chat-*.space-z.ai",
    "chat.z.ai",
  ],
};

export default nextConfig;
