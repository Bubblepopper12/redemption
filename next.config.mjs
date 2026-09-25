// The site's public address, printed on the Help Sheet and the flyer's QR code.
// Set NEXT_PUBLIC_SITE_URL yourself (see README), or it uses the production
// address that Vercel or Netlify provide while building. If none is known,
// the pages use the address they were opened from.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  (process.env.NETLIFY && process.env.URL) ||
  "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the whole site is plain HTML/CSS/JS files in /out.
  // No server, no database, nothing that could store visitor information.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
};

export default nextConfig;
