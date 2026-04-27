## Why

目前 R2 的圖片儲存路徑為 `clothes/{imageId}/photo`，所有使用者的圖片混放在同一層目錄，不利於未來依使用者管理或批次操作。改為 `clothes/{email}/{imageId}` 可讓每位使用者的圖片自然分組。

## What Changes

- R2 儲存路徑由 `clothes/{imageId}/photo` 改為 `clothes/{ownerEmail}/{imageId}`
- 圖片上傳（POST `/api/clothes/:id/image`）使用新路徑寫入 R2
- 圖片提供（GET `/api/images/:imageId`）使用認證中介層提供的 `email` 組合 R2 路徑讀取
- 衣物刪除（DELETE `/api/clothes/:id`）使用新路徑刪除 R2 物件
- 舊圖替換（POST `/api/clothes/:id/image`，有舊圖時）使用新路徑刪除舊物件
- 移除 `initdb.ts` 中的 schema migration 程式碼（`acquired_occasion` 重命名、`color_note` 新增）

## Capabilities

### New Capabilities

（無新功能）

### Modified Capabilities

- `clothes-image-upload`：R2 key 結構改變，圖片服務端點的取值邏輯隨之更新

## Impact

- `functions/api/clothes/[id]/image.ts`：上傳與刪除舊圖的 R2 key 變更
- `functions/api/images/[imageId].ts`：服務端點改用 `context.data.email` 組合 R2 key
- `functions/api/clothes/[id].ts`：刪除衣物時 R2 key 變更
- `functions/api/initdb.ts`：移除 migration 區塊，只保留 CREATE TABLE
- D1 `image_url` 欄位格式不變（仍為 `/api/images/{imageId}`），不需要 migration
