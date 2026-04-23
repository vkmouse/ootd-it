## ADDED Requirements

### Requirement: 衣櫥列表頁面 (Wardrobe list page)
衣橱頁面 SHALL 以 2 欄網格（grid）顯示衣物項目，每個項目以圖片優先的直向卡片呈現。空列表時 SHALL 顯示大字編輯風格的空狀態文案。

#### Scenario: 項目以 2 欄 grid 顯示
- **WHEN** 使用者導航至 `/wardrobe` 且有衣物項目
- **THEN** 系統 SHALL 以 2 欄等寬網格排列顯示所有衣物卡片

#### Scenario: 空狀態
- **WHEN** 使用者沒有任何衣物項目
- **THEN** 頁面 SHALL 顯示大字空狀態文案（例如「衣橱是空的」），居中排列，字體使用 `--font-display`

---

### Requirement: 新增衣物按鈕 (Add clothing item button)
衣櫥列表頁面 SHALL 顯示一個按鈕，用於導航至新增衣物表單。

#### Scenario: 導航至新項目表單
- **WHEN** 使用者點擊 `/wardrobe` 上的新增按鈕
- **THEN** 路由 SHALL 導航至 `/wardrobe/new`

---

### Requirement: 衣物表單 (Clothing item form)
衣物編輯頁面 SHALL 使用相同組件同時支援建立模式 (`/wardrobe/new`) 與編輯模式 (`/wardrobe/:id/edit`)。表單 SHALL 包含以下欄位：名稱 (name)、類型 (category)、顏色 (color)、顏色備註 (color_note)、尺寸 (size)、入手時間 (acquired_date, yyyyMM)、入手價格 (acquired_price)、圖片 (image, 選填)。

類型欄位 SHALL 以 SVG 圖示橫排方式呈現（取代下拉選單）。顏色欄位 SHALL 以 16 個固定色票呈現（取代文字輸入）。入手時間 SHALL 以滾輪式年月選擇器呈現（取代 type="month" input）。

#### Scenario: 類型決定尺寸選項 (上衣/外套)
- **WHEN** 使用者選擇類型為「上衣」或「外套」
- **THEN** 尺寸欄位 SHALL 顯示選項：S, M, L, XL, XXL

#### Scenario: 下著尺寸選項
- **WHEN** 使用者選擇類型為「褲子」
- **THEN** 尺寸欄位 SHALL 顯示腰圍尺寸 28–38

#### Scenario: 鞋子尺寸選項
- **WHEN** 使用者選擇類型為「鞋子」
- **THEN** 尺寸欄位 SHALL 顯示 US 尺寸 6–12 (包含半號)

#### Scenario: 配件隱藏尺寸
- **WHEN** 使用者選擇類型為「配件」
- **THEN** 尺寸欄位 SHALL 隱藏

#### Scenario: 編輯模式預填表單
- **WHEN** 使用者導航至 `/wardrobe/:id/edit`
- **THEN** 表單 SHALL 呼叫 `GET /api/clothes/:id` 並以現有資料預填所有欄位，包含 `color_note`

#### Scenario: 入手時間以 yyyyMM 格式儲存
- **WHEN** 使用者透過滾輪選擇器選擇年月
- **THEN** 系統 SHALL 向 API 發送 `acquired_date: "yyyyMM"` 格式的字串

---

### Requirement: 儲存衣物項目 (Save clothing item)
在 **建立模式** 下送出表單 SHALL 呼叫 `POST /api/clothes`。在 **編輯模式** 下送出表單 SHALL 呼叫 `PATCH /api/clothes/:id`。成功後皆 SHALL 導航回 `/wardrobe`。

#### Scenario: 成功建立
- **WHEN** 使用者在建立模式下填寫必填欄位並點擊儲存
- **THEN** 系統 SHALL 將資料 POST 至 `/api/clothes` 並重新導向至 `/wardrobe`

#### Scenario: 成功編輯
- **WHEN** 使用者在編輯模式下修改欄位並點擊儲存
- **THEN** 系統 SHALL 以更新的資料 PATCH `/api/clothes/:id` 並重新導向至 `/wardrobe`

#### Scenario: 必填欄位驗證
- **WHEN** 使用者在未填寫名稱的情況下送出表單
- **THEN** 表單 SHALL 不可送出，且 SHALL 提示名稱為必填

