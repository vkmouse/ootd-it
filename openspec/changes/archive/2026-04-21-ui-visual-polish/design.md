## Context

目前 OOTD App 的視覺系統源自 VS Code Dark Modern 主題（`--color-primary: #0078D4`、`--color-bg-main: #313131`），搭配 `-apple-system, Segoe UI` 等系統字體。設計上並無錯誤，但對於一個以「時尚穿搭記錄」為核心的 App 而言，這套視覺語言傳達的是開發工具而非精品時尚，與應用情境不符。

視覺改版的限制（來自 copilot-instructions.md）：
- 不使用 `border`、`box-shadow`
- 不撰寫 `hover` 狀態或 `transition`
- 所有視覺 token 集中在 `src/assets/variables.css`，組件內 `<style scoped>`
- 最大寬度 480px，不實作 RWD breakpoint

## Goals / Non-Goals

**Goals:**
- 建立一套「精品時尚編輯」視覺風格，與 OOTD 應用情境一致
- 字體升級：Syne（幾何感，適合 logo 與標題）+ Noto Sans TC（中文閱讀體驗）
- 主色從 VS Code 藍改為暖銅金（`#C8A96E`），提升精品感
- 衣物列表改為 2 欄網格，圖片優先的卡片設計
- App wordmark 賦予品牌識別感

**Non-Goals:**
- 動畫或轉場效果（設計規範禁止）
- hover 狀態（設計規範禁止）
- 改變功能邏輯或資料結構
- 多語系或 i18n

## Decisions

### 1. 字體選擇：Syne + Noto Sans TC

**Syne**（Google Fonts）：幾何感強，帶有法式時裝感，適合 App wordmark「OOTD」與 `ClothesEditView` 的頁面標題。  
**Noto Sans TC**：Google 針對繁體中文優化的 sans-serif，字形優雅但不沉重，適合衣物名稱與表單 label。  
為何不用 SF Pro／Segoe UI？系統字體不可控，且無法傳達品牌個性。  
為何不用衣飾 App 常見的 Cormorant Garamond？Serif 體與 app 的 Filled Card 系統不協調。

### 2. 主色：暖銅金 `#C8A96E`（亮色 `#A07840`）

VS Code 藍在 UI 工具中有效，但在衣物 App 中缺乏溫度與個性。  
暖銅金（brass/gold tone）在時尚媒體中常見（Vogue、Net-a-Porter 等），與深色背景形成自然對比，並能與各種衣物照片互補而非競爭。  
亮色模式下降低明度至 `#A07840` 確保與白底的對比度足夠（WCAG AA）。

### 3. 背景更新：更純粹的近黑

現有 `--color-bg-main: #313131` 偏灰紫，`#191919` 更偏中性黑，照片在深背景上表現更好。  
`--color-bg-sub: #0F0F0F`（幾乎純黑）用於 header / bottom nav，製造深度層次。  
亮色模式維持 `#FFFFFF / #F4F4F0`（微暖白，避免純白的冷感）。

### 4. ClothesCard：直向圖片優先，單欄改 2 欄 grid

從使用情境出發：用戶記錄衣物的核心行為是「看到衣物照片快速辨識」。  
56px 見方的縮圖無法有效展示衣物，改為 2 欄 grid，每張卡片圖片區域佔卡片上 70% 高度（固定高 160px），name + category tag 在圖片下方。  
無照片時，佔位符以類型為種子，顯示不同的單色填充（每個類型對應不同的 `--color-secondary` 變體 tone），區分外觀。

### 5. App wordmark  

AppHeader 左側加入「OOTD」wordmark 文字，使用 Syne 字體、letter-spacing 加寬，顯示 `--color-text-main` 顏色。  
不加 SVG 商標（超出本次範圍），純文字 wordmark 足夠且易維護。

## Risks / Trade-offs

- **Google Fonts 載入延遲** → 使用 `display=swap`，避免 FOIT；字體未載入前以 sans-serif fallback 顯示，視覺不會 broken
- **暖銅金對比度** → 深色模式下 `#C8A96E` 對 `#191919` 背景的對比比率約 5.4:1，符合 WCAG AA（4.5:1）；亮色模式下 `#A07840` 對白底約 4.7:1，同樣符合
- **圖片優先卡片在無照片時的外觀** → 佔位符以純色填充（非漸層，符合 no-shadow 規範），各類型用不同色調，視覺上仍有區別
- **2 欄 grid 在長衣物名稱時的截斷** → 名稱限制為 2 行 `line-clamp: 2`，超出截斷，不影響可讀性

## Open Questions

- App 名稱 wordmark 要用 "OOTD" 還是 "ootd.it"？暫定 "OOTD"，可後續調整
