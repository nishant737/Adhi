import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the local Wi-Fi (e.g. http://192.168.1.12:3000) load the dev server's scripts
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
