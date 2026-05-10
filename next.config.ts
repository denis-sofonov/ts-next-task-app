import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle so the Docker image can run the app
  // without shipping the full node_modules tree.
  output: "standalone",
  // Native / driver packages that must not be bundled into the server output.
  serverExternalPackages: ["@node-rs/argon2", "postgres"],
};

export default nextConfig;
