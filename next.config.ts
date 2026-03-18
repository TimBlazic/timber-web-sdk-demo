import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["playwright"],
  transpilePackages: ["timber-feedback-sdk"],
};

export default nextConfig;
