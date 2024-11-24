import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build({
      entry: 'src/index.tsx'   // 全てのエントリーポイント
    }),
    devServer({ // 開発環境
      adapter,
      entry: 'src/index.tsx'   // 全てのエントリーポイント
    }),
  ],
});