## Why

目前專案以 Cloudflare Workers + Assets 模式運作，後端邏輯集中於 `server/index.ts` 並以 `wrangler dev` 執行。改用 Cloudflare Pages + Functions 可讓路由自動對應 `functions/` 目錄結構，符合 Pages 官方部署流程，並移除非必要的 `@cloudflare/vite-plugin` 依賴。

## What Changes

- **BREAKING** 移除 `server/index.ts`，取而代之以 `functions/` 目錄的 file-based routing
- 將 API Handler 從 Worker 格式（`export default { fetch(req, env) }`）改為 Pages Functions 格式（`onRequestGet` / `onRequestPost`）
- `wrangler.jsonc` 以 `pages_build_output_dir: "./dist"` 取代 `"main": "server/index.ts"`，並移除 `"assets"` 區塊
- `vite.config.ts` 移除 `cloudflare()` plugin，僅保留 `vue()`
- `package.json` dev/build/deploy scripts 改用 `wrangler pages dev / wrangler pages deploy`
- `tsconfig.worker.json` 的 `include` 從 `server` 改為 `functions`

## Capabilities

### New Capabilities

- `pages-functions-api`: 以 Cloudflare Pages Functions (`functions/api/`) 實作 `/api/initdb`、`/api/clothes` 端點，使用 `EventContext<Env, string, unknown>` 取得 D1 binding

### Modified Capabilities

<!-- 現有 spec 行為不變（wardrobe、auth、outfits、app-shell）；僅底層基礎設施改變 -->

## Impact

- `server/index.ts` — 刪除
- `functions/api/initdb.ts`、`functions/api/clothes.ts` — 新增
- `wrangler.jsonc` — 移除 `main`、`assets`，新增 `pages_build_output_dir`
- `vite.config.ts` — 移除 `cloudflare()` import 與 plugin
- `package.json` — scripts 調整
- `tsconfig.worker.json` — `include` 路徑調整
- `worker-configuration.d.ts` — 需重新以 `wrangler types` 產生（Pages 格式）
- `@cloudflare/vite-plugin` — devDependency 可移除
