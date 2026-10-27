import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Keep Turbopack from picking up lockfiles above the repo (home directory).
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
