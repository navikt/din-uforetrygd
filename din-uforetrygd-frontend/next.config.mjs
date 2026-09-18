/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/uforetrygd/selvbetjening',
  // Nødvendig for at Nais APM skal kunne deobfuskere stack trace, se https://docs.nais.io/observability/frontend/how-to/sourcemaps/
  productionBrowserSourceMaps: true,
}

export default nextConfig
