## 1. 後端：新增圖片服務端點

- [x] 1.1 新增 `functions/api/images/[imageId].ts`，實作 `GET /api/images/:imageId`：從 R2 讀取 `clothes/{imageId}/photo`，附上 `Cache-Control: private, max-age=86400` header 後回傳圖片二進位；找不到時回傳 404

## 2. 後端：修改圖片上傳端點

- [x] 2.1 修改 `functions/api/clothes/[id]/image.ts` 的 `POST` handler：上傳前先查詢現有 `image_url`，若有舊圖則從 R2 刪除舊 object（解析 imageId 為 `image_url` 最後一段路徑）
- [x] 2.2 同 POST handler：產生新 `imageId = crypto.randomUUID()`，R2 key 改為 `clothes/{imageId}/photo`，DB `image_url` 改寫為 `/api/images/{imageId}`
- [x] 2.3 移除 `GET /api/clothes/:id/image` handler（刪除或移除 `onRequestGet` export）

## 3. 後端：修改刪除衣物端點

- [x] 3.1 修改 `functions/api/clothes/[id].ts` 的 `DELETE` handler：從 `image_url` 欄位解析 imageId（取 URL 最後一段），改用 `clothes/{imageId}/photo` 作為 R2 刪除 key（而非舊的 `image_url` 直接當 key）

## 4. 前端：改用 image_url 顯示圖片

- [x] 4.1 修改 `ClothesEditView.vue`：編輯模式圖片預覽改用 `existingImageUrl` 直接作為 `<img src>`（格式已為 `/api/images/{imageId}`），移除拼接 `/api/clothes/${clothesId}/image` 的邏輯
- [x] 4.2 修改 `ClothesCard.vue`（若有）：圖片 src 改用 `image_url` 欄位直接渲染，移除拼接 `/api/clothes/{id}/image` 的邏輯

## 5. 驗證

- [x] 5.1 執行 `npm run type-check` 確認零 TypeScript 錯誤
