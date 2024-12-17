/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  },
}

module.exports = nextConfig

