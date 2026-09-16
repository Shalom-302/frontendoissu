import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // `standalone` bundles the server and only the traced dependencies, which is
  // what the production Dockerfile copies. Without it the runtime image would
  // have to ship the whole node_modules tree.
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    // Lint is a CI job, not a build blocker: a failing rule should not stop a
    // deploy of code that type-checks and compiles.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
