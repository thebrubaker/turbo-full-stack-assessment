const path = require("path")

module.exports = {
  reactStrictMode: true,
  // transpilePackages: ["@project/..."],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
}
