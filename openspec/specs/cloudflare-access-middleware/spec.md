## ADDED Requirements

### Requirement: Cloudflare Access JWT 驗證
Middleware SHALL 從請求標頭 `Cf-Access-Jwt-Assertion` 取得 JWT，並以 `jose` 函式庫搭配 `${TEAM_DOMAIN}/cdn-cgi/access/certs` JWKS 端點進行驗證，從簽章確認的 payload 中提取 `email`。

#### Scenario: 有效 JWT 取得 email
- **WHEN** 請求包含有效的 `Cf-Access-Jwt-Assertion` 標頭，且 `POLICY_AUD`、`TEAM_DOMAIN` 環境變數已設定
- **THEN** Middleware SHALL 驗證 JWT 並將 payload 中的 `email` 寫入 `context.data.email`，然後呼叫 `context.next()`

#### Scenario: JWT 驗證失敗繼續以 fallback 執行
- **WHEN** JWT 驗證失敗（簽章無效、過期、audience 不符）
- **THEN** Middleware SHALL 使用 `demo@example.com` 作為 `context.data.email`

### Requirement: 本地開發 Fallback
當 `POLICY_AUD` 或 `TEAM_DOMAIN` 環境變數未設定，或請求未包含 `Cf-Access-Jwt-Assertion` 標頭時，Middleware SHALL 使用 `demo@example.com` 作為使用者身分，不中斷請求處理。

#### Scenario: 環境變數未設定時 fallback
- **WHEN** `POLICY_AUD` 或 `TEAM_DOMAIN` 未設定
- **THEN** Middleware SHALL 跳過 JWT 驗證，以 `demo@example.com` 寫入 `context.data.email`

#### Scenario: 無 JWT 標頭時 fallback
- **WHEN** 請求不包含 `Cf-Access-Jwt-Assertion` 標頭
- **THEN** Middleware SHALL 使用 `demo@example.com` 作為 `context.data.email`

### Requirement: 共用型別定義
`functions/types.ts` SHALL 定義並匯出 `Env` interface（含 `DB`、`ASSETS_BUCKET`、`POLICY_AUD`、`TEAM_DOMAIN`）與 `AuthContext` interface（含 `email: string`），供 middleware 與所有 API handlers 共用。

#### Scenario: API handler 取得 email
- **WHEN** API handler 執行時
- **THEN** `context.data.email` SHALL 已由 middleware 設定，handler 可直接讀取，不需自行解析 header
