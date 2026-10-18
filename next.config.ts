import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: { formats: ["image/avif", "image/webp"] },
  async headers() { return [{ source: "/api/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] }]; }
};
export default nextConfig;
