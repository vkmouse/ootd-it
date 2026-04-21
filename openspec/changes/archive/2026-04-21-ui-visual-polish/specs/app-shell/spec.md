## MODIFIED Requirements

### Requirement: 設計系統 CSS 變數 (Design system CSS variables)
App SHALL 在 `src/assets/variables.css` 中使用 CSS 自定義屬性定義所有視覺標記。`:root` 定義深色模式預設值；`body.light` 覆寫亮色模式數值。

標記類別 SHALL 包含：
- **品牌顏色**: `--color-primary`（暖銅金 `#C8A96E`）, `--color-primary-hover`（同色稍深）, `--color-secondary`
- **文字與背景**: `--color-text-main`, `--color-text-muted`, `--color-bg-main`, `--color-bg-sub`
- **字體**: `--font-display`（Syne, sans-serif）, `--font-body`（'Noto Sans TC', sans-serif）
- **間距** (以 4px 為基準): `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (16px), `--spacing-lg` (24px), `--spacing-xl` (32px)
- **字體大小**: `--font-size-sm` (14px), `--font-size-base` (16px), `--font-size-lg` (18px), `--font-size-xl` (24px)
- **圓角**: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-xl` (16px)

#### Scenario: 深色模式主色為暖銅金
- **WHEN** `<body>` 上沒有 `light` class
- **THEN** `--color-primary` SHALL 解析為 `#C8A96E`
- **THEN** `--color-bg-main` SHALL 解析為 `#191919`，`--color-bg-sub` 解析為 `#0F0F0F`

#### Scenario: 亮色模式主色及背景
- **WHEN** `body.light` 處於活動狀態
- **THEN** `--color-primary` SHALL 解析為 `#A07840`
- **THEN** `--color-bg-main` SHALL 解析為 `#FFFFFF`，`--color-bg-sub` 解析為 `#F4F4F0`

---

### Requirement: 標題列顯示頁面標題
AppHeader SHALL 左側顯示 App wordmark「OOTD」（使用 `--font-display` 字體、加寬字距），右側顯示主題切換按鈕。不顯示動態頁面標題文字。

#### Scenario: 顯示 OOTD wordmark
- **WHEN** 使用者在任何頁面（衣物新增／編輯頁除外）
- **THEN** 標題列左側 SHALL 顯示「OOTD」字樣，使用 Syne 字體

#### Scenario: 主題切換按鈕在右側
- **WHEN** 使用者在任何頁面
- **THEN** 主題切換按鈕 SHALL 顯示在標題列右側
