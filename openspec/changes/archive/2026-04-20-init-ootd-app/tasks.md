## 1. 清理 Hello World 程式碼

- [x] 1.1 刪除 `src/components/HelloWorld.vue`、`TheWelcome.vue`、`WelcomeItem.vue` 及 `src/components/icons/` 資料夾
- [x] 1.2 刪除 `src/views/HomeView.vue`、`AboutView.vue`
- [x] 1.3 清空 `src/assets/base.css` 與 `src/assets/main.css`，改為 CSS variables 主題架構

## 2. 全域樣式與主題

- [x] 2.1 在 `src/assets/base.css` 定義 `:root` light 主題 CSS variables（背景色、前景色、primary 色、nav 色等）
- [x] 2.2 加入 `[data-theme="dark"]` 的 dark 主題 CSS variables
- [x] 2.3 在 `src/assets/main.css` 設定 reset、`body` 全域樣式、max-width 480px 容器

## 3. App Shell

- [x] 3.1 改寫 `src/App.vue`：加入 `AppHeader`、`BottomNav`、`<RouterView>` 三層結構
- [x] 3.2 建立 `src/components/AppHeader.vue`：顯示當前路由頁面 標題 + 右上角主題切換按鈕
- [x] 3.3 建立 `src/components/BottomNav.vue`：衣櫥 / 穿搞兩個 tab，active 狀態高亮
- [x] 3.4 在 `src/App.vue` 實作主題切換邏輯（讀寫 localStorage，設定 `data-theme` attribute）

## 4. 路由設定

- [x] 4.1 改寫 `src/router/index.ts`：移除舊路由，加入 `/` redirect、`/wardrobe`、`/wardrobe/new`、`/outfits`

## 5. 頁面元件

- [x] 5.1 建立 `src/views/WardrobeView.vue`：從 API 取得衣物列表，顯示 `ClothesCard` 列表，含新增按鈕
- [x] 5.2 建立 `src/components/ClothesCard.vue`：顯示衣物的 placeholder 圖、名稱、類型、顏色、尺寸
- [x] 5.3 建立 `src/views/ClothesEditView.vue`：新增衣物表單（含 category 聯動 size 選項邏輯）
- [x] 5.4 建立 `src/views/OutfitsView.vue`：空白頁面，只顯示標題

## 6. 後端 API

- [x] 6.1 在 `wrangler.jsonc` 加入 D1 binding（database_name: `ootd-it-db`，binding: `DB`）
- [x] 6.2 建立 D1 schema SQL，並透過 `wrangler d1 execute` 建立 `clothes` 資料表
- [x] 6.3 改寫 `server/index.ts`：實作 `GET /api/clothes`（依 owner_email 篩選）
- [x] 6.4 實作 `POST /api/clothes`（插入新輸錄，使用 `crypto.randomUUID()` 產生 id）
- [x] 6.5 加入 user email 解析邏輯（從 header 取得，fallback `demo@example.com`）

## 7. 前後端串接驗證

- [x] 7.1 執行 `npm run dev`，確認衣物列表頁可正常載入（空列表不報錯）
- [x] 7.2 確認新增衣物表單可成功送出並重導向至列表頁
- [x] 7.3 確認主題切換正常，重新整理後主題保持
- [x] 7.4 確認底部導覽列 active 狀態隨路由切換正確高亮
