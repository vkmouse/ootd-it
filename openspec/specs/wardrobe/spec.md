## ADDED Requirements

### Requirement: 衣櫥列表頁面 (Wardrobe list page)
衣櫥頁面 SHALL 顯示屬於該驗證使用者的所有衣物項目，資料由 `GET /api/clothes` 獲取。

#### Scenario: 項目顯示
- **WHEN** 使用者導航至 `/wardrobe`
- **THEN** 系統 SHALL 獲取並顯示目前使用者的所有衣物項目

#### Scenario: 空狀態
- **WHEN** 使用者沒有任何衣物項目
- **THEN** 頁面 SHALL 顯示空狀態提示訊息

---

### Requirement: 新增衣物按鈕 (Add clothing item button)
衣櫥列表頁面 SHALL 顯示一個按鈕，用於導航至新增衣物表單。

#### Scenario: 導航至新項目表單
- **WHEN** 使用者點擊 `/wardrobe` 上的新增按鈕
- **THEN** 路由 SHALL 導航至 `/wardrobe/new`

---

### Requirement: 衣物表單 (Clothing item form)
衣物編輯頁面 SHALL 使用相同組件同時支援建立模式 (`/wardrobe/new`) 與編輯模式 (`/wardrobe/:id/edit`)。表單 SHALL 包含以下欄位：名稱 (name)、類型 (category)、顏色 (color)、尺寸 (size)、入手時間 (acquired_date, yyyyMM)、入手價格 (acquired_price)、圖片 (image)。

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
- **THEN** 表單 SHALL 呼叫 `GET /api/clothes/:id` 並以現有資料預填所有欄位

#### Scenario: 入手時間格式顯示
- **WHEN** 現有項目的 `acquired_date` 值為（例如 `202503`）
- **THEN** 日期輸入框 SHALL 將其顯示為 `2025-03` (input type="month")

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
衣櫥列表中的每個項目 SHALL 以卡片形式顯示，包含：圖片（或佔位符）、名稱、類型、顏色及尺寸。

#### Scenario: 卡片顯示項目詳情
- **WHEN** 衣物項目在列表中渲染時
- **THEN** 卡片 SHALL 顯示名稱、類型、顏色與尺寸

#### Scenario: 卡片顯示已上傳圖片
- **WHEN** 衣物項目擁有圖片（`image_url` 非 null）
- **THEN** 卡片 SHALL 透過 `<img src="/api/clothes/{id}/image">` 顯示圖片

#### Scenario: 無圖片時顯示佔位符
- **WHEN** 衣物項目沒有圖片（`image_url` 為 null）
- **THEN** 卡片 SHALL 顯示佔位符背景

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