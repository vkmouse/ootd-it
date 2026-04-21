### Requirement: CSS 三層架構
`src/assets/` SHALL 包含四個 CSS 檔案，各自職責明確：`variables.css`（tokens）、`base.css`（normalize + reset）、`layout.css`（全域版面）、`main.css`（import 入口）。

#### Scenario: 模組可獨立閱讀
- **WHEN** 開發者開啟任一 CSS 檔案
- **THEN** 該檔案 SHALL 只包含其負責層次的規則，不夾雜其他層次的內容

#### Scenario: main.css 是唯一 import 入口
- **WHEN** 應用程式啟動
- **THEN** `main.ts` SHALL 只 import `main.css`，`main.css` SHALL 按 variables → base → layout 順序 import 其餘三檔

---

### Requirement: normalize.css 基礎
`base.css` SHALL 以 `@import 'normalize.css/normalize.css'` 為第一行，確保跨瀏覽器一致的起始樣式。

#### Scenario: normalize.css 已安裝
- **WHEN** 執行 `npm install`
- **THEN** `node_modules/normalize.css/normalize.css` SHALL 存在

#### Scenario: Vite 正確解析 normalize import
- **WHEN** 執行 dev server 或 build
- **THEN** 不得出現 CSS import 解析錯誤

---

### Requirement: 高度 CSS tokens
`variables.css` SHALL 定義 `--header-height` 與 `--bottom-nav-height` 兩個 tokens。

#### Scenario: 元件使用 token 而非硬編碼
- **WHEN** `AppHeader.vue` 設定高度
- **THEN** 其高度 SHALL 使用 `var(--header-height)`，不得出現 `52px` 的硬編碼數值

#### Scenario: 浮動按鈕位置正確
- **WHEN** `WardrobeView.vue` 渲染浮動加號按鈕
- **THEN** 按鈕底部偏移 SHALL 使用 `var(--bottom-nav-height)`，不得出現 `52px` 的錯誤硬編碼（正確應為 80px）
