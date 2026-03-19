import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium"],
  transpilePackages: ["timber-feedback-sdk"],
};

export default nextConfig;
