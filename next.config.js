/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify')
      }
    }

    // 更全面的 core-js 处理
    config.resolve.alias = {
      ...config.resolve.alias,
      'core-js/modules/es.symbol.js': false,
      'core-js/modules/es.symbol.description.js': false,
      'core-js/modules/es.symbol.iterator.js': false,
      'core-js/modules/es.symbol.async-iterator.js': false,
      'core-js/modules/es.promise.js': false,
      'core-js/modules/es.array.iterator.js': false
    }

    // 添加 BigInt 处理
    config.resolve.fallback = {
      ...config.resolve.fallback,
      bigint: false
    }

    return config
  }
}

module.exports = nextConfig
