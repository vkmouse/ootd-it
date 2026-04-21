## ADDED Requirements

### Requirement: Pages Functions API 端點
系統 SHALL 在 `functions/api/` 目錄以 Pages Functions 格式提供所有既有 API 端點，每個端點以獨立檔案實作，透過 file-based routing 對應 URL 路徑。

#### Scenario: initdb 端點可用
- **WHEN** 客戶端發送 `GET /api/initdb`
- **THEN** Pages Function `functions/api/initdb.ts` 的 `onRequestGet` handler 執行 D1 建表指令並回傳 `{ ok: true }` JSON

#### Scenario: clothes GET 端點可用
- **WHEN** 客戶端發送 `GET /api/clothes`
- **THEN** Pages Function `functions/api/clothes.ts` 的 `onRequestGet` handler 查詢 D1 並回傳該使用者的衣物列表 JSON

#### Scenario: clothes POST 端點可用
- **WHEN** 客戶端發送 `POST /api/clothes` 並附帶衣物 JSON body
- **THEN** Pages Function `functions/api/clothes.ts` 的 `onRequestPost` handler 寫入 D1 並回傳新衣物資料 JSON

### Requirement: Pages 設定與部署
系統 SHALL 使用 `pages_build_output_dir` 取代 `main` 作為 wrangler 配置，以支援 Pages deployment。

#### Scenario: wrangler.jsonc 格式正確
- **WHEN** 執行 `wrangler pages deploy`
- **THEN** wrangler 讀取 `pages_build_output_dir: "./dist"` 並成功部署靜態資源與 Functions

#### Scenario: 本地開發伺服器正常啟動
- **WHEN** 執行 `npm run dev:full`
- **THEN** Vite dev server 在 `:10000` 啟動，`wrangler pages dev --proxy 10000` 在 `:10001` 啟動並代理靜態資源與注入 Functions runtime
