## Context

專案目前以 Cloudflare Workers + Assets 模式部署：`server/index.ts` 作為單一 Worker 入口，`wrangler.jsonc` 使用 `"main"` 欄位，Vite 透過 `@cloudflare/vite-plugin` 的 `cloudflare()` plugin 整合 Workers runtime。

目標改為 Cloudflare Pages + Functions 模式：以 `functions/` 目錄進行 file-based routing，靜態資源由 `dist/` 提供，`wrangler pages dev` 負責本地整合開發。

## Goals / Non-Goals

**Goals:**
- `functions/api/` 以 Pages Functions 格式接管現有 API 端點
- `wrangler.jsonc` 改為 Pages 格式（`pages_build_output_dir`）
- `vite.config.ts` 移除 Workers 專用 plugin
- Dev / build / deploy scripts 全部對應 Pages workflow

**Non-Goals:**
- 不新增 API 端點或業務邏輯
- 不調整資料庫 schema

## Decisions

### 1. 使用 file-based routing（`functions/api/*.ts`）而非 Advanced Mode（`_worker.js`）
Pages Functions 官方推薦 file-based `/functions` 目錄；Advanced Mode 適用於需要完全自訂路由的場合。現有 API 僅有兩個端點，file-based 路由更清晰易維護。

### 2. 移除 `@cloudflare/vite-plugin` 的 `cloudflare()` plugin
`cloudflare()` plugin 是 Workers-specific 整合，Pages Functions 不需要它。Vite 只需 `vue()` plugin 建出 `dist/`，runtime 由 `wrangler pages dev` 負責。

### 3. Handler 格式：使用方法專用 export（`onRequestGet` / `onRequestPost`）
- `functions/api/initdb.ts` → 只有 GET，export `onRequestGet`
- `functions/api/clothes.ts` → GET + POST，各自 export handler

### 4. TypeScript env 型別
Pages Functions 使用 `EventContext<Env, Params, Data>`，`Env` 介面由 `wrangler types` 產生，寫入 `worker-configuration.d.ts`（保持原檔名）。

### 5. Dev script
```
vite --host 0.0.0.0 --port 10000 & wait-on tcp:10000 &&
wrangler pages dev --proxy 10000 --port 10001 --ip 0.0.0.0
```
`--proxy` 模式讓 `wrangler pages dev` 代理 vite dev server，同時注入 Functions runtime。

## Risks / Trade-offs

- **wrangler pages dev 行為差異** → 本地 D1 路徑與 wrangler dev 略有不同；需確認 `.wrangler/state` 可正常建立
- **移除 `@cloudflare/vite-plugin`** → HMR 與 SSR mode 功能消失；但本專案是純 SPA，不受影響
- **`@cloudflare/vite-plugin` 殘留** → 可留在 devDependencies 不刪（避免 git diff 過大），但 vite.config.ts 中不再使用

## Migration Plan

1. 新增 `functions/api/initdb.ts` 與 `functions/api/clothes.ts`（Pages handler 格式）
2. 修改 `wrangler.jsonc`：移除 `main`、`assets`，加入 `pages_build_output_dir`
3. 修改 `vite.config.ts`：移除 `cloudflare()` import 與 plugin
4. 修改 `package.json` scripts
5. 修改 `tsconfig.worker.json`：`include: ["functions"]`
6. 執行 `wrangler types` 重新產生型別
7. 刪除 `server/index.ts`（或保留備查）
