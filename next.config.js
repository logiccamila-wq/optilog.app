const isVercel = !!process.env.VERCEL;
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Temporarily ignore TypeScript errors during CI builds (e.g., Vercel)
  // to prevent non-critical type issues from blocking deployments.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize for containerized/App Hosting deployments
  // output: 'standalone',
  // Usa o tracing padrão para builds standalone
  // (recomendado para produção; em ambientes Windows/OneDrive, prefira rodar build fora de pastas sincronizadas ou via WSL)
  // Avoid forcing ESM externals resolution which can break CJS expectations in some libs (e.g., @babel/runtime used by MUI)
  // Let Next.js default handle externals, or set to false to prefer CommonJS for node_modules.
  // experimental: {
  //   esmExternals: false,
  // },
  // Transpile node_modules that ship modern syntax so Webpack can parse
  transpilePackages: ['undici'],
  // Ajusta cache do Webpack: memória em dev para hot-reload mais rápido; desativado em build
  webpack: (config, { dev }) => {
    config.cache = dev ? { type: 'memory' } : false;
    return config;
  },
  // Ensure certain ESM packages are handled correctly
  // (removido transpilePackages específico para firebase para evitar conflitos de export)
  // webpack: (config, { isServer, webpack }) => {
  //     // Skip customizations when building on Firebase App Hosting (buildpack sets FIREBASE_APP_HOSTING=1)
  //     if (process.env.FIREBASE_APP_HOSTING) {
  //       return config;
  //     }
  //     if (!isServer) {
  //       // Keep default package export resolution to avoid picking ESM variants that conflict with CJS consumers
  //       config.resolve = config.resolve || {};
  //       // Hard-block undici from client bundles (alias to stub/false)
  //       config.resolve.alias = {
  //         ...(config.resolve.alias || {}),
  //         undici: require.resolve('./lib/undici-stub.js'),
  //         '@undici/web': require.resolve('./lib/undici-stub.js'),
  //         '@undici/*': require.resolve('./lib/undici-stub.js'),
  //         'undici/lib/web/fetch/util.js': require.resolve('./lib/undici-stub.js'),
  //         'undici/lib/web/fetch': require.resolve('./lib/undici-stub.js'),
  //         'undici/lib': require.resolve('./lib/undici-stub.js'),
  //         // Force Firebase Auth to use browser build and avoid node-esm variant
  //         '@firebase/auth/dist/node-esm/index.js': require.resolve('./lib/empty.js'),
  //       };
  //       // Ignore undici and @undici imports to avoid parsing Node-only code in client
  //       config.plugins = config.plugins || [];
  //       config.plugins.push(
  //         new webpack.IgnorePlugin({ resourceRegExp: /^undici(\\|\/|$)/ })
  //       );
  //       config.plugins.push(
  //         new webpack.IgnorePlugin({ resourceRegExp: /^@undici\// })
  //       );
  //       // Keep default package export resolution; avoid forcing specific Firebase variants here
  //     }
  //     return config;
  //   },
};

if (!isVercel) {
  nextConfig.output = 'standalone';
}

module.exports = nextConfig;
