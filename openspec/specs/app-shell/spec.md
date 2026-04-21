## ADDED Requirements

### Requirement: 僅限行動裝置佈局 (Mobile-only layout)
App SHALL 將最大寬度限制為 480px，並在較寬的螢幕上居中顯示。不需為桌機版建立響應式斷點 (responsive breakpoints)。

#### Scenario: 內容維持在 480px 內
- **WHEN** 在寬度大於 480px 的螢幕上開啟 App
- **THEN** 內容區域的寬度 SHALL 不超過 480px

---

### Requirement: 底部導覽列 (Bottom navigation bar)
App SHALL 顯示一個常駐的底部導覽列，包含兩個分頁：衣櫥 (Wardrobe) 與 穿搭 (Outfits)。點擊分頁時 SHALL 使用 `router.replace()` 以避免產生新的歷史紀錄。底部導覽列在衣物新增/編輯頁面（`/wardrobe/new`, `/wardrobe/:id/edit`）SHALL 隱藏。

#### Scenario: 導航至衣櫥
- **WHEN** 使用者點擊底部導覽列的「衣櫥」
- **THEN** 路由 SHALL 呼叫 `router.replace('/wardrobe')`，替換目前的歷史紀錄

#### Scenario: 導航至穿搭
- **WHEN** 使用者點擊底部導覽列的「穿搭」
- **THEN** 路由 SHALL 呼叫 `router.replace('/outfits')`，替換目前的歷史紀錄

#### Scenario: 活動分頁高亮
- **WHEN** 當前路徑為 `/wardrobe`
- **THEN** 「衣櫥」分頁在視覺上 SHALL 顯示為活動狀態 (active)

#### Scenario: 切換分頁不產生後退紀錄
- **WHEN** 使用者從「衣櫥」切換至「穿搭」並按下瀏覽器後退鍵
- **THEN** 瀏覽器 SHALL 不會導航回「衣櫥」，而是導航至開啟 App 前的頁面（若無先前紀錄則停留原處）

#### Scenario: 詳情頁面隱藏底部導覽列
- **WHEN** 使用者位於 `/wardrobe/new` 或 `/wardrobe/:id/edit`
- **THEN** 底部導覽列 SHALL 不可見

---

### Requirement: 標題列顯示頁面標題
AppHeader SHALL 左側顯示 App wordmark「OOTD」（使用 `--font-display` 字體、加寬字距），右側顯示主題切換按鈕。不顯示動態頁面標題文字。

#### Scenario: 顯示 OOTD wordmark
- **WHEN** 使用者在任何頁面（衣物新增／編輯頁除外）
- **THEN** 標題列左側 SHALL 顯示「OOTD」字樣，使用 Syne 字體

#### Scenario: 主題切換按鈕在右側
- **WHEN** 使用者在任何頁面
- **THEN** 主題切換按鈕 SHALL 顯示在標題列右側

---

### Requirement: 亮色/深色主題切換
App SHALL 在右上角提供一個按鈕用於切換亮色與深色主題。預設為深色模式。亮色模式透過在 `<body>` 加入 `light` class 啟用；移除該 class 則恢復為深色模式。

#### Scenario: 切換至亮色模式
- **WHEN** 使用者在深色模式下點擊主題切換按鈕
- **THEN** App SHALL 在 `<body>` 加入 `light` class 並將偏好設定儲存在 localStorage

#### Scenario: 切換至深色模式
- **WHEN** 使用者在亮色模式下點擊主題切換按鈕
- **THEN** App SHALL 從 `<body>` 移除 `light` class 並將偏好設定儲存在 localStorage

#### Scenario: 首次訪問預設為深色模式
- **WHEN** 使用者首次開啟 App 且無儲存的偏好設定
- **THEN** App SHALL 以深色模式顯示

#### Scenario: 重新整理後恢復偏好設定
- **WHEN** 使用者重新整理頁面
- **THEN** App SHALL 自動套用先前儲存的主題偏好

---

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

### Requirement: 填充式卡片視覺風格 (Filled Card visual style)
App SHALL 採用「填充式卡片」設計方法：介面元素透過背景顏色的深淺分層來區分，而非邊框或陰影。禁止使用落影 (drop shadows)。卡片或容器禁止使用邊框 (box borders)。

#### Scenario: 卡片使用背景填充而非邊框
- **WHEN** 渲染衣物卡片時
- **THEN** 該卡片 SHALL 具有明顯的背景顏色（例如 `--color-bg-sub`），且無可見邊框或盒陰影 (box-shadow)

---

### Requirement: 無懸停或過渡效果
本 App 僅針對觸控設計。任何互動元素 SHALL 不套用懸停狀態 (hover states)、懸停顏色變化或 CSS 過渡效果 (transitions)。

#### Scenario: 按鈕無懸停狀態
- **WHEN** 指標在桌機瀏覽器上懸停於按鈕上方
- **THEN** 按鈕的外觀 SHALL 不發生任何變化

---

### Requirement: 預設路由重新導向
App SHALL 將 `/` 重新導向至 `/wardrobe`。

#### Scenario: 根路徑重新導向
- **WHEN** 使用者導航至 `/`
- **THEN** 路由 SHALL 重新導向至 `/wardrobe`