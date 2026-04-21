## 1. 資料庫 Migration

- [x] 1.1 在 `functions/api/initdb.ts` 新增 migration：`ALTER TABLE clothes RENAME COLUMN acquired_occasion TO acquired_date`
- [x] 1.2 本地執行 migration 確認欄位改名成功（`wrangler d1 execute ootd-it-db --local --command "..."` 或透過 initdb 端點）

## 2. R2 Binding 設定

- [x] 2.1 在 `wrangler.jsonc` 的 `r2_buckets` 新增 binding：`{ "binding": "IMAGES", "bucket_name": "ootd-it-images" }`
- [x] 2.2 在 `worker-configuration.d.ts` 的 `Env` 介面新增 `IMAGES: R2Bucket`

## 3. SVG Icon

- [x] 3.1 新增 `src/assets/icons/icon-arrow-left.svg`（`viewBox="0 0 24 24" fill="none" stroke="currentColor"`，左箭頭路徑）
- [x] 3.2 在 `src/utils/icons.ts` export `iconArrowLeft`

## 4. Worker API 端點

- [x] 4.1 新增 `functions/api/clothes/[id].ts`，實作 `GET /api/clothes/:id`（取得單一衣物）
- [x] 4.2 在 `functions/api/clothes/[id].ts` 實作 `PATCH /api/clothes/:id`（更新衣物欄位，不包含 image）
- [x] 4.3 新增 `functions/api/clothes/[id]/image.ts`，實作 `POST /api/clothes/:id/image`（接收 `multipart/form-data`，寫入 R2，更新 `image_url`）
- [x] 4.4 在 `functions/api/clothes/[id]/image.ts` 實作 `GET /api/clothes/:id/image`（從 R2 讀取並回傳圖片二進位）
- [x] 4.5 將 `functions/api/clothes.ts` 的 `acquired_occasion` 欄位名稱全部改為 `acquired_date`

## 5. Router 更新

- [x] 5.1 在 `src/router/index.ts` 新增路由 `{ path: '/wardrobe/:id/edit', name: 'wardrobe-edit', component: ClothesEditView }`

## 6. AppHeader 修改

- [x] 6.1 移除 `AppHeader.vue` 中的 `routeTitles` 對應表及 `<span class="app-header__title">` 動態標題文字
- [x] 6.2 調整 `AppHeader.vue` 版面，使 header 僅顯示右側主題切換按鈕

## 7. BottomNav 修改

- [x] 7.1 將 `BottomNav.vue` 的 `<RouterLink>` 改為 `<button>`，並呼叫 `router.replace()` 進行 Tab 切換
- [x] 7.2 在 `App.vue` 或 router meta 中，於 `/wardrobe/new` 與 `/wardrobe/:id/edit` 隱藏 `BottomNav`

## 8. ClothesEditView 改造

- [x] 8.1 讀取 route params，判斷新增模式（`/wardrobe/new`）或編輯模式（`/wardrobe/:id/edit`）
- [x] 8.2 編輯模式：掛載時呼叫 `GET /api/clothes/:id`，將回傳資料填入表單
- [x] 8.3 將表單欄位 `acquired_occasion` 改為 `acquired_date`，input 改為 `type="month"`（`yyyy-MM` ↔ `yyyyMM` 轉換）
- [x] 8.4 新增圖片選取欄位（`<input type="file" accept="image/*">`），選取後預覽圖片
- [x] 8.5 送出時：create 模式呼叫 `POST /api/clothes`，edit 模式呼叫 `PATCH /api/clothes/:id`
- [x] 8.6 若有選取圖片，送出後呼叫 `POST /api/clothes/:id/image` 上傳圖片
- [x] 8.7 頂部加入包含 `icon-arrow-left` 的返回按鈕，點擊呼叫 `router.back()`

## 9. ClothesCard 更新

- [x] 9.1 更新 `ClothesCard.vue`，若 `image_url` 非 null 則以 `<img>` 顯示圖片（src: `/api/clothes/{id}/image`）；否則顯示佔位符背景
- [x] 9.2 衣物卡片點擊時導航至 `/wardrobe/:id/edit`

## 10. WardrobeView 更新

- [x] 10.1 確認 WardrobeView 傳遞 `id` 給 ClothesCard，使卡片可連結至編輯頁面
