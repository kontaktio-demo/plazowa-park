import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920, 2400],
  },
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        // Long-lived cache for stable visual assets (orbit frames, renders,
        // unit views, maps) - they are generated once and rarely change.
        source: "/:folder(orbit|renders|unit-views|map|lifestyle|brand)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
