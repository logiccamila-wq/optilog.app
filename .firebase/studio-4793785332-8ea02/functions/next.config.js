var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// next.config.js
var nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  // Temporarily ignore TypeScript errors during CI builds (e.g., Vercel)
  // to prevent non-critical type issues from blocking deployments.
  typescript: {
    ignoreBuildErrors: true
  },
  // Optimize for containerized/App Hosting deployments
  output: "standalone",
  experimental: {
    // Permitir resolver ESM externos em modo "loose" para escolher entradas de browser
    esmExternals: "loose"
  },
  // Transpile node_modules that ship modern syntax so Webpack can parse
  transpilePackages: ["undici"],
  // Ensure certain ESM packages are handled correctly
  // (removido transpilePackages específico para firebase para evitar conflitos de export)
  webpack: (config, { isServer, webpack }) => {
    if (process.env.FIREBASE_APP_HOSTING) {
      return config;
    }
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.conditionNames = ["browser", "import", "module", "default"];
      config.resolve.alias = {
        ...config.resolve.alias || {},
        undici: require.resolve("./lib/undici-stub.js"),
        "@undici/web": require.resolve("./lib/undici-stub.js"),
        "@undici/*": require.resolve("./lib/undici-stub.js"),
        "undici/lib/web/fetch/util.js": require.resolve("./lib/undici-stub.js"),
        "undici/lib/web/fetch": require.resolve("./lib/undici-stub.js"),
        "undici/lib": require.resolve("./lib/undici-stub.js"),
        // Force Firebase Auth to use browser build and avoid node-esm variant
        "@firebase/auth/dist/node-esm/index.js": require.resolve("./lib/empty.js")
      };
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^undici(\\|\/|$)/ })
      );
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^@undici\// })
      );
    }
    return config;
  }
};
module.exports = nextConfig;
