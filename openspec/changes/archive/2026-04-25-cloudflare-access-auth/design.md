## Context

目前所有 API handler 各自從 `cf-access-authenticated-user-email` header 取得使用者 email。此 header 由 Cloudflare 注入，但未經 JWT 簽章驗證——若繞過 Cloudflare Access（例如直接呼叫 Worker URL），任何人都能偽造 header。

本設計採用 Pages Functions middleware（`functions/_middleware.ts`）集中驗證 Cloudflare Access JWT，並透過 `context.data` 將 email 傳遞給下游 handlers。

## Goals / Non-Goals

**Goals:**
- 以 `jose` 驗證 `Cf-Access-Jwt-Assertion` JWT，從簽章確認的 payload 取得 email
- 集中驗證邏輯於 `_middleware.ts`，API handlers 只讀取 `context.data.email`
- 定義共用型別 `Env`、`AuthContext` 於 `functions/types.ts`
- 本地開發無 JWT 時 fallback `demo@example.com`，不中斷開發流程

**Non-Goals:**
- 不實作登出、session 管理
- 不實作 role/permission 系統（只做 email 身分識別）
- 不對 `initdb` 端點做身分保護（維持原行為）

## Decisions

### 1. 使用 Pages Functions `_middleware.ts` 集中驗證

**選擇**：`functions/_middleware.ts`（Pages Functions middleware）

**理由**：Pages Functions 對 `_middleware.ts` 有原生支援，會自動攔截相同目錄及子目錄的所有請求。放在 `functions/` 根目錄可覆蓋全部 `/api/*` 路由，無需各 handler 重複驗證邏輯。

**替代方案考慮**：各 handler 自行驗證 → 程式碼重複、易漏改，捨棄。

### 2. 以 `jose` 驗證 JWT，不直接信任 header

**選擇**：用 `jwtVerify` + `createRemoteJWKSet` 驗證 `Cf-Access-Jwt-Assertion`

**理由**：`cf-access-authenticated-user-email` header 可被任意偽造。JWT 有 Cloudflare 的 RSA 簽章，只有持有對應 private key 的 Cloudflare 才能簽發，驗證可靠。JWKS 端點 `${TEAM_DOMAIN}/cdn-cgi/access/certs` 由 `jose` 自動快取。

**替代方案考慮**：繼續信任 header → 有安全風險，捨棄。

### 3. 環境變數控制驗證行為

**選擇**：`POLICY_AUD`、`TEAM_DOMAIN` 未設定時自動 fallback

**理由**：本地開發 (`wrangler pages dev`) 無法取得 Access token，若強制驗證則無法開發。以環境變數區分生產/本地環境，開發者不需額外設定。

### 4. 共用型別集中於 `functions/types.ts`

定義：
```ts
export interface Env {
  DB: D1Database
  ASSETS_BUCKET: R2Bucket
  POLICY_AUD: string
  TEAM_DOMAIN: string
}

export interface AuthContext {
  email: string
}
```
所有 handler 改用 `EventContext<Env, string, AuthContext>` 取代 `EventContext<Env, string, unknown>`。

## Risks / Trade-offs

- **JWKS 遠端請求延遲**：`jose` 會快取 JWKS，但首次請求需遠端拉取。若 Cloudflare Access certs 端點不可用，驗證會失敗。→ Mitigation：`jose` 內建快取，通常不影響效能；生產環境 Access certs 高可用。
- **本地開發 fallback 仍使用固定 email**：所有人本地都用 `demo@example.com`，資料共用。→ Mitigation：此為既有行為，可接受。
- **`initdb` 無身分保護**：維持原狀，不做驗證。→ Mitigation：此端點僅用於初始化，接受風險。

## Migration Plan

1. 安裝 `jose` 套件
2. 建立 `functions/types.ts` 定義 `Env`、`AuthContext`
3. 建立 `functions/_middleware.ts` 驗證邏輯
4. 修改所有 API handlers 改用 `context.data.email`
5. 在 Cloudflare Pages 設定 `POLICY_AUD`、`TEAM_DOMAIN` secrets
6. 部署後驗證：有效 Access token → 取得真實 email；無 token → 回傳 401 或 fallback（本地）
