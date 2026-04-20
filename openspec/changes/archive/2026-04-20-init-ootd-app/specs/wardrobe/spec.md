## ADDED Requirements

### Requirement: Wardrobe list page
The wardrobe page SHALL display all clothing items belonging to the authenticated user, fetched from `GET /api/clothes`.

#### Scenario: Items displayed
- **WHEN** the user navigates to `/wardrobe`
- **THEN** the system SHALL fetch and display all clothing items for the current user

#### Scenario: Empty state
- **WHEN** the user has no clothing items
- **THEN** the page SHALL display an empty state message

---

### Requirement: Add clothing item button
The wardrobe list page SHALL display a button to navigate to the new clothing item form.

#### Scenario: Navigate to new item form
- **WHEN** the user taps the add button on `/wardrobe`
- **THEN** the router SHALL navigate to `/wardrobe/new`

---

### Requirement: Clothing item form
The clothing edit page at `/wardrobe/new` SHALL provide a form with the following fields: 名稱 (name), 類型 (category), 顏色 (color), 尺寸 (size), 入手時機 (acquired_occasion), 入手價格 (acquired_price).

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

---

### Requirement: Save clothing item
Submitting the clothing form SHALL create a new record via `POST /api/clothes` and navigate back to `/wardrobe`.

#### Scenario: Successful save
- **WHEN** the user fills in the required fields and taps save
- **THEN** the system SHALL POST the data to `/api/clothes` and redirect to `/wardrobe`

#### Scenario: Required field validation
- **WHEN** the user submits the form without a name
- **THEN** the form SHALL not submit and SHALL indicate the name is required

---

### Requirement: Clothing item card
Each item in the wardrobe list SHALL be shown as a card displaying: placeholder image, name, category, color, and size.

#### Scenario: Card shows item details
- **WHEN** a clothing item is rendered in the list
- **THEN** the card SHALL display name, category, color, and size

---

### Requirement: Clothes REST API
The Worker SHALL expose REST endpoints scoped to the authenticated user's email.

#### Scenario: List clothes
- **WHEN** a GET request is made to `/api/clothes`
- **THEN** the Worker SHALL return all records WHERE owner_email matches the authenticated user

#### Scenario: Create clothes
- **WHEN** a POST request is made to `/api/clothes` with valid JSON body
- **THEN** the Worker SHALL INSERT a new record with a generated UUID and the authenticated user's email as owner_email
