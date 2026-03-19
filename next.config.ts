import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium-min"],
  transpilePackages: ["timber-feedback-sdk"],
};

export default nextConfig;
