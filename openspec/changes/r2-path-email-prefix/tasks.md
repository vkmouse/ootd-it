## 1. 更新圖片上傳端點

- [x] 1.1 修改 `functions/api/clothes/[id]/image.ts`：R2 寫入 key 改為 `clothes/${ownerEmail}/${imageId}`
- [x] 1.2 修改 `functions/api/clothes/[id]/image.ts`：刪除舊圖的 R2 key 改為 `clothes/${ownerEmail}/${oldImageId}`

## 2. 更新圖片服務端點

- [x] 2.1 修改 `functions/api/images/[imageId].ts`：取得 `ownerEmail`（`context.data.email`），R2 讀取 key 改為 `clothes/${ownerEmail}/${imageId}`

## 3. 更新衣物刪除端點

- [x] 3.1 修改 `functions/api/clothes/[id].ts`：刪除衣物時的 R2 delete key 改為 `clothes/${ownerEmail}/${imageId}`

## 4. 移除舊 Migration 程式碼

- [x] 4.1 修改 `functions/api/initdb.ts`：移除 `acquired_occasion` 重命名 migration 區塊
- [x] 4.2 修改 `functions/api/initdb.ts`：移除 `color_note` 新增欄位 migration 區塊
