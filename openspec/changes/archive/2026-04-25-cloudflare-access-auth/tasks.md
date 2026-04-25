## 1. 安裝套件與建立共用型別

- [x] 1.1 安裝 `jose` npm 套件（`npm install jose`）
- [x] 1.2 建立 `functions/types.ts`，定義並匯出 `Env`（含 `DB`、`ASSETS_BUCKET`、`POLICY_AUD`、`TEAM_DOMAIN`）與 `AuthContext`（含 `email: string`）

## 2. 實作 Middleware

- [x] 2.1 建立 `functions/_middleware.ts`，實作 `verifyCloudflareAccessToken` 函式（使用 `jose` 驗證 JWT）
- [x] 2.2 在 middleware `onRequest` 中：讀取 `Cf-Access-Jwt-Assertion`，驗證後將 email 寫入 `context.data.email`，無 JWT 或驗證失敗時 fallback `demo@example.com`

## 3. 修改 API Handlers

- [x] 3.1 修改 `functions/api/clothes.ts`：移除 `getOwnerEmail` 函式，改從 `context.data.email` 取得 email，EventContext 型別改為 `EventContext<Env, string, AuthContext>`
- [x] 3.2 修改 `functions/api/clothes/[id].ts`：同上，移除 header 讀取，改用 `context.data.email`
- [x] 3.3 修改 `functions/api/clothes/[id]/image.ts`：同上，移除 header 讀取，改用 `context.data.email`

## 4. 驗證

- [x] 4.1 執行 `npm run type-check` 確認零型別錯誤
- [x] 4.2 本地啟動 `npm run dev:full`，確認無 JWT 時 API 正常回 應（fallback email）
