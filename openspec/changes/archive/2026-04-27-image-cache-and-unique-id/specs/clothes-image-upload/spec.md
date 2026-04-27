## MODIFIED Requirements

### Requirement: 上傳衣物圖片
衣物編輯表單 SHALL 提供圖片選取欄位，使用者選取圖片後，前端 SHALL 以 `multipart/form-data` 呼叫 `POST /api/clothes/:id/image`，Worker SHALL 產生新的 `imageId`（UUID），將圖片寫入 R2（key: `clothes/{imageId}/photo`），並將 `/api/images/{imageId}` 更新至 `clothes.image_url` 欄位。若該衣物原本已有圖片，Worker SHALL 先從 R2 刪除舊物件再寫入新物件。

#### Scenario: 選取圖片並上傳
- **WHEN** 使用者在衣物編輯頁面選取圖片並送出表單
- **THEN** 前端 SHALL 呼叫 `POST /api/clothes/:id/image` 傳送圖片二進位
- **THEN** Worker SHALL 產生新 imageId（UUID）
- **THEN** Worker SHALL 將圖片存入 R2（key: `clothes/{imageId}/photo`）並回傳 `{ ok: true }`
- **THEN** Worker SHALL 將 `image_url` 更新為 `/api/images/{imageId}`

#### Scenario: 上傳新圖時刪除舊圖
- **WHEN** 衣物已有圖片（`image_url` 非 null），使用者上傳新圖片
- **THEN** Worker SHALL 從 `image_url` 解析舊 imageId，並從 R2 刪除 `clothes/{舊imageId}/photo`
- **THEN** Worker SHALL 以新 imageId 寫入新圖並更新 `image_url`

#### Scenario: 上傳後圖片顯示
- **WHEN** 衣物已有圖片（`image_url` 非 null）
- **THEN** 衣物卡片與編輯頁面 SHALL 以 `<img>` 顯示圖片，src 直接使用 `image_url` 欄位值（格式：`/api/images/{imageId}`）

#### Scenario: 無圖片時顯示佔位符
- **WHEN** 衣物尚未上傳圖片（`image_url` 為 null）
- **THEN** 衣物卡片 SHALL 顯示預設佔位符背景色（不顯示 `<img>`）

---

## REMOVED Requirements

### Requirement: 讀取衣物圖片
**Reason**: 圖片存取改由獨立的 `GET /api/images/:imageId` 端點提供，`GET /api/clothes/:id/image` 不再需要。
**Migration**: 前端改用 `image_url` 欄位值（`/api/images/{imageId}`）作為圖片 src，不再呼叫 `/api/clothes/:id/image`。

---

## MODIFIED Requirements

### Requirement: 刪除衣物 API
Worker SHALL 提供 `DELETE /api/clothes/:id` 端點，驗證 owner 後先從 R2 刪除圖片（若存在），再從 DB 刪除衣物記錄，回傳 `{ ok: true }`。從 R2 刪除圖片時，SHALL 從 `image_url` 欄位解析 imageId（取最後一段路徑），再刪除 `clothes/{imageId}/photo`。

#### Scenario: 刪除存在的衣物（含圖片）
- **WHEN** `DELETE /api/clothes/:id` 被呼叫，且衣物存在、`image_url` 非 null
- **THEN** Worker SHALL 從 `image_url` 解析 imageId，刪除 R2 中的 `clothes/{imageId}/photo`
- **THEN** Worker SHALL 從 DB 刪除該衣物記錄
- **THEN** Worker SHALL 回傳 `{ ok: true }`

#### Scenario: 刪除存在的衣物（無圖片）
- **WHEN** `DELETE /api/clothes/:id` 被呼叫，且衣物存在、`image_url` 為 null
- **THEN** Worker SHALL 直接從 DB 刪除該衣物記錄（跳過 R2 操作）
- **THEN** Worker SHALL 回傳 `{ ok: true }`

#### Scenario: 衣物不存在或不屬於該使用者
- **WHEN** `DELETE /api/clothes/:id` 被呼叫，但該 id 不存在或不屬於當前 owner
- **THEN** Worker SHALL 回傳 HTTP 404 `{ error: 'not found' }`
