/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "utfs.io", pathname: "/**", port: "" }],
  },
};

export default nextConfig;
