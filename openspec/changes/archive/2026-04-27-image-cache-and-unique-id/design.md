## Context

目前圖片儲存與存取架構：
- 上傳時 R2 key 固定為 `clothes/{clothesId}/photo`
- DB `image_url` 存的是 R2 key（非可公開存取的 URL）
- 前端透過 `GET /api/clothes/:id/image` 取得圖片二進位，Worker 再查 DB → 讀 R2 → 回傳
- 因 URL 對同一件衣物永不改變，無法安全加上 Cache-Control

**問題**：若加 `Cache-Control: private, max-age=86400`，使用者上傳新圖後 24 小時內瀏覽器仍會顯示舊圖（URL 沒變，快取不會失效）。

## Goals / Non-Goals

**Goals:**
- 每次上傳圖片產生獨立 imageId（UUID），使圖片 URL 隨上傳改變（cache busting）
- 新圖片端點 `GET /api/images/:imageId` 回傳 `Cache-Control: private, max-age=86400`
- DB `image_url` 改存完整相對 URL `/api/images/{imageId}`，前端直接用作 `<img src>`
- 上傳新圖時自動刪除 R2 舊物件，避免孤兒資料

**Non-Goals:**
- CDN 快取（Cache-Control 使用 `private`，不讓 CDN 快取）
- 圖片壓縮、格式轉換
- 現有舊資料自動遷移（舊 image_url 為 R2 key 格式的衣物，圖片將失效，需手動處理）

## Decisions

### 決策 1：圖片 ID 與衣物 ID 分離

**選擇**：每次上傳圖片時用 `crypto.randomUUID()` 產生新的 `imageId`，與 `clothesId` 完全無關。

**理由**：
- 同一件衣物可能被多次上傳圖片，需要每次都能讓 URL 改變
- 若 imageId 和 clothesId 綁定（例如 `{clothesId}-v2`），需維護版本計數器，複雜度高
- UUID 方案最簡單，完全解耦

**備選方案**：在 R2 key 加版本號（e.g., `clothes/{id}/photo/v{n}`） → 需要額外查詢計數器欄位，拒絕

---

### 決策 2：image_url 儲存完整相對 URL

**選擇**：`image_url` 改存 `/api/images/{imageId}`（相對 URL），前端直接用作 `<img src>`。

**理由**：
- 前端不需要再依賴衣物 ID 組裝 URL，減少耦合
- API GET /api/clothes/:id 回傳 `image_url` 後前端直接渲染
- 若將來圖片端點路徑調整，只需 migration 一次 DB

**備選方案**：image_url 繼續存 R2 key → 需要前端或後端轉換成可存取 URL，較複雜

---

### 決策 3：移除 GET /api/clothes/:id/image

**選擇**：移除舊的 `GET /api/clothes/:id/image` handler，由新的 `GET /api/images/:imageId` 取代。

**理由**：
- 新架構下已無需透過衣物 ID 查圖片，imageId 已直接存在 image_url
- 保留舊端點會造成混淆，且無法加快取（URL 結構問題依然存在）

**備選方案**：保留舊端點做相容性 → 多餘，舊端點功能已被新端點取代

---

### 決策 4：上傳新圖時刪除舊 R2 物件

**選擇**：POST handler 在寫入新物件前，先查詢 DB 取得現有 `image_url`，從 URL 解析出舊 imageId，再刪除舊 R2 物件。

**理由**：避免無限累積孤兒 R2 物件造成儲存成本增加。

**解析方式**：`image_url` 格式為 `/api/images/{imageId}`，取最後一段即為 imageId，R2 key 為 `clothes/{imageId}/photo`。

## Risks / Trade-offs

- **[舊資料失效]** → 現有衣物的 `image_url` 欄位儲存的是 R2 key（`clothes/{id}/photo`），新端點無法處理舊格式。影響：現有已有圖片的衣物在 migrate 後圖片會顯示失敗。緩解：可接受，舊資料量少；或手動一次性資料遷移（超出本次範圍）。
- **[R2 孤兒物件（極端情況）]** → 若刪除舊圖 R2 操作失敗（網路問題），DB 已更新但舊物件殘留。緩解：影響僅限儲存浪費，不影響功能；可接受。
- **[快取時間固定 86400 秒]** → 使用者若在 24 小時內同一裝置重新上傳圖片，舊 URL 的快取會失效（因 URL 改變），不受影響；新 URL 重新快取。Trade-off 合理。
