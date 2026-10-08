import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jnnzntvnubklkumugnaz.supabase.co",
      },
    ],
  },
};

export default nextConfig;

