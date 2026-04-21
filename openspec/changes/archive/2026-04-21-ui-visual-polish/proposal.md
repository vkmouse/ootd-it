## Why

OOTD 是一個時尚穿搭 App，但目前視覺風格直接沿用 VS Code Dark Modern 設計系統（`#0078D4` 主色、`#313131` 背景），搭配系統預設字體，給人開發工具而非時尚記錄的感受。衣物列表以單欄條列排列，圖片區域僅 56px 見方，無法展現衣物的視覺吸引力。現在功能架構已穩定，是時候讓視覺語言對齊應用情境。

## What Changes

- **字體**：引入 Google Fonts `Syne`（標題／logo 文字，幾何感時尚）與 `Noto Sans TC`（中文內文），取代系統字體
- **色彩系統**：將主色從 VS Code 藍（`#0078D4`）改為暖銅金（`#C8A96E`），背景深色調從 `#313131` 改為更純粹的近黑（`#111111`／`#191919`），亮色調保持乾淨白灰；整體往「精品時尚編輯」靠攏
- **App 識別**：AppHeader 左側加入 App 名稱 wordmark「OOTD」，使用 Syne 字體
- **衣物列表**：WardrobeView 改為 2 欄網格（grid），卡片高度增加以充分展示圖片
- **ClothesCard**：重新設計卡片，改為直向圖片優先（圖片佔卡片上 3/4 高度），名稱與類型 tag 在圖片下方；圖片佔位符依類型顯示不同的漸層背景色
- **Empty state**：衣物為空時顯示大字編輯風格文案，而非一行小字
- **表單**：ClothesEditView 的 label 改為輕量全大寫樣式，input 欄位使用更寬鬆的 padding 與更大圓角（`--radius-xl`）

## Capabilities

### New Capabilities

（無，全為視覺實作變更）

### Modified Capabilities

- `app-shell`：AppHeader 新增 App wordmark；字體 token 改為 Syne + Noto Sans TC；色彩 token 全面更新
- `wardrobe`：衣物列表從單欄 list 改為 2 欄 grid；ClothesCard 改為圖片優先直向卡片

## Impact

- `src/assets/variables.css`：色彩、字體 token 全面更新
- `src/assets/layout.css`：body 字體宣告更新
- `index.html`：加入 Google Fonts link
- `src/components/AppHeader.vue`：新增 wordmark，調整版面
- `src/components/ClothesCard.vue`：完整重寫為直向圖片優先卡片
- `src/views/WardrobeView.vue`：list 改 grid，empty state 更新
- `src/views/ClothesEditView.vue`：form label 樣式、input padding 調整
