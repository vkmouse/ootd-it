## MODIFIED Requirements

### Requirement: Clothing item form
The clothing edit page SHALL serve both create mode (`/wardrobe/new`) and edit mode (`/wardrobe/:id/edit`) using the same component. The form SHALL contain the following fields: 名稱 (name), 類型 (category), 顏色 (color), 尺寸 (size), 入手時間 (acquired_date, yyyyMM), 入手價格 (acquired_price), 圖片 (image).

#### Scenario: Category drives size options
- **WHEN** the user selects category "上衣" or "外套"
- **THEN** the size field SHALL show options: S, M, L, XL, XXL

#### Scenario: Bottoms size options
- **WHEN** the user selects category "褲子"
- **THEN** the size field SHALL show waist sizes 28–38

#### Scenario: Shoes size options
- **WHEN** the user selects category "鞋子"
- **THEN** the size field SHALL show US sizes 6–12 (including half sizes)

#### Scenario: Accessories hide size
- **WHEN** the user selects category "配件"
- **THEN** the size field SHALL be hidden

#### Scenario: Edit mode prefills form
- **WHEN** the user navigates to `/wardrobe/:id/edit`
- **THEN** the form SHALL fetch `GET /api/clothes/:id` and prefill all fields with existing data

#### Scenario: acquired_date format displayed
- **WHEN** an existing item has `acquired_date` value (e.g., `202503`)
- **THEN** the date input SHALL display it as `2025-03` (input type="month")

---

### Requirement: Save clothing item
Submitting the clothing form in **create mode** SHALL call `POST /api/clothes`. Submitting in **edit mode** SHALL call `PATCH /api/clothes/:id`. Both SHALL navigate back to `/wardrobe` on success.

#### Scenario: Successful create
- **WHEN** the user fills in the required fields and taps save in create mode
- **THEN** the system SHALL POST the data to `/api/clothes` and redirect to `/wardrobe`

#### Scenario: Successful edit
- **WHEN** the user modifies fields and taps save in edit mode
- **THEN** the system SHALL PATCH `/api/clothes/:id` with the updated data and redirect to `/wardrobe`

#### Scenario: Required field validation
- **WHEN** the user submits the form without a name
- **THEN** the form SHALL not submit and SHALL indicate the name is required

#### Scenario: acquired_date stored as yyyyMM
- **WHEN** the user picks a date via the month input (value: `2025-03`)
- **THEN** the system SHALL send `acquired_date: "202503"` to the API

---

### Requirement: Clothing item card
Each item in the wardrobe list SHALL be shown as a card displaying: image (or placeholder), name, category, color, and size.

#### Scenario: Card shows item details
- **WHEN** a clothing item is rendered in the list
- **THEN** the card SHALL display name, category, color, and size

#### Scenario: Card shows uploaded image
- **WHEN** a clothing item has an image (`image_url` is not null)
- **THEN** the card SHALL display the image via `<img src="/api/clothes/{id}/image">`

#### Scenario: Card shows placeholder when no image
- **WHEN** a clothing item has no image (`image_url` is null)
- **THEN** the card SHALL display a placeholder background

---

### Requirement: Clothes REST API
The Worker SHALL expose REST endpoints scoped to the authenticated user's email.

#### Scenario: List clothes
- **WHEN** a GET request is made to `/api/clothes`
- **THEN** the Worker SHALL return all records WHERE owner_email matches the authenticated user

#### Scenario: Create clothes
- **WHEN** a POST request is made to `/api/clothes` with valid JSON body
- **THEN** the Worker SHALL INSERT a new record with a generated UUID and the authenticated user's email as owner_email

#### Scenario: Get single clothing item
- **WHEN** a GET request is made to `/api/clothes/:id`
- **THEN** the Worker SHALL return the record matching the id and owner_email

#### Scenario: Update clothing item
- **WHEN** a PATCH request is made to `/api/clothes/:id` with a partial JSON body
- **THEN** the Worker SHALL UPDATE the matching record for the authenticated user

---

### Requirement: Add clothing item button
The wardrobe list page SHALL display a button to navigate to the new clothing item form.

#### Scenario: Navigate to new item form
- **WHEN** the user taps the add button on `/wardrobe`
- **THEN** the router SHALL navigate to `/wardrobe/new`

---

## ADDED Requirements

### Requirement: 返回按鈕
衣物新增（`/wardrobe/new`）與編輯（`/wardrobe/:id/edit`）頁面，左上角 SHALL 顯示返回按鈕（使用 `icon-arrow-left` SVG icon），點擊後 SHALL 返回上一頁（`router.back()`）。

#### Scenario: 點擊返回按鈕
- **WHEN** 使用者在衣物新增或編輯頁面點擊左上角返回按鈕
- **THEN** 頁面 SHALL 使用 `router.back()` 返回 `/wardrobe`

#### Scenario: 瀏覽器上一頁可返回
- **WHEN** 使用者在衣物新增或編輯頁面按下瀏覽器上一頁（或 Android 返回鍵）
- **THEN** 頁面 SHALL 正確返回至 `/wardrobe`（因為 Tab 切換使用 replace，歷史棧中 `/wardrobe` 在 `/wardrobe/new` 之前）

## REMOVED Requirements

### Requirement: Clothing item form（舊欄位 acquired_occasion）
**Reason**: `acquired_occasion` 欄位改為 `acquired_date`（yyyyMM 格式），舊欄位定義已由上方 MODIFIED 取代。
**Migration**: 執行 `ALTER TABLE clothes RENAME COLUMN acquired_occasion TO acquired_date`；前端欄位名稱同步更新。
