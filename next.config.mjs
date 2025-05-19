/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/iiif-timeline",
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
