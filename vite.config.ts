import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

export default defineConfig(() => {
  const envDir = path.resolve(__dirname, './.env-config')
  return {
    envDir,
    plugins: [react(), tsconfigPaths(), nodePolyfills()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['@centrifuge/sdk'],
    },
    server: {
      port: 3003,
      headers: {
        // allow Safe (served from app.safe.global) to fetch manifest and assets
        // https://help.safe.global/en/articles/145503-how-to-create-a-safe-app-with-safe-apps-sdk-and-list-it
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Security-Policy':
          "frame-ancestors 'self' https://app.safe.global https://*.safe.global https://gnosis-safe.io;",
      },
    },
    build: {
      outDir: 'dist',
    },
  }
})
