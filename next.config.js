/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      (() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cloth-backend-1gft.onrender.com/api';
        try {
          const url = new URL(apiUrl);
          return {
            protocol: url.protocol.replace(':', ''),
            hostname: url.hostname,
          };
        } catch (e) {
          return {
            protocol: 'https',
            hostname: 'cloth-backend-1gft.onrender.com',
          };
        }
      })(),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|frag|vert)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });
    return config;
  },
};

module.exports = nextConfig;