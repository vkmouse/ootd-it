## ADDED Requirements

### Requirement: Cloudflare Access 使用者識別 (User identity)
Worker SHALL 從 Cloudflare Access 注入的 `cf-access-authenticated-user-email` 請求標頭 (request header) 中讀取已驗證使用者的電子郵件。

#### Scenario: 在正式環境擷取電子郵件
- **WHEN** 請求包含 `cf-access-authenticated-user-email` 標頭時
- **THEN** Worker SHALL 使用該值作為目前使用者的身分，用於所有資料操作

---

### Requirement: 本地開發回退機制 (Local development fallback)
當缺乏 `cf-access-authenticated-user-email` 標頭時（本地開發環境），Worker SHALL 回退 (fallback) 使用 `demo@example.com` 作為使用者身分。

#### Scenario: 本地開發的回退處理
- **WHEN** 請求不包含 `cf-access-authenticated-user-email` 標頭時
- **THEN** Worker SHALL 使用 `demo@example.com` 作為 `owner_email`

---

### Requirement: 個別使用者資料隔離 (Per-user data isolation)
所有資料的讀取與寫入 SHALL 僅限於目前使用者的電子郵件範圍內，以確保使用者無法存取彼此的資料。

#### Scenario: 查詢範圍限定於擁有者
- **WHEN** Worker 查詢 `clothes` 資料表時
- **THEN** 所有查詢語句 SHALL 包含 `WHERE owner_email = <current_user_email>`