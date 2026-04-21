## 1. 安裝依賴

- [x] 1.1 確認 `normalize.css` 已安裝（`npm install normalize.css`），驗證 `node_modules/normalize.css/normalize.css` 存在

## 2. 建立 variables.css

- [x] 2.1 新增 `src/assets/variables.css`，將 `base.css` 現有所有 CSS custom properties（`:root` dark mode 與 `body.light` light mode）搬入
- [x] 2.2 在 `variables.css` 的 `:root` 內新增 `--header-height: 52px` 與 `--bottom-nav-height: 80px`

## 3. 改寫 base.css 為 reset 層

- [x] 3.1 清空 `base.css` 原有 token 內容
- [x] 3.2 在 `base.css` 第一行加入 `@import 'normalize.css/normalize.css'`
- [x] 3.3 將 `main.css` 中的 `*` reset 規則（box-sizing、margin、padding）搬入 `base.css`

## 4. 建立 layout.css

- [x] 4.1 新增 `src/assets/layout.css`
- [x] 4.2 將 `main.css` 中的 `body` global styles 搬入 `layout.css`
- [x] 4.3 將 `main.css` 中的 `#app` 容器規則搬入 `layout.css`

## 5. 更新 main.css 為純 import 入口

- [x] 5.1 清空 `main.css` 所有規則（已搬至其他檔案）
- [x] 5.2 改為按順序 import：`@import './variables.css'`、`@import './base.css'`、`@import './layout.css'`

## 6. 更新元件使用 token

- [x] 6.1 `src/components/AppHeader.vue`：將 `.app-header` 的 `height: 52px` 改為 `height: var(--header-height)`
- [x] 6.2 `src/components/BottomNav.vue`：將 `.bottom-nav` 的 `height: 80px` 改為 `height: var(--bottom-nav-height)`
- [x] 6.3 `src/views/WardrobeView.vue`：將浮動按鈕的 `bottom: calc(52px + ...)` 改為 `bottom: calc(var(--bottom-nav-height) + var(--spacing-lg))`

## 7. 驗證

- [x] 7.1 執行 dev server，確認頁面顯示正常，無 CSS import 錯誤
- [x] 7.2 確認 AppHeader 高度、BottomNav 高度、浮動加號按鈕位置視覺正確
- [x] 7.3 確認 dark / light 主題切換仍正常運作
