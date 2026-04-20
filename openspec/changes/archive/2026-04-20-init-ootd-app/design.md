## Context

現有 `ootd-it` 只有 Vite + Vue 3 + Vue Router + Cloudflare Workers 的空架手架與 Hello World 程式碼。這份設計說明如何從零建立真正可用的應用程式，包含前端 UI、後端 API 與資料庫層。

## Goals / Non-Goals

**Goals:**
- 建立 max-width 480px 手機版 App shell（底部導覽、主題切換）
- 實作衣物 CRUD（列表、新增）透過 D1 REST API
- 整合 Cloudflare Access，本地 fallback demo@example.com
- 清除所有 Hello World 殘留程式碼

**Non-Goals:**
- 照片上傳功能（image_url 欄位保留但不實作上傳）
- 穿搭頁面的實際功能（空白頁）
- 衣物編輯（edit）與刪除（目前僅新增）
- RWD / 桌面版支援

## Decisions

### 1. CSS：手寫 Scoped CSS + CSS Variables 主題

**決定**：不引入 Tailwind 或任何 CSS 框架，改用 CSS custom properties 管理 design tokens。採用 Filled Card 設計方向：以背景色深淺層次區隔介面元素，無框線、無陰影、無 hover 動畫。

- `src/assets/base.css`：`:root` 定義 dark mode 預設 token，`body.light` override light mode token
- Token 系統涵蓋：顏色、spacing（4px 倍數）、font-size、border-radius
- 每個組件用 `<style scoped>`
- 主題切換：`document.body.classList.toggle('light')`，dark 為預設
- `localStorage` 儲存主題偏好（`'light'` 或不存在）

**捨棄 Tailwind 的理由**：手機版 App 樣式量不大，自寫 CSS 更輕薄，無 purge 設定成本。

---

### 2. 資料層：Cloudflare D1 (SQLite)

**Schema**：
```sql
CREATE TABLE clothes (
  id                TEXT PRIMARY KEY,
  owner_email       TEXT NOT NULL,
  name              TEXT NOT NULL,
  category          TEXT NOT NULL,
  color             TEXT,
  size              TEXT,
  acquired_occasion TEXT,
  acquired_price    REAL,
  image_url         TEXT,
  created_at        TEXT NOT NULL
);
```

`category` 驅動前端尺寸選項（不另設 `size_type` 欄位）：

| category | size 選項 |
|---|---|
| tops / outerwear | S, M, L, XL, XXL |
| bottoms | 28~38（腰圍） |
| shoes | 6~12（含 .5，美國尺寸） |
| accessories | 無尺寸欄位 |

---

### 3. 驗證：Cloudflare Access + Email Header

生產環境 Cloudflare Access 在 request 注入 `cf-access-authenticated-user-email` header。Worker 讀取此 header 作為 `owner_email`。

本地開發沒有 Access gateway，Worker fallback：

```
const email = request.headers.get("cf-access-authenticated-user-email")
             ?? "demo@example.com"
```

安全邊界：部署到 Cloudflare 後 Access gateway 強制驗證，Worker 不需要自行處理 JWT。

---

### 4. 路由結構

```
/              → redirect → /wardrobe
/wardrobe      → WardrobeView（衣物列表）
/wardrobe/new  → ClothesEditView（新增）
/outfits       → OutfitsView（空白）
```

---

### 5. 組件樹

```
App.vue
├── AppHeader.vue      (頁面標題 + 主題切換按鈕)
├── BottomNav.vue      (衣櫥 / 穿搭)
└── <RouterView>
    ├── WardrobeView.vue
    │   └── ClothesCard.vue × N
    ├── ClothesEditView.vue
    └── OutfitsView.vue
```

---

### 6. API 設計

Worker `server/index.ts` 以路由分派處理 `/api/clothes`：

```
GET    /api/clothes         → D1 SELECT WHERE owner_email = ?
POST   /api/clothes         → D1 INSERT
```

（GET /:id / PUT / DELETE 留空，此次不實作）

所有 API 回傳 `application/json`，錯誤統一 `{ error: string }`。

---

### 7. ID 生成

使用 `crypto.randomUUID()`（Workers Runtime 內建），不依賴第三方套件。

## Risks / Trade-offs

- **本地無 Access 保護** → 可接受，dev 環境不對外，只有 localhost
- **無衣物上傳照片** → `image_url` 保留空欄位，顯示 placeholder，日後可擴充
- **D1 無 migration 工具** → 手動在 wrangler 執行 DDL；schema 只有一張表風險低
- **category 是 free text in DB** → 前端 dropdown 限制選項，後端不做額外 validate（此次 scope 內可接受）

## Open Questions

- 穿搭頁面之後如何關聯衣物？（此次不在 scope，待後續 change 設計）
- 是否需要衣物的排序或篩選功能？（目前按 `created_at DESC`）