#### Scenario: 入手時間以 yyyyMM 格式儲存
- **WHEN** 使用者透過月份選取器選擇日期（值為 `2025-03`）
- **THEN** 系統 SHALL 向 API 發送 `acquired_date: "202503"`

---

### Requirement: 衣物卡片 (Clothing item card)
衣橱列表中的每件衣物 SHALL 以直向圖片優先卡片呈現：圖片區占卡片上方（寬高比 3:4），名稱與類型標籤在圖片下方；無照片時顯示依類型區分的純色佔位符。

#### Scenario: 圖片優先佈局
- **WHEN** 渲染衣物卡片時
- **THEN** 卡片 SHALL 先顯示寬高比 3:4 的圖片區域，下方依序顯示衣物名稱與類型標籤

#### Scenario: 有圖片時顯示照片
- **WHEN** 衣物有圖片（`image_url` 非 null）
- **THEN** 圖片區域 SHALL 顯示 `<img src="/api/clothes/{id}/image">`，cover 對齊填湋

#### Scenario: 無圖片時顯示類型色佔位符
- **WHEN** 衣物無圖片（`image_url` 為 null）
- **THEN** 圖片區域 SHALL 以對應類型的色調純色背景填充（如「上衣」用暖沙色、「褲子」用石墨色、「鞋子」用棕色等）

#### Scenario: 名稱過長截斷
- **WHEN** 衣物名稱超過 2 行時
- **THEN** 名稱文字 SHALL 在第 2 行截斷（`-webkit-line-clamp: 2`）

---

### Requirement: 衣物 REST API (Clothes REST API)
Worker SHALL 提供 REST 端點，且範圍限定於已驗證使用者的電子郵件。

#### Scenario: 列表查詢
- **WHEN** 發送 GET 請求至 `/api/clothes`
- **THEN** Worker SHALL 回傳所有 `owner_email` 符合該驗證使用者的紀錄

#### Scenario: 建立衣物
- **WHEN** 發送包含有效 JSON body 的 POST 請求至 `/api/clothes`
- **THEN** Worker SHALL 插入一筆新紀錄，包含產生的 UUID 及該驗證使用者的電子郵件作為 `owner_email`

#### Scenario: 獲取單一衣物項目
- **WHEN** 發送 GET 請求至 `/api/clothes/:id`
- **THEN** Worker SHALL 回傳符合該 id 且 `owner_email` 符合的紀錄

#### Scenario: 更新衣物項目
- **WHEN** 發送包含部分內容 JSON body 的 PATCH 請求至 `/api/clothes/:id`
- **THEN** Worker SHALL 為該驗證使用者更新對應的紀錄

---

### Requirement: 返回按鈕
衣物新增（`/wardrobe/new`）與編輯（`/wardrobe/:id/edit`）頁面，左上角 SHALL 顯示返回按鈕（使用 `icon-arrow-left` SVG icon），點擊後 SHALL 返回上一頁（`router.back()`）。

#### Scenario: 點擊返回按鈕
- **WHEN** 使用者在衣物新增或編輯頁面點擊左上角返回按鈕
- **THEN** 頁面 SHALL 使用 `router.back()` 返回 `/wardrobe`

#### Scenario: 瀏覽器上一頁可返回
- **WHEN** 使用者在衣物新增或編輯頁面按下瀏覽器上一頁（或 Android 返回鍵）
- **THEN** 頁面 SHALL 正確返回至 `/wardrobe`（因為分頁切換使用 replace，歷史紀錄棧中 `/wardrobe` 會在 `/wardrobe/new` 之前）

---

### Requirement: color_note 欄位 DB 支援
`clothes` table SHALL 包含 `color_note TEXT` 欄位，記錄使用者對顏色的自由文字備註。

#### Scenario: initdb migration 新增欄位
- **WHEN** 呼叫 `GET /api/initdb`
- **THEN** 系統 SHALL 執行 `ALTER TABLE clothes ADD COLUMN color_note TEXT`，若欄位已存在則靜默忽略錯誤

#### Scenario: POST 建立衣物時接受 color_note
- **WHEN** 呼叫 `POST /api/clothes` 並帶入 `color_note` 欄位
- **THEN** API SHALL 將 `color_note` 儲存至資料庫

#### Scenario: PATCH 更新衣物時接受 color_note
- **WHEN** 呼叫 `PATCH /api/clothes/:id` 並帶入 `color_note` 欄位
- **THEN** API SHALL 更新 `color_note` 至資料庫