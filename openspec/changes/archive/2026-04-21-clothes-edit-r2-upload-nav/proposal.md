## Why

目前衣物只能新增，無法編輯；照片欄位也尚未實作，造成衣物資料不完整。同時，底部 Tab 切換時會堆疊瀏覽器歷史，導致使用者按上一頁時出現非預期的 Tab 跳轉行為，需一併修正導航邏輯。

## What Changes

- 衣物表單（`/wardrobe/new`）擴充為新增與編輯共用頁面，編輯路由為 `/wardrobe/:id/edit`
- 衣物表單新增圖片上傳欄位，圖片上傳至 Cloudflare R2；本地開發使用 Wrangler 的 R2 本地模擬
- 衣物欄位 `入手時機`（acquired_occasion）改為 `入手時間`（acquired_date），格式為 `yyyyMM`（例如：`202503`）
- `AppHeader` 移除中文頁面標題文字（衣櫥、穿搭），Header 僅保留右側主題切換按鈕
- 底部 Tab 切換改用 `router.replace()` 防止歷史堆疊；Tab 頁面之間切換無法用瀏覽器上一頁回溯
- 衣物新增／編輯頁面左上角新增返回按鈕（SVG icon），瀏覽器原生上一頁同樣可返回

## Capabilities

### New Capabilities

- `clothes-image-upload`：衣物圖片上傳至 Cloudflare R2，API 端點為 `POST /api/clothes/:id/image`；本地開發使用 Wrangler R2 本地模擬（`--local`）

### Modified Capabilities

- `wardrobe`：新增編輯衣物路由與表單；`acquired_occasion` 欄位改為 `acquired_date`（yyyyMM）；衣物卡片顯示已上傳圖片
- `app-shell`：AppHeader 移除頁面標題文字；底部 Tab 使用 `router.replace()` 防止歷史堆疊；新增 `icon-arrow-left.svg` 並在衣物新增／編輯頁面顯示返回按鈕

## Impact

- `src/views/ClothesEditView.vue`：新增編輯模式（讀取現有資料、改用 PATCH API）、圖片上傳欄位、返回按鈕
- `src/components/AppHeader.vue`：移除 `<slot>` 或動態標題文字
- `src/components/BottomNav.vue`：Tab 切換改用 `router.replace()`
- `src/router/index.ts`：新增 `/wardrobe/:id/edit` 路由
- `src/assets/icons/icon-arrow-left.svg`：新增返回箭頭 SVG
- `functions/api/clothes.ts`：新增 `PATCH /api/clothes/:id`、`POST /api/clothes/:id/image` 端點
- `wrangler.jsonc`：設定 R2 bucket binding
- 資料庫 schema：`acquired_occasion` 欄位改名為 `acquired_date`（yyyyMM 字串）
