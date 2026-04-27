## MODIFIED Requirements

### Requirement: 顏色備註欄位
顏色區域 SHALL 在色票下方提供一個文字輸入欄位，對應 `color_note` 欄位，供使用者記錄自由文字（如色碼、材質色感）。此欄位不作為搜尋條件。

點選色票時，系統 SHALL 依下列規則決定是否更新 `color_note`：
1. 若 `color_note` 為空，SHALL 自動填入所選色票名稱
2. 若 `color_note` 目前值屬於任意色票名稱（即為系統自動填入的追蹤狀態），SHALL 覆蓋為新選色票名稱
3. 若 `color_note` 為使用者自訂文字（不在色票名稱清單中），SHALL 保持不動

#### Scenario: 顯示備註輸入欄
- **WHEN** 使用者進入衣物新增或編輯頁面
- **THEN** 顏色區域 SHALL 在色票下方顯示 placeholder 為「備註（例：#8A8A8A、帶藍色調）」的文字輸入欄位

#### Scenario: 編輯模式預填備註
- **WHEN** 使用者進入編輯模式且 `color_note` 有值
- **THEN** 備註欄位 SHALL 顯示既有的 `color_note` 內容

#### Scenario: 首次點選色票自動填入備註
- **WHEN** 使用者點選色票且 `color_note` 目前為空
- **THEN** `color_note` SHALL 自動設為所選色票名稱

#### Scenario: 連續點選色票時備註追蹤更新
- **WHEN** 使用者點選色票 A，備註自動設為 A；再點選色票 B，備註目前值等於 A（屬於色票名稱）
- **THEN** `color_note` SHALL 更新為 B

#### Scenario: 自訂備註不被色票覆蓋
- **WHEN** 使用者已手動修改 `color_note` 為非色票名稱的文字，再點選任意色票
- **THEN** `color_note` SHALL 保持使用者自訂的文字，不被覆蓋

---

## MODIFIED Requirements

### Requirement: 入手價格欄位
入手價格欄位 SHALL 使用 `NumPad` 元件呈現，不使用原生 `<input type="number">`，確保操作過程中不彈出系統鍵盤。

#### Scenario: 入手價格顯示
- **WHEN** 使用者進入衣物新增頁面
- **THEN** 入手價格欄位 SHALL 以 NumPad 收合狀態呈現，placeholder 為「例：990」

#### Scenario: 編輯模式預填價格
- **WHEN** 使用者進入編輯模式且 `acquired_price` 有值
- **THEN** NumPad SHALL 顯示既有的價格數值（字串形式）

#### Scenario: 輸入並確認價格
- **WHEN** 使用者展開 NumPad 並輸入數字後按確認
- **THEN** `acquired_price` 字串值 SHALL 更新，NumPad 收合
