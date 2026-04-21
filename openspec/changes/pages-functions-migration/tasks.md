## 1. 建立 Pages Functions 端點

- [x] 1.1 新增 `functions/api/initdb.ts`，以 `onRequestGet(context)` 實作 D1 建表邏輯（從 `server/index.ts` 移植）
- [x] 1.2 新增 `functions/api/clothes.ts`，以 `onRequestGet(context)` 實作衣物查詢（從 `server/index.ts` 移植）
- [x] 1.3 在 `functions/api/clothes.ts` 新增 `onRequestPost(context)` 實作衣物新增（從 `server/index.ts` 移植）

## 2. 調整 Wrangler 設定

- [x] 2.1 `wrangler.jsonc`：移除 `"main": "server/index.ts"` 與 `"assets"` 區塊
- [x] 2.2 `wrangler.jsonc`：新增 `"pages_build_output_dir": "./dist"`

## 3. 調整 Vite 設定

- [x] 3.1 `vite.config.ts`：移除 `import { cloudflare } from "@cloudflare/vite-plugin"` 與 `cloudflare()` plugin

## 4. 調整 package.json scripts

- [x] 4.1 `dev:full`：改用 `wrangler pages dev --proxy 10000 --port 10001 --ip 0.0.0.0`
- [x] 4.2 `preview`：改用 `wrangler pages dev`（需先 build）
- [x] 4.3 `deploy`：改用 `wrangler pages deploy dist/`

## 5. 調整 TypeScript 設定

- [x] 5.1 `tsconfig.worker.json`：`include` 從 `["server"]` 改為 `["functions"]`
- [x] 5.2 執行 `wrangler types` 重新產生 `worker-configuration.d.ts`（Pages 格式）

## 6. 清理

- [x] 6.1 刪除 `server/index.ts`（移植完成後）
- [x] 6.2 驗證 `npm run dev:full` 可正常啟動，`/api/clothes` 與 `/api/initdb` 回應正確
