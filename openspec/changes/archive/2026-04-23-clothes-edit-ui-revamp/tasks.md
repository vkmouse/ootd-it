## 1. SVG Icons 新增

- [x] 1.1 新增 `src/assets/icons/icon-pants.svg`（褲子圖示，viewBox="0 0 24 24" fill="none" stroke="currentColor"）
- [x] 1.2 新增 `src/assets/icons/icon-shoes.svg`（鞋子圖示）
- [x] 1.3 新增 `src/assets/icons/icon-jacket.svg`（外套圖示）
- [x] 1.4 新增 `src/assets/icons/icon-accessories.svg`（配件圖示）
- [x] 1.5 新增 `src/assets/icons/icon-clothes-placeholder.svg`（通用衣物輪廓佔位圖示）
- [x] 1.6 在 `src/utils/icons.ts` 新增以上五個 icon 的 import 與 export

## 2. DB Schema & API 更新

- [x] 2.1 修改 `functions/api/initdb.ts`，新增 `ALTER TABLE clothes ADD COLUMN color_note TEXT` migration（try/catch 忽略重複）
- [x] 2.2 修改 `functions/api/clothes.ts` POST handler，從 body 讀取 `color_note` 並寫入 DB
- [x] 2.3 修改 `functions/api/clothes/[id].ts` PATCH handler，支援 `color_note` 欄位更新

## 3. ClothesEditView — 類型 SVG 選擇器

- [x] 3.1 移除類型 `<select>` 元素，改為 `<div>` 橫排五個圖示按鈕
- [x] 3.2 各圖示按鈕顯示對應 SVG（從 icons.ts import）與文字標籤
- [x] 3.3 實作點選後切換 `form.category` 的邏輯，並套用選中樣式（`--color-secondary` 背景、`--color-primary` 圖示與文字色）
- [x] 3.4 編輯模式下載入資料後，依 `data.category` 值正確呈現選中狀態

## 4. ClothesEditView — 16 色票選擇器

- [x] 4.1 定義 16 個色票常數陣列（名稱 + hex）於 `<script setup>`
- [x] 4.2 渲染 16 個圓形色塊按鈕，使用 `flex-wrap` 排列
- [x] 4.3 實作點選色票邏輯：儲存色票名稱至 `form.color`，再次點選同色票則清空
- [x] 4.4 選中色票以 2px `--color-primary` outline 標示
- [x] 4.5 編輯模式下，若 `data.color` 符合色票名稱則預選；否則不預選
- [x] 4.6 在色票下方新增 `color_note` 備註文字輸入欄位（placeholder：「備註（例：#8A8A8A、帶藍色調）」）

## 5. ClothesEditView — 滾輪年月選擇器

- [x] 5.1 新增年份與月份的 `ref` 狀態（`selectedYear`, `selectedMonth`），預設值為當年當月
- [x] 5.2 實作滾輪選擇器 UI：年份欄與月份欄，各顯示當前值
- [x] 5.3 實作 `@wheel` 事件：滾上 +1、滾下 -1，年份限制 2000～當年+1，月份限制 1～12
- [x] 5.4 實作 `@touchstart` / `@touchmove` / `@touchend` 事件：Y 軸位移超過 10px 才觸發，上滑 +1、下滑 -1
- [x] 5.5 將年月組合為 `yyyyMM` 格式，在 `submit()` 時傳入 `acquired_date`
- [x] 5.6 編輯模式下，從 `data.acquired_date`（yyyyMM 格式）解析並預填年月

## 6. ClothesEditView — 圖片佔位圖

- [x] 6.1 將現有的 `<div class="clothes-form__preview-placeholder">` 改為顯示 `icon-clothes-placeholder.svg`（v-html 方式渲染）
- [x] 6.2 無預覽圖（`previewUrl` 為 null）且無既有圖片（`existingImageUrl` 為 null）時，顯示佔位 SVG

## 7. ClothesEditView — form 資料整合

- [x] 7.1 在 `form` ref 中新增 `color_note` 欄位
- [x] 7.2 `submit()` 函式的 body 物件新增 `color_note` 欄位
- [x] 7.3 編輯模式 `onMounted` 時，從 API 回應讀取 `color_note` 並預填至 `form.color_note`

## 8. 樣式調整

- [x] 8.1 新增類型圖示選擇器的 scoped CSS（橫排等寬、選中狀態背景與文字色）
- [x] 8.2 新增色票容器的 scoped CSS（圓形色塊、flex-wrap、選中 outline）
- [x] 8.3 新增滾輪選擇器的 scoped CSS（兩欄並排、文字居中、適當高度）
- [x] 8.4 新增佔位 SVG 的 scoped CSS（置中、適當大小、使用 `--color-text-muted` 色）
