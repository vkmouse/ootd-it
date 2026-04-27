## Why

`ClothesEditView`、`WardrobeView` 及其相關元件（`ClothesCard`、`WheelPicker`、`YearMonthPicker`、`NumPad`、`ConfirmModal`）目前在圓角、間距、按鈕樣式上存在明顯不一致；`ClothesCard` 的實作（1:1 圖片比例、`--radius-lg`）也與已定義的 spec（3:4、`--radius-xl`）有落差。需要以現有 design token（Filled Card 原則）為基礎做跨頁面全面統一與提升。

## What Changes

**ClothesEditView**
- 統一所有互動元素（圖片預覽、類型選擇器、尺寸 toggle、提交按鈕）圓角至 `--radius-xl`
- 圖片上傳區改為 3:4 比例，加入更明確的可點擊暗示（文字標籤 + icon）
- 類型選擇器（category-btn）加高並增加視覺回饋強度（primary 文字 + 更高背景塊）
- 色票改為 4×4 固定格狀排列，swatch 尺寸增至 36px，active ring 更清晰
- Submit 按鈕加高至 52px，`letter-spacing` 加寬，強調動作感
- Delete 按鈕改為純文字 danger 樣式（`#C62828`），移除 bg-sub 背景

**WardrobeView**
- 清單加入 `padding`，避免卡片貼邊
- 浮動新增按鈕改用 SVG icon（`icon-plus.svg`）取代文字 `＋`

**ClothesCard**
- `border-radius` 從 `--radius-lg` 統一至 `--radius-xl`
- 圖片比例從 `1:1` 修正為 `3:4`（補齊 spec 的既有要求）

## Capabilities

### New Capabilities

<!-- 無新功能，純視覺一致性改善 -->

### Modified Capabilities

- `clothes-edit-ui`: 更新 ClothesEditView 及其緊密耦合元件的視覺規格（圓角、按鈕樣式、色票排列、圖片比例）
- `wardrobe`: 更新 WardrobeView 清單 padding，修正 ClothesCard 圓角與圖片比例

## Impact

- `src/views/ClothesEditView.vue` — `<style scoped>` 全面改寫；template 局部調整
- `src/views/WardrobeView.vue` — 清單 padding、浮動按鈕 markup 改為 SVG
- `src/components/ClothesCard.vue` — 圓角、圖片比例
- `src/assets/icons/icon-plus.svg` — 新增 SVG icon 檔案
- `src/utils/icons.ts` — 新增 `iconPlus` export
- 不影響任何 API 或 JS 邏輯
