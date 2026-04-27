## MODIFIED Requirements

### Requirement: 衣物卡片 (Clothing item card)
衣橱列表中的每件衣物 SHALL 以直向圖片優先卡片呈現：圖片區占卡片上方（**寬高比 1:1**），名稱與類型標籤在圖片下方；無照片時顯示依類型區分的純色佔位符。卡片圓角 SHALL 使用 `--radius-xl`。

#### Scenario: 圖片優先佈局
- **WHEN** 衣物項目有圖片
- **THEN** 圖片 SHALL 以 `1:1` 比例 `object-fit: cover` 顯示於卡片上方

#### Scenario: 無圖片顯示佔位符
- **WHEN** 衣物項目沒有圖片
- **THEN** 卡片上方 SHALL 顯示依類型區分的純色佔位符（`1:1` 比例）

#### Scenario: 卡片圓角使用 --radius-xl
- **WHEN** 使用者瀏覽衣物列表
- **THEN** 每張卡片（含圖片區）圓角 SHALL 為 `--radius-xl`（16px）

---

### Requirement: 衣櫥列表頁面 (Wardrobe list page)
衣橱頁面 SHALL 以 2 欄網格（grid）顯示衣物項目，每個項目以圖片優先的直向卡片呈現。清單容器 SHALL 包含水平 padding 使卡片與螢幕邊緣保持間距。空列表時 SHALL 顯示大字編輯風格的空狀態文案。

#### Scenario: 項目以 2 欄 grid 顯示
- **WHEN** 使用者導航至 `/wardrobe` 且有衣物項目
- **THEN** 系統 SHALL 以 2 欄等寬網格排列顯示所有衣物卡片

#### Scenario: 清單有水平 padding
- **WHEN** 使用者瀏覽衣物列表
- **THEN** 卡片清單 SHALL 與螢幕左右兩側保持 `--spacing-sm` 以上的間距

#### Scenario: 空狀態
- **WHEN** 使用者沒有任何衣物項目
- **THEN** 頁面 SHALL 顯示大字空狀態文案（例如「衣橱是空的」），居中排列，字體使用 `--font-display`

---

### Requirement: 新增衣物按鈕 (Add clothing item button)
衣櫥列表頁面 SHALL 顯示一個浮動按鈕，按鈕內容 SHALL 使用 SVG icon（由 `iconPlus` 提供），不得使用文字字符。

#### Scenario: 導航至新項目表單
- **WHEN** 使用者點擊浮動新增按鈕
- **THEN** 路由 SHALL 導航至 `/wardrobe/new`

#### Scenario: 按鈕使用 SVG icon
- **WHEN** 使用者瀏覽衣物列表
- **THEN** 浮動按鈕 SHALL 顯示 `iconPlus` SVG icon，而非文字字符
