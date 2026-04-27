## Context

目前圖片以 `clothes/{imageId}/photo` 的路徑儲存於 R2，imageId 為 UUID，所有使用者圖片混放。`image_url` 欄位存 `/api/images/{imageId}`，服務端點 `GET /api/images/:imageId` 由 imageId 直接組出 R2 key。整個系統已有 Cloudflare Access 認證中介層，每個 API 請求都可從 `context.data.email` 取得當前使用者 email。

## Goals / Non-Goals

**Goals:**
- R2 key 改為 `clothes/{ownerEmail}/{imageId}`，使每位使用者的圖片自然分組
- 變更最小化：`image_url` 欄位格式維持 `/api/images/{imageId}` 不變，不需要 DB migration
- 服務端點利用認證中介層已提供的 email 組合新 R2 key
- 移除 `initdb.ts` 中已無作用的 schema migration 程式碼

**Non-Goals:**
- 舊資料搬移（D1 與 R2 目前無資料）
- 新增其他存取控制邏輯（圖片仍為認證後即可存取自己的圖片）
- 路由結構變更（`/api/images/:imageId` 路由維持不變）

## Decisions

### 服務端點如何取得 ownerEmail？

**決策**：直接使用 `context.data.email`（認證中介層注入的當前使用者 email）。

**理由**：此 app 目前只有個人衣物，圖片永遠屬於當前登入者。不需要 DB 查詢或路由變更。若未來要支援共享圖片，再另行設計。

**排除方案**：
- 在 URL 中帶 email（如 `/api/images/{email}/{imageId}`）：引入額外路由複雜度與 URL 編碼問題，不必要。
- 從 D1 查 clothes 記錄以取得 owner_email：多一次 DB 查詢，且已有 email 不需要。

### imageId 格式是否改變？

**決策**：imageId 維持 UUID，只在 R2 key 中加入 email prefix。

**理由**：R2 key 格式改變對外部（瀏覽器快取、image_url）完全透明，切換成本最低。

## Risks / Trade-offs

- **[風險] 多使用者同名檔案**：R2 key 為 `clothes/{email}/{uuid}`，UUID 確保唯一性，無衝突風險。
- **[取捨] 圖片只有所有者能存取**：利用 `context.data.email` 意味著只有當前使用者能讀取自己的圖片，符合現有需求，但若未來要讓他人分享看圖，需要重新設計路由。
