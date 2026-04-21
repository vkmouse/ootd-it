## Why

目前 CSS 僅有 `main.css`（全域 reset + layout）與 `base.css`（design tokens），職責邊界不夠清晰：reset 與 tokens 混在一起，且缺少 normalize.css 做跨瀏覽器基礎。隨著應用成長，這樣的結構難以維護。

## What Changes

- 安裝 `normalize.css` 套件作為 reset 基礎
- 將 `base.css` 重新命名並重新定位：改為純 reset 層（`base.css`），引入 normalize.css 並覆寫自訂 reset
- 新增 `variables.css`，集中存放所有 CSS design tokens（取代原 `base.css` 的 token 職責），並新增 `--bottom-nav-height`、`--header-height` 兩個高度 tokens 消除硬編碼數值
- 新增 `layout.css`，存放全域容器與版面規則（`body`、`#app` 等，取代原 `main.css` 的 global/layout 部分）
- 更新 `main.css` 改為 entry point，只負責按順序 `@import` 其他三個檔案
- 更新所有元件中引用 BottomNav 高度（`52px`）與 header 高度的硬編碼數值，改用 CSS token

## Capabilities

### New Capabilities

- `css-architecture`: 重構後的三層 CSS 結構（variables → base → layout），加強可維護性

### Modified Capabilities

- `wardrobe`: `WardrobeView` 的浮動加號按鈕 `bottom` 值改用 `--bottom-nav-height` token（行為不變，只改實作細節）

## Impact

- `src/assets/base.css`：內容改為 normalize import + 自訂 reset（原 token 職責移走）
- `src/assets/variables.css`：新增檔案，承接原 `base.css` token 內容並擴充
- `src/assets/layout.css`：新增檔案，承接原 `main.css` global/layout 內容
- `src/assets/main.css`：縮減為純 `@import` 入口
- `src/components/BottomNav.vue`：height 改用 `var(--bottom-nav-height)`
- `src/components/AppHeader.vue`：height 改用 `var(--header-height)`
- `src/views/WardrobeView.vue`：浮動按鈕 `bottom` 改用 `var(--bottom-nav-height)`
- 依賴套件：新增 `normalize.css`（已 `npm install`）
