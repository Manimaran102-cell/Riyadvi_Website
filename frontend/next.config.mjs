/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['three'],
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: {
    // Tree-shake big barrel packages so route bundles only ship what they use
    optimizePackageImports: ['motion', '@react-three/drei'],
  },
  async headers() {
    return [
      { source: '/downloads/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }] },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};
export default nextConfig;
