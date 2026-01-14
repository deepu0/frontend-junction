import path from 'node:path';
import { build } from 'velite';

/** @type {import('next').NextConfig} */
export default {
  // other next config here...
  outputFileTracingRoot: path.resolve('..', '..'),
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

class VeliteWebpackPlugin {
  static started = false;
  constructor(/** @type {import('velite').Options} */ options = {}) {
    this.options = options;
  }
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // executed three times in nextjs !!!
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === 'development';
      this.options.watch = this.options.watch ?? dev;
      this.options.clean = this.options.clean ?? !dev;
      await build(this.options); // start velite
    });
  }
}
