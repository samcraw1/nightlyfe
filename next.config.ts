import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * Tenant selection. Each deploy serves exactly one club from src/clubs/<slug>.
 * Only that folder is aliased in as `@club`, so other tenants' config and
 * content are never compiled into this build.
 */
const club = process.env.NEXT_PUBLIC_CLUB || "onyx";
const clubDir = path.resolve(__dirname, "src/clubs", club);
if (!/^[a-z0-9-]+$/.test(club) || !fs.existsSync(path.join(clubDir, "index.ts"))) {
  throw new Error(`NEXT_PUBLIC_CLUB="${club}" does not match a folder in src/clubs/`);
}

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_CLUB: club },
  // Keep Turbopack from picking up lockfiles above the repo (home directory).
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: { "@club": `./src/clubs/${club}/index.ts` },
  },
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, "@club": path.join(clubDir, "index.ts") };
    return config;
  },
};

export default nextConfig;
