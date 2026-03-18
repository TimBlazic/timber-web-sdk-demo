import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["playwright"],
  transpilePackages: ["calda-feedback-sdk"],
};

export default nextConfig;
