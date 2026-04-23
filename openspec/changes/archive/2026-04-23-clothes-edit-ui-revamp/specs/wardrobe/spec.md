## MODIFIED Requirements

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

## ADDED Requirements

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
