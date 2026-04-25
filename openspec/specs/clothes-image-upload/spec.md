## ADDED Requirements

### Requirement: 上傳衣物圖片
衣物編輯表單 SHALL 提供圖片選取欄位，使用者選取圖片後，前端 SHALL 以 `multipart/form-data` 呼叫 `POST /api/clothes/:id/image`，Worker 將圖片寫入 R2，object key 為 `clothes/{id}/photo`，並將 key 更新至 `clothes.image_url` 欄位。

#### Scenario: 選取圖片並上傳
- **WHEN** 使用者在衣物編輯頁面選取圖片並送出表單
- **THEN** 前端 SHALL 呼叫 `POST /api/clothes/:id/image` 傳送圖片二進位
- **THEN** Worker SHALL 將圖片存入 R2（key: `clothes/{id}/photo`）並回傳 `{ ok: true }`

#### Scenario: 上傳後圖片顯示
- **WHEN** 衣物已有圖片（`image_url` 非 null）
- **THEN** 衣物卡片與編輯頁面 SHALL 以 `<img>` 顯示圖片，src 為 `/api/clothes/{id}/image`

#### Scenario: 無圖片時顯示佔位符
- **WHEN** 衣物尚未上傳圖片（`image_url` 為 null）
- **THEN** 衣物卡片 SHALL 顯示預設佔位符背景色（不顯示 `<img>`）

---

### Requirement: 讀取衣物圖片
Worker SHALL 提供 `GET /api/clothes/:id/image` 端點，從 R2 讀取圖片二進位後以原始 Content-Type 回傳。

#### Scenario: 圖片存在時回傳
- **WHEN** `GET /api/clothes/:id/image` 被呼叫且 R2 中存在 `clothes/{id}/photo`
- **THEN** Worker SHALL 回傳圖片二進位及對應 Content-Type header

#### Scenario: 圖片不存在時回傳 404
- **WHEN** `GET /api/clothes/:id/image` 被呼叫且 R2 無此 object
- **THEN** Worker SHALL 回傳 HTTP 404

---

### Requirement: 本地 R2 模擬
本地開發（`wrangler dev`）SHALL 使用 Wrangler 內建 R2 本地模擬，無需連接至 Cloudflare 線上 R2。

#### Scenario: 本地上傳圖片
- **WHEN** 在 `wrangler dev` 環境下上傳圖片
- **THEN** 圖片 SHALL 儲存於 `.wrangler/state/v3/r2/` 本地目錄，行為與線上 R2 一致

---

### Requirement: 刪除衣物 API
Worker SHALL 提供 `DELETE /api/clothes/:id` 端點，驗證 owner 後先從 R2 刪除圖片（若存在），再從 DB 刪除衣物記錄，回傳 `{ ok: true }`。

#### Scenario: 刪除存在的衣物（含圖片）
- **WHEN** `DELETE /api/clothes/:id` 被呼叫，且衣物存在、`image_url` 非 null
- **THEN** Worker SHALL 從 R2 刪除 `clothes/{id}/photo` object
- **THEN** Worker SHALL 從 DB 刪除該衣物記錄
- **THEN** Worker SHALL 回傳 `{ ok: true }`

#### Scenario: 刪除存在的衣物（無圖片）
- **WHEN** `DELETE /api/clothes/:id` 被呼叫，且衣物存在、`image_url` 為 null
- **THEN** Worker SHALL 直接從 DB 刪除該衣物記錄（跳過 R2 操作）
- **THEN** Worker SHALL 回傳 `{ ok: true }`

#### Scenario: 衣物不存在或不屬於該使用者
- **WHEN** `DELETE /api/clothes/:id` 被呼叫，但該 id 不存在或不屬於當前 owner
- **THEN** Worker SHALL 回傳 HTTP 404 `{ error: 'not found' }`
