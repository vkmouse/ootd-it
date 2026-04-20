## Why

ootd-it 是一個個人穿搭管理 App，讓使用者能記錄衣櫥中的衣物並瀏覽穿搭。現有程式碼只有 Vue 3 Hello World 架手架，需要從零建立真正的應用程式。

## What Changes

- 移除所有 Hello World 程式碼（HomeView、AboutView、WelcomeItem、TheWelcome、HelloWorld 等）
- 建立手機版 UI 框架（max-width 480px，無 RWD）
- 加入底部導覽列（衣櫥 / 穿搭兩個頁面）
- 加入右上角 Light/Dark 主題切換按鈕（預設 Dark mode）
- 建立 Filled Card 設計系統：以背景色深淺層次區隔介面元素，無框線、無陰影、無 hover 動畫
- 實作衣櫥頁面：列出所有衣物，含新增按鈕
- 實作衣物編輯頁面：填入名稱、類型、顏色、尺寸（由類型驅動選項）、入手時機、入手價格
- 實作穿搭頁面（空白，僅顯示標題）
- 建立 Cloudflare D1 `clothes` 資料表並介接 REST API
- 加入 Cloudflare Access 驗證，本地開發 fallback 至 `demo@example.com`

## Capabilities

### New Capabilities

- `app-shell`: 應用程式外殼——底部導覽列、主題切換、max-width 480px 布局
- `wardrobe`: 衣櫥功能——衣物列表、新增、編輯表單，透過 D1 API 持久化
- `outfits`: 穿搭頁面——目前空白，僅顯示標題
- `auth`: Cloudflare Access 驗證整合，本地使用 demo user

### Modified Capabilities

（無，這是全新建立）

## Impact

- `src/` 下所有 Hello World 組件與頁面將被移除
- `src/router/index.ts` 路由全面改寫
- `server/index.ts` 加入 D1 REST API handler
- `wrangler.jsonc` 加入 D1 binding
- 新增 `src/assets/base.css`：完整 CSS design token 系統（顏色、間距、字體大小、圓角），`:root` 為 dark mode 預設，`body.light` 切換 light mode
