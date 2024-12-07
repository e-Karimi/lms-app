/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "unsplash.com", pathname: "/photos/**", port: "" },
      { protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**", port: "" },
      { protocol: "https", hostname: "img.clerk.com", pathname: "/**", port: "" },
      { protocol: "https", hostname: "utfs.io", pathname: "/**", port: "" },
    ],
  },
};

export default nextConfig;
