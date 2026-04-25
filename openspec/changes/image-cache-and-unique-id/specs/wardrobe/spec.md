## MODIFIED Requirements

### Requirement: 衣物卡片 (Clothing item card)
衣橱列表中的每件衣物 SHALL 以直向圖片優先卡片呈現：圖片區占卡片上方（寬高比 3:4），名稱與類型標籤在圖片下方；無照片時顯示依類型區分的純色佔位符。

#### Scenario: 圖片優先佈局
- **WHEN** 渲染衣物卡片時
- **THEN** 卡片 SHALL 先顯示寬高比 3:4 的圖片區域，下方依序顯示衣物名稱與類型標籤

#### Scenario: 有圖片時顯示照片
- **WHEN** 衣物有圖片（`image_url` 非 null）
- **THEN** 圖片區域 SHALL 顯示 `<img>` 元素，`src` 直接使用 `image_url` 欄位值（格式：`/api/images/{imageId}`），cover 對齊填滿

#### Scenario: 無圖片時顯示類型色佔位符
- **WHEN** 衣物無圖片（`image_url` 為 null）
- **THEN** 圖片區域 SHALL 以對應類型的色調純色背景填充（如「上衣」用暖沙色、「褲子」用石墨色、「鞋子」用棕色等）

#### Scenario: 名稱過長截斷
- **WHEN** 衣物名稱超過 2 行時
- **THEN** 名稱文字 SHALL 在第 2 行截斷（`-webkit-line-clamp: 2`）
