/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/uforetrygd/selvbetjening',
  // Nødvendig for at Nais APM skal kunne deobfuskere stack traces server-side.
  productionBrowserSourceMaps: true,
}

export default nextConfig
