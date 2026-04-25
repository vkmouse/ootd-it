## Why

目前的身分驗證直接信任 `cf-access-authenticated-user-email` HTTP header，任何人都可以偽造此 header 冒用他人身分存取資料。改為驗證 Cloudflare Access 簽發的 JWT（`Cf-Access-Jwt-Assertion`），確保只有經過 Cloudflare Access 驗證的使用者才能操作自己的衣物資料。

## What Changes

- 新增 `functions/_middleware.ts`：以 Pages Functions middleware 攔截所有 `/api/*` 請求，驗證 Cloudflare Access JWT 並將 email 注入 `context.data`
- 新增 `functions/types.ts`：定義 `Env`、`AuthContext` 型別，供 middleware 與 API handlers 共用
- 修改 `functions/api/clothes.ts`、`functions/api/clothes/[id].ts`、`functions/api/clothes/[id]/image.ts`、`functions/api/initdb.ts`：改從 `context.data.email` 取得使用者 email，移除各自的 `getOwnerEmail` 邏輯
- 新增環境變數 `POLICY_AUD`、`TEAM_DOMAIN`（Cloudflare Access 設定）；未設定時自動回退 `demo@example.com`（本地開發）
- 安裝 `jose` 套件作為 JWT 驗證函式庫

## Capabilities

### New Capabilities
- `cloudflare-access-middleware`: Pages Functions `_middleware.ts`，集中處理 JWT 驗證並將 email 寫入 `context.data`

### Modified Capabilities
- `auth`: 驗證機制從信任 HTTP header 改為驗證 Cloudflare Access JWT；資料隔離行為不變，但身分來源改為 middleware 注入的 `context.data.email`

## Impact

- `functions/` 所有 API handlers（clothes、initdb）需改用 `context.data.email`
- 需安裝 `jose` npm 套件
- 需在 `wrangler.jsonc` 加入 `POLICY_AUD`、`TEAM_DOMAIN` env var 說明（secrets）
- 本地開發無需設定即可 fallback，不影響開發體驗
