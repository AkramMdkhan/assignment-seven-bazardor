import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/signin",
        destination: "/sign-in",
        permanent: false,
      },
      {
        source: "/signup",
        destination: "/sign-up",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;