## MODIFIED Requirements

### Requirement: 衣櫥列表頁面 (Wardrobe list page)
衣櫥頁面 SHALL 以 2 欄網格（grid）顯示衣物項目，每個項目以圖片優先的直向卡片呈現。空列表時 SHALL 顯示大字編輯風格的空狀態文案。

#### Scenario: 項目以 2 欄 grid 顯示
- **WHEN** 使用者導航至 `/wardrobe` 且有衣物項目
- **THEN** 系統 SHALL 以 2 欄等寬網格排列顯示所有衣物卡片

#### Scenario: 空狀態
- **WHEN** 使用者沒有任何衣物項目
- **THEN** 頁面 SHALL 顯示大字空狀態文案（例如「你的衣櫥空空如也」），居中排列，字體使用 `--font-display`

---

### Requirement: 衣物卡片 (Clothing item card)
每件衣物 SHALL 以直向圖片優先卡片顯示：圖片區佔卡片上方固定高度（160px），名稱與類型標籤在圖片下方；無照片時顯示依類型區分的純色佔位符。

#### Scenario: 圖片優先佈局
- **WHEN** 渲染衣物卡片時
- **THEN** 卡片 SHALL 先顯示 160px 高度的圖片區域，下方依序顯示衣物名稱與類型標籤

#### Scenario: 有圖片時顯示照片
- **WHEN** 衣物有圖片（`image_url` 非 null）
- **THEN** 圖片區域 SHALL 顯示 `<img src="/api/clothes/{id}/image">`，cover 對齊填滿

#### Scenario: 無圖片時顯示類型色佔位符
- **WHEN** 衣物無圖片（`image_url` 為 null）
- **THEN** 圖片區域 SHALL 以對應類型的色調純色背景填充（如「上衣」用暖沙色、「褲子」用石墨色、「鞋子」用棕色等）

#### Scenario: 名稱過長截斷
- **WHEN** 衣物名稱超過 2 行時
- **THEN** 名稱文字 SHALL 在第 2 行截斷（`-webkit-line-clamp: 2`）
