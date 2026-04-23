## Why

`ClothesEditView` 目前使用下拉選單選擇類型、純文字輸入顏色、原生 `type="month"` 選擇入手時間，互動體驗粗糙且不符合 App 的視覺設計語言。同時，顏色欄位缺乏結構化資料，導致後續無法統計使用者衣物顏色分佈；圖片欄位強制依賴上傳，沒有預設佔位圖。

## What Changes

- **類型選擇**：下拉選單 → 五個 SVG 圖示橫排（上衣／褲子／鞋子／外套／配件），點選後高亮標示
- **顏色選擇**：文字輸入 → 16 個固定色票圓形橫排，選中後有主色描邊標示；另加備註文字欄位（`color_note`）供使用者記錄細節（如色碼、材質色感）
- **入手時間**：原生 `type="month"` → 自製滾輪式年月選擇器（上下滑動調整，年份範圍 2000～當年+1）
- **圖片上傳**：允許不上傳圖片，無圖時顯示通用衣物輪廓 SVG 佔位圖
- **DB Schema**：`clothes` table 新增 `color_note TEXT` 欄位（透過 `initdb.ts` migration）
- **SVG Icons**：新增 `icon-pants.svg`、`icon-shoes.svg`、`icon-jacket.svg`、`icon-accessories.svg`、`icon-clothes-placeholder.svg`

## Capabilities

### New Capabilities

- `clothes-edit-ui`: 改版後的 ClothesEditView UI 互動元件（類型 SVG 選擇、色票選擇、滾輪日期、預設佔位圖）

### Modified Capabilities

- `wardrobe`: `color_note` 欄位新增至資料模型，影響衣物的建立與更新 API（clothes.ts、[id].ts）

## Impact

- `src/views/ClothesEditView.vue`：大幅改版
- `src/assets/icons/`：新增 5 個 SVG icon 檔案
- `src/utils/icons.ts`：新增對應 export
- `functions/api/clothes.ts`：POST body 支援 `color_note`
- `functions/api/clothes/[id].ts`：PATCH body 支援 `color_note`
- `functions/api/initdb.ts`：新增 `color_note` 欄位 migration
