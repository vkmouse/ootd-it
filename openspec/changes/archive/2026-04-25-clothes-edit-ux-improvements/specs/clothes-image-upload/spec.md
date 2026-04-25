## ADDED Requirements

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
