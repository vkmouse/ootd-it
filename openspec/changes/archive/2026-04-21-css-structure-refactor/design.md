## Context

目前 `src/assets/` 只有兩個 CSS 檔案：`base.css`（design tokens）與 `main.css`（reset + global layout）。缺乏跨瀏覽器 normalize 基礎，且 token 管理、reset、layout 的職責混合在一起，難以獨立維護或替換。

## Goals / Non-Goals

**Goals:**
- 安裝 `normalize.css` 作為跨瀏覽器 CSS 基礎
- 建立三層清晰分離：tokens（variables.css）→ reset（base.css）→ layout（layout.css）
- 以 CSS token 取代元件中的硬編碼高度數值
- `main.css` 縮減為純 import 入口，便於未來增減層次

**Non-Goals:**
- 不調整現有 design token 數值（顏色、間距等保持不變）
- 不新增新的 visual token（例如 typography scale 擴充）
- 不修改任何元件外觀

## Decisions

### D1: 檔案命名與職責

| 檔案 | 職責 |
|------|------|
| `variables.css` | 所有 CSS custom properties（`:root`、`body.light`） |
| `base.css` | `@import normalize.css` + 自訂 reset（`*`, `body`） |
| `layout.css` | `#app` 容器、全域版面規則 |
| `main.css` | 純 entry point，按順序 import 以上三檔 |

**理由**：`variables` 命名比 `tokens` 更貼近原生 CSS 術語；`base` 語義為「最底層樣式基礎」，與 normalize+reset 的定位吻合；`layout` 語義清晰，只放結構性規則。

### D2: import 順序

```css
/* main.css */
@import './variables.css';  /* 1. tokens 優先，後續可用 */
@import './base.css';       /* 2. reset，消除瀏覽器差異 */
@import './layout.css';     /* 3. 版面，依賴上兩層 */
```

normalize.css 在 `base.css` 內部 import，確保元件 scoped style 能直接使用 tokens。

### D3: 高度 tokens

新增兩個 token 取代硬編碼：

```css
--header-height: 52px;
--bottom-nav-height: 80px;
```

**理由**：`WardrobeView` 浮動按鈕目前用 `bottom: calc(52px + ...)` 參照 BottomNav 高度卻是錯誤數值（52px 其實是 AppHeader 高度，BottomNav 是 80px）。提取 token 同時修正這個 bug，且未來調整高度只需改一個地方。

## Risks / Trade-offs

- **[風險] import normalize.css ESM 路徑**：normalize.css 安裝於 node_modules，需使用 `normalize.css/normalize.css` 路徑。Vite 可直接處理，但需確認路徑正確。→ 緩解：寫入後執行 dev server 驗證。
- **[Trade-off] base.css 重命名職責**：原 `base.css` 是 tokens，現在改為 reset。任何直接引用 `base.css` 的地方（若有）需改為引用 `variables.css`。→ 緩解：task 中明確列出需要確認的引用點。

## Migration Plan

1. 建立 `variables.css`（原 `base.css` 內容搬移，加入新 height tokens）
2. 改寫 `base.css`（清空 tokens，改為 normalize import + reset）
3. 建立 `layout.css`（從 `main.css` 拆出 `body`、`#app` 規則）
4. 更新 `main.css`（改為純 import 入口）
5. 更新元件中硬編碼高度數值

Rollback：git revert 即可，無 DB 或 API 變動。
