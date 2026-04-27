## ADDED Requirements

### Requirement: 獨立圖片服務端點
系統 SHALL 提供 `GET /api/images/:imageId` 端點，以 imageId 為路由參數，從 R2 讀取對應圖片並回傳，附上瀏覽器快取標頭。

#### Scenario: 圖片存在時回傳
- **WHEN** `GET /api/images/:imageId` 被呼叫，且 R2 中存在 `clothes/{imageId}/photo`
- **THEN** Worker SHALL 回傳圖片二進位及對應 Content-Type header
- **THEN** Worker SHALL 附上 `Cache-Control: private, max-age=86400` header

#### Scenario: 圖片不存在時回傳 404
- **WHEN** `GET /api/images/:imageId` 被呼叫，但 R2 無此 object
- **THEN** Worker SHALL 回傳 HTTP 404

#### Scenario: 不驗證 owner（依 imageId 唯一性保護）
- **WHEN** `GET /api/images/:imageId` 被呼叫
- **THEN** Worker SHALL 不進行 owner 驗證，直接從 R2 讀取（imageId 為 UUID，猜測難度極高）
