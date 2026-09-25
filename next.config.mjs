/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the whole site is plain HTML/CSS/JS files in /out.
  // No server, no database, nothing that could store visitor information.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
