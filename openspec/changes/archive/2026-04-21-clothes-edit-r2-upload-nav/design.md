## Context

目前 ClothesEditView 只支援新增模式（`POST /api/clothes`），路由僅有 `/wardrobe/new`。BottomNav 使用 `<RouterLink>` 進行 Tab 切換，會往瀏覽器歷史推入新記錄，造成使用者在 Tab 間切換後按瀏覽器上一頁時出現非預期頁面跳轉。AppHeader 顯示動態頁面標題，但根據設計需求只保留主題切換按鈕。資料庫有 `acquired_occasion`（文字欄位）及 `image_url` 欄位，圖片上傳尚未實作。

## Goals / Non-Goals

**Goals:**
- ClothesEditView 共用於新增與編輯模式，依路由 `:id` 判斷
- 實作圖片上傳至 Cloudflare R2，本地用 Wrangler local R2 模擬
- 將 `acquired_occasion` 改為 `acquired_date`（yyyyMM 格式字串）
- AppHeader 移除頁面標題文字，只保留主題切換按鈕
- BottomNav Tab 切換用 `router.replace()` 防止歷史堆疊
- 衣物新增／編輯頁面顯示返回按鈕（`icon-arrow-left.svg`）

**Non-Goals:**
- 圖片格式驗證或壓縮（MVP 階段僅上傳原始檔案）
- 多圖上傳（每件衣物僅一張圖）
- 分頁或懶加載衣物列表

## Decisions

### 1. 共用 ClothesEditView（新增 vs. 編輯）

路由 `/wardrobe/new` → 新增模式；`/wardrobe/:id/edit` → 編輯模式。  
component 內部以 `const clothesId = useRoute().params.id` 是否存在判斷模式。  
編輯模式：掛載時 `GET /api/clothes/:id` 讀取資料填入表單，送出時呼叫 `PATCH /api/clothes/:id`。

為何不拆兩個 view？表單邏輯完全相同，共用可減少重複代碼，且維護只需一份。

### 2. 圖片上傳流程

前端選取圖片後，透過 `FormData` 呼叫 `POST /api/clothes/:id/image`，Worker 將二進位寫入 R2 並將 object key 更新至 `image_url` 欄位。  
讀取圖片時，直接用 `GET /api/clothes/:id/image` 從 R2 讀取並回傳二進位，前端用 `<img :src="'/api/clothes/'+id+'/image'">` 顯示。

**為何不用 presigned URL？** Pages Functions 不原生支援 R2 presigned URL，且 MVP 不需要 CDN 快取；直接 proxy 最簡單。

**本地模擬**：`wrangler dev` 加入 R2 binding 後，自動使用 `.wrangler/state/v3/r2/` 本地目錄模擬，無需額外設定。

### 3. BottomNav Tab 切換防止歷史堆疊

將 `<RouterLink>` 改為 `<button>` 並呼叫 `router.replace(path)`。  
`router.replace()` 取代當前歷史記錄而非推入，Tab 間切換不產生新歷史，使用者按上一頁不會在 Tab 間跳轉。  
衣物新增／編輯頁面使用 `router.push()`（預設行為），返回按鈕呼叫 `router.back()` 或 `router.push('/wardrobe')`。

### 4. acquired_date 欄位格式

格式為 6 位數字串 `yyyyMM`（例：`202503`）。  
前端以 `<input type="month">` 取值為 `yyyy-MM`，送出前轉換為 `yyyyMM`；讀取時反向轉換。  
資料庫欄位名稱從 `acquired_occasion` 改為 `acquired_date`，型別維持 `TEXT`（SQLite）。  
需執行 migration SQL：`ALTER TABLE clothes RENAME COLUMN acquired_occasion TO acquired_date`。

### 5. AppHeader 標題移除

移除 `routeTitles` 對應表及 `<span class="app-header__title">` 的動態文字繫結。  
Header 僅保留右側主題切換按鈕，左側空白。  
衣物新增／編輯頁面的返回按鈕直接在 ClothesEditView 的頂部 bar 渲染，不依賴 AppHeader。

## Risks / Trade-offs

- **DB migration 風險**：`ALTER TABLE RENAME COLUMN` 在 SQLite 3.25.0+ 才支援；Cloudflare D1 使用的 SQLite 版本已支援此語法，本地 Wrangler D1 同樣支援。  
  → Mitigation：migration 腳本在 `functions/api/initdb.ts` 或獨立 migration 檔案中管理；本地開發前先執行 migration。
- **R2 本地模擬路徑**：`.wrangler/state/v3/r2/` 不在 git 追蹤範圍，每次 `wrangler dev` 重啟資料持續存在，但需確認 `wrangler.jsonc` 的 R2 binding 名稱與 `Env` 型別宣告一致。  
  → Mitigation：在 `worker-configuration.d.ts` 補充 `R2_BUCKET: R2Bucket` 型別。
- **圖片大小限制**：Cloudflare Workers 的 request body 上限為 100MB（實際 Pages Functions 略低），MVP 不做前端驗證。  
  → 接受此風險，後續可加。

## Migration Plan

1. 執行 D1 migration：`ALTER TABLE clothes RENAME COLUMN acquired_occasion TO acquired_date`
2. 部署 Worker（新增 `PATCH`、`POST /:id/image`、`GET /:id/image` 端點）
3. 在 Cloudflare Dashboard 建立 R2 bucket `ootd-it-images` 並在 `wrangler.jsonc` 加入 binding
4. 部署前端（Vue）

**Rollback**：若需回滾，欄位可再次 RENAME 為 `acquired_occasion`；R2 bucket 資料不影響原有衣物記錄。

## Open Questions

- R2 bucket 名稱：暫定 `ootd-it-images`，確認後填入 `wrangler.jsonc`
- 每次重新上傳圖片是否要刪除舊的 R2 object？MVP 直接覆寫同一 key（`clothes/{id}/photo`），不處理刪除
