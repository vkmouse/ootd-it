## Why

目前圖片端點 URL（`/api/clothes/:id/image`）對同一件衣物永遠相同，導致即使使用者上傳了新圖，瀏覽器也無法正確快取或更新。我們需要讓每次上傳的圖片擁有獨立 ID，使 URL 改變達到 cache busting 效果，同時啟用瀏覽器端快取降低不必要的網路請求。

## What Changes

- 新增獨立圖片端點 `GET /api/images/:imageId`，回傳圖片並附上 `Cache-Control: private, max-age=86400`
- 上傳圖片時（`POST /api/clothes/:id/image`）產生新的 `imageId`（UUID），與衣物 ID 分離
- R2 儲存 key 改為 `clothes/{imageId}/photo`（不再以衣物 ID 為 key）
- DB 欄位 `image_url` 改存完整相對 URL `/api/images/{imageId}`
- 上傳新圖前，若有舊圖則先從 R2 刪除舊物件
- 前端改以 `image_url` 欄位直接作為 `<img src>` 的值，不再拼接 `/api/clothes/:id/image`
- 移除 `GET /api/clothes/:id/image` handler（不再需要，改由新端點取代）

## Capabilities

### New Capabilities

- `image-serving`: 獨立圖片服務端點，以 imageId 為路由，附帶瀏覽器快取標頭

### Modified Capabilities

- `clothes-image-upload`: 圖片上傳改為產生獨立 imageId，image_url 欄位語義改變（由 R2 key → 完整 API URL）
- `wardrobe`: 衣物列表及衣物編輯畫面改用 image_url 直接顯示圖片

## Impact

- **後端 API**：新增 `functions/api/images/[imageId].ts`；修改 `functions/api/clothes/[id]/image.ts`（POST handler）；修改 `functions/api/clothes/[id].ts`（DELETE handler，解析 imageId 以刪除 R2 物件）
- **DB schema**：`image_url` 欄位格式改變（舊資料若有值會因 key 格式不同而失效，需注意現有資料相容性）
- **前端**：`ClothesEditView.vue` 改用 `image_url` 直接作為圖片 src
- **R2**：每次上傳產生新 object，舊 object 在上傳新圖時自動刪除
