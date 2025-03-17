import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build({
      entry: 'src/index.tsx',  // 全てのエントリーポイント
      rollupOptions: {
        output: {
          preserveModules: true,  // 🔥 これを追加
        },
      },
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx',
    }),
  ],
});
