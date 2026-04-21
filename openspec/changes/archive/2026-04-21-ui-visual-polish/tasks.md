## 1. 字體與全域 CSS

- [x] 1.1 在 `index.html` 加入 Google Fonts link：Syne（weights 400, 600, 700）與 Noto Sans TC（weights 400, 500, 700），使用 `display=swap`
- [x] 1.2 在 `src/assets/variables.css` 新增字體 token：`--font-display: 'Syne', sans-serif` 與 `--font-body: 'Noto Sans TC', sans-serif`
- [x] 1.3 在 `src/assets/layout.css` 的 `body` 樣式改為 `font-family: var(--font-body)`

## 2. 色彩 Token 更新

- [x] 2.1 在 `src/assets/variables.css` 的 `:root`（深色）更新：`--color-primary: #C8A96E`、`--color-primary-hover: #B8956A`、`--color-secondary: #252520`、`--color-bg-main: #191919`、`--color-bg-sub: #0F0F0F`、`--color-text-main: #E8E4DC`、`--color-text-muted: #7A7770`
- [x] 2.2 在 `src/assets/variables.css` 的 `body.light` 更新：`--color-primary: #A07840`、`--color-primary-hover: #8C6830`、`--color-secondary: #ECEAE4`、`--color-bg-main: #FFFFFF`、`--color-bg-sub: #F4F4F0`、`--color-text-main: #1A1816`、`--color-text-muted: #888480`

## 3. AppHeader：加入 Wordmark

- [x] 3.1 在 `src/components/AppHeader.vue` template 左側加入 `<span class="app-header__wordmark">OOTD</span>`
- [x] 3.2 在 AppHeader.vue scoped style 新增 `.app-header__wordmark`：字體 `var(--font-display)`、font-size `var(--font-size-xl)`、font-weight 700、letter-spacing 0.2em、color `var(--color-text-main)`
- [x] 3.3 AppHeader 的 `justify-content` 改回 `space-between`（左側 wordmark，右側 theme btn）

## 4. ClothesCard：改為直向圖片優先卡片

- [x] 4.1 重寫 `src/components/ClothesCard.vue` template：最外層改為直向 flex column，上方 `.clothes-card__image`（高 160px），下方 `.clothes-card__body`（包含名稱與類型 tag）
- [x] 4.2 `.clothes-card__image` 高 160px、`overflow: hidden`、`border-radius: var(--radius-lg) var(--radius-lg) 0 0`，內含 `<img>` 若有圖片，否則顯示類型佔位符背景色
- [x] 4.3 新增類型佔位符色對應表：`tops: #8C6E54`（暖沙）、`bottoms: #4A4A44`（石墨）、`outerwear: #5C5040`（棕褐）、`shoes: #6B5040`（皮棕）、`accessories: #3C3C38`（深鉛）
- [x] 4.4 `.clothes-card__body`：padding `var(--spacing-sm) var(--spacing-md) var(--spacing-md)`，`border-radius: 0 0 var(--radius-lg) var(--radius-lg)`，`background-color: var(--color-bg-sub)`
- [x] 4.5 `.clothes-card__name`：字體 `var(--font-body)`，`-webkit-line-clamp: 2`，`display: -webkit-box`，`-webkit-box-orient: vertical`，`overflow: hidden`
- [x] 4.6 類型標籤：顯示 category 中文名稱，font-size `var(--font-size-sm)`、color `var(--color-primary)`

## 5. WardrobeView：改為 2 欄 Grid

- [x] 5.1 將 `.wardrobe__list` 改為 `display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm)`
- [x] 5.2 更新 `.wardrobe__empty`：字體改用 `var(--font-display)`，font-size `var(--font-size-xl)`，加入換行的副文案（「按下＋開始記錄你的穿搭吧！」）以 `var(--font-size-sm)` 的 `var(--color-text-muted)` 顯示

## 6. ClothesEditView：form 樣式精化

- [x] 6.1 `.clothes-form__label`：改為 `text-transform: uppercase`、`letter-spacing: 0.08em`、字體 `var(--font-body)` weight 500
- [x] 6.2 `.clothes-form__input`：padding 改為 `var(--spacing-md)`，border-radius 改為 `var(--radius-xl)`
