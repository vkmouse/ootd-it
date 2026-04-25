## MODIFIED Requirements

### Requirement: Cloudflare Access 使用者識別 (User identity)
系統 SHALL 以 Cloudflare Access JWT（`Cf-Access-Jwt-Assertion` 標頭）驗證使用者身分，由 `functions/_middleware.ts` 集中處理後將 email 寫入 `context.data.email`；API handlers SHALL 從 `context.data.email` 讀取使用者身分，不得直接讀取任何 HTTP header。

#### Scenario: 在正式環境擷取電子郵件
- **WHEN** 請求包含有效的 `Cf-Access-Jwt-Assertion` 標頭，且 `POLICY_AUD`、`TEAM_DOMAIN` 已設定
- **THEN** Middleware SHALL 驗證 JWT 並將簽章確認的 email 寫入 `context.data.email`，API handler 使用該值進行所有資料操作

### Requirement: 本地開發回退機制 (Local development fallback)
當 `POLICY_AUD`/`TEAM_DOMAIN` 未設定或請求無有效 JWT 時，系統 SHALL 回退使用 `demo@example.com` 作為使用者身分，由 middleware 統一處理，不在個別 handler 實作。

#### Scenario: 本地開發的回退處理
- **WHEN** 請求不包含 `Cf-Access-Jwt-Assertion` 標頭，或環境變數未設定
- **THEN** Middleware SHALL 以 `demo@example.com` 寫入 `context.data.email`，所有 API handlers 正常執行

### Requirement: 個別使用者資料隔離 (Per-user data isolation)
所有資料的讀取與寫入 SHALL 僅限於目前使用者的電子郵件範圍內，以確保使用者無法存取彼此的資料。

#### Scenario: 查詢範圍限定於擁有者
- **WHEN** Worker 查詢 `clothes` 資料表時
- **THEN** 所有查詢語句 SHALL 包含 `WHERE owner_email = <current_user_email>`，其中 `current_user_email` 來自 `context.data.email`
