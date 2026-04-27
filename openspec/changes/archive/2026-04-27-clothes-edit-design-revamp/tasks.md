## 1. Icon 資源準備

- [x] 1.1 新增 `src/assets/icons/icon-plus.svg`（`viewBox="0 0 24 24" fill="none" stroke="currentColor"`，繪製加號路徑）
- [x] 1.2 在 `src/utils/icons.ts` 新增 `iconPlus` export

## 2. ClothesEditView 圓角統一

- [x] 2.1 將 `.clothes-form__image-preview` 的 `border-radius` 改為 `var(--radius-xl)`
- [x] 2.2 將 `.category-btn` 的 `border-radius` 改為 `var(--radius-xl)`
- [x] 2.3 將 `.size-type-btn` 的 `border-radius` 改為 `var(--radius-xl)`
- [x] 2.4 將 `.clothes-form__submit` 的 `border-radius` 改為 `var(--radius-xl)`
- [x] 2.5 將 `.clothes-form__delete` 的 `border-radius` 改為 `var(--radius-xl)`

## 3. ClothesEditView 圖片上傳區改版

- [x] 3.1 將 `.clothes-form__image-preview` 的 `aspect-ratio` 改為 `3 / 4`
- [x] 3.2 在 placeholder 中補充文字說明（例：「點擊上傳圖片」），增強可點擊視覺引導

## 4. ClothesEditView 類型選擇器強化

- [x] 4.1 `.category-btn` 加高至 `min-height: 64px`，讓 icon 與文字有更好的呼吸空間
- [x] 4.2 確認 `.category-btn--active` 以 `--color-secondary` 背景與 `--color-primary` 文字呈現

## 5. ClothesEditView 色票排列改為 4×4 Grid

- [x] 5.1 將 `.color-swatches` 改為 `display: grid; grid-template-columns: repeat(4, 1fr)`
- [x] 5.2 將 `.color-swatch` 尺寸增至 `width: 36px; height: 36px`，置中對齊
- [x] 5.3 驗證 16 顆色票精確排列為 4×4

## 6. ClothesEditView Submit / Delete 按鈕視覺層級

- [x] 6.1 `.clothes-form__submit` 高度增至 `height: 52px`，加入 `letter-spacing: 0.12em`，`font-family: var(--font-display)`
- [x] 6.2 `.clothes-form__delete` 改為純文字 danger 樣式：`background: none; color: #C62828; font-weight: 500`

## 7. ClothesCard 視覺修正

- [x] 7.1 `.clothes-card` 及 `.clothes-card__image` 的 `border-radius` 改為 `var(--radius-xl)`
- [x] 7.2 `.clothes-card__image` 的 `aspect-ratio` 改為 `3 / 4`

## 8. WardrobeView 佈局改善

- [x] 8.1 `.wardrobe__list` 加入 `padding: 0 var(--spacing-sm) var(--spacing-sm)`
- [x] 8.2 浮動新增按鈕改用 `iconPlus`（`v-html` + `<span>` icon）取代文字 `＋`

## 9. 驗收

- [x] 9.1 執行 `npm run type-check` 確認零錯誤
- [x] 9.2 在 dark mode 下視覺確認：圓角一致、色票 4×4、圖片 3:4、按鈕層次清晰、卡片比例正確
- [x] 9.3 在 light mode 下視覺確認：同上
