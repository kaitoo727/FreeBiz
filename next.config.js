/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },
  // OpenAIパッケージをサーバーサイドのみに制限
  serverComponentsExternalPackages: ['openai'],
  // webpack設定でOpenAIをクライアントバンドルから除外
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      // OpenAIをクライアントバンドルから除外
      config.externals = config.externals || [];
      config.externals.push('openai');
    }
    return config;
  },
}

module.exports = nextConfig

