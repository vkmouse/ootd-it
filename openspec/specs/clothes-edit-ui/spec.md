## ADDED Requirements

### Requirement: 類型 SVG 圖示選擇器
衣物表單的類型欄位 SHALL 以五個 SVG 圖示橫排呈現，圖示對應上衣、褲子、鞋子、外套、配件。使用者點擊圖示後 SHALL 標示選中狀態（背景高亮、主色文字）。

#### Scenario: 橫排顯示五個類型圖示
- **WHEN** 使用者進入衣物新增或編輯頁面
- **THEN** 類型區域 SHALL 顯示五個等寬排列的 SVG 圖示按鈕，各附文字標籤（上衣、褲子、鞋子、外套、配件）

#### Scenario: 點選後高亮標示
- **WHEN** 使用者點擊其中一個類型圖示
- **THEN** 被選中的圖示 SHALL 以 `--color-secondary` 背景與 `--color-primary` 文字/圖示色呈現，其餘圖示恢復未選狀態

#### Scenario: 編輯模式預選類型
- **WHEN** 使用者進入編輯模式且衣物資料的 `category` 有值
- **THEN** 對應的類型圖示 SHALL 在頁面載入後自動呈現為選中狀態

---

### Requirement: 16 色票選擇器
衣物表單的顏色欄位 SHALL 以 16 個圓形固定色票以 **2 行 × 8 欄格狀（grid）排列**呈現，使用者點選色票後 SHALL 以主色描邊標示選中狀態。

色票定義（名稱 → hex）：
`黑 #1A1A1A`、`深灰 #4A4A4A`、`灰 #9E9E9E`、`淺灰 #CFCFCF`、`白 #F5F5F5`、`米 #F0EAD6`、`卡其 #C3B091`、`棕 #795548`、`深棕 #4E342E`、`深藍 #1A237E`、`藍 #1565C0`、`天藍 #64B5F6`、`墨綠 #1B5E20`、`紅 #C62828`、`粉 #F48FB1`、`紫 #7B1FA2`

#### Scenario: 色票以 2×8 格狀顯示
- **WHEN** 使用者進入衣物新增或編輯頁面
- **THEN** 顏色區域 SHALL 顯示 16 個圓形色塊，排列為 2 行、每行 8 個的格狀佈局（`grid-template-columns: repeat(8, 1fr)`）

#### Scenario: 點選色票後標示
- **WHEN** 使用者點擊某個色票
- **THEN** 該色票 SHALL 以 2px 的 `--color-primary` 描邊（outline）標示選中，其餘色票無描邊

#### Scenario: 再次點選取消選取
- **WHEN** 使用者點擊已選中的色票
- **THEN** 系統 SHALL 取消該色票的選中狀態，`color` 值清空

#### Scenario: 舊資料不在色票清單時不預選
- **WHEN** 使用者進入編輯模式，`color` 值不符合任何色票名稱
- **THEN** 所有色票 SHALL 呈現未選狀態

---

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

### Requirement: 滾輪式年月選擇器
入手時間欄位 SHALL 改用 `YearMonthPicker` 元件呈現，年份與月份整合於同一個容器，無 gap，無各自 border，整塊同一背景色。使用者 SHALL 能在展開後分別獨立滾動年 drum 和月 drum。年份範圍為 2000 至當年+1，月份為 01–12。

#### Scenario: 顯示當前選取的年月
- **WHEN** 使用者進入衣物表單且 `acquired_date` 有值
- **THEN** YearMonthPicker SHALL 在收合狀態顯示對應的年份與月份（如 `2024   03`）

#### Scenario: 點擊展開後可分別滾動年月
- **WHEN** 使用者點擊 YearMonthPicker（click）
- **THEN** 元件 SHALL 展開，同時顯示年 drum（左半部）和月 drum（右半部）

#### Scenario: 向上拖拉年 drum 增加年份
- **WHEN** 使用者在展開後的年 drum（左半部）向上拖拉 >= 28px
- **THEN** 年份 SHALL 增加 1，且不超過當年+1

#### Scenario: 向下拖拉年 drum 減少年份
- **WHEN** 使用者在展開後的年 drum（左半部）向下拖拉 >= 28px
- **THEN** 年份 SHALL 減少 1，且不低於 2000

#### Scenario: 向上拖拉月 drum 增加月份
- **WHEN** 使用者在展開後的月 drum（右半部）向上拖拉 >= 28px
- **THEN** 月份 SHALL 增加 1，且不超過 12

#### Scenario: 向下拖拉月 drum 減少月份
- **WHEN** 使用者在展開後的月 drum（右半部）向下拖拉 >= 28px
- **THEN** 月份 SHALL 減少 1，且不低於 1

#### Scenario: 無入手時間時顯示 placeholder
- **WHEN** 使用者進入新增模式且尚未選擇入手時間
- **THEN** YearMonthPicker SHALL 在收合狀態顯示「年」（左）和「月」（右）的淡色 placeholder

---

### Requirement: 圖片上傳互動
衣物編輯表單 SHALL 以點擊圖片預覽區（包含佔位符）的方式觸發圖片選取，隱藏原有的獨立 file input 欄位。佔位符 SHALL 顯示上傳 icon 及文字說明以暗示可點擊。圖片預覽區比例 SHALL 為 **1:1（square）**。選取後前端顯示本地預覽，送出表單時以 `multipart/form-data` 呼叫 `POST /api/clothes/:id/image`。

#### Scenario: 點擊圖片預覽區觸發選取
- **WHEN** 使用者點擊圖片預覽區（包含佔位符）
- **THEN** 系統 SHALL 觸發隱藏的 file input，開啟裝置圖片選取介面

#### Scenario: 預覽區比例為 1:1
- **WHEN** 使用者進入衣物新增或編輯頁面
- **THEN** 圖片預覽區 SHALL 呈現 1:1 square 比例

#### Scenario: 選取圖片後顯示本地預覽
- **WHEN** 使用者選取圖片
- **THEN** 圖片預覽區 SHALL 立即顯示本地預覽圖（ObjectURL），不需等待上傳

#### Scenario: 送出表單後上傳圖片
- **WHEN** 使用者送出表單且有選取新圖片
- **THEN** 前端 SHALL 呼叫 `POST /api/clothes/:id/image` 傳送圖片二進位
- **THEN** Worker SHALL 將圖片存入 R2（key: `clothes/{id}/photo`）並回傳 `{ ok: true }`

#### Scenario: 無圖片時佔位符顯示上傳 icon
- **WHEN** 衣物尚未上傳圖片（`image_url` 為 null）且未選取新圖片
- **THEN** 圖片預覽區 SHALL 顯示上傳 icon（`iconUpload`）暗示使用者可點擊上傳

#### Scenario: 不選取圖片可正常儲存
- **WHEN** 使用者在未上傳圖片的情況下儲存衣物表單
- **THEN** 系統 SHALL 成功儲存衣物，`image_url` 保持 null，不顯示錯誤

---

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

---

### Requirement: 刪除衣物按鈕
衣物編輯頁面在編輯模式 SHALL 顯示刪除按鈕，點擊後彈出 ConfirmModal 確認，使用者確認後呼叫 `DELETE /api/clothes/:id` 刪除衣物，成功後回上一頁。新增模式不顯示刪除按鈕。

#### Scenario: 編輯模式顯示刪除按鈕
- **WHEN** 使用者進入編輯模式（URL 包含衣物 id）
- **THEN** 頁面 SHALL 顯示刪除按鈕

#### Scenario: 新增模式不顯示刪除按鈕
- **WHEN** 使用者進入新增模式（URL 無衣物 id）
- **THEN** 頁面 SHALL 不顯示刪除按鈕

#### Scenario: 點擊刪除按鈕彈出確認
- **WHEN** 使用者點擊刪除按鈕
- **THEN** 頁面 SHALL 顯示 ConfirmModal，標題「刪除衣物」，訊息說明此操作不可復原

#### Scenario: 確認刪除後呼叫 API
- **WHEN** 使用者在 ConfirmModal 中點擊確認
- **THEN** 前端 SHALL 呼叫 `DELETE /api/clothes/:id`

#### Scenario: 刪除成功後回上一頁
- **WHEN** `DELETE /api/clothes/:id` 回傳成功
- **THEN** 前端 SHALL 執行 `router.back()`

---

### Requirement: 褲子尺寸制式切換
當使用者選擇 `bottoms`（褲子）類型時，尺寸區塊 SHALL 在 WheelPicker 上方顯示一個制式切換 toggle，讓使用者在「通用尺寸（XS/S/M/L/XL/XXL）」與「褲子尺寸（26–38）」之間切換。切換時 SHALL 清空當前已選尺寸。

#### Scenario: 選擇褲子類型後顯示制式 toggle
- **WHEN** 使用者選擇 `bottoms` 類型
- **THEN** 尺寸區塊 SHALL 顯示兩個可點選的 toggle 標籤：「通用」和「褲子尺寸」，預設選中「通用」

#### Scenario: 切換制式時清空已選尺寸
- **WHEN** 使用者點擊未選中的制式 toggle
- **THEN** 系統 SHALL 切換制式，清空 `form.size`，WheelPicker 顯示對應制式的選項清單

#### Scenario: 通用尺寸清單
- **WHEN** bottomsSizeType 為 `alpha`
- **THEN** 尺寸 WheelPicker 的 items SHALL 為 `['XS', 'S', 'M', 'L', 'XL', 'XXL']`

#### Scenario: 褲子尺寸清單
- **WHEN** bottomsSizeType 為 `numeric`
- **THEN** 尺寸 WheelPicker 的 items SHALL 為 `['26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '38']`

#### Scenario: 編輯模式載入時自動判斷制式
- **WHEN** 使用者進入編輯模式，`size` 值為純數字字串（如 '30'）
- **THEN** 系統 SHALL 自動將 `bottomsSizeType` 設為 `numeric`，並選中對應褲子尺寸值

#### Scenario: 非褲子類型不顯示制式 toggle
- **WHEN** 使用者選擇 `tops`、`outerwear`、`shoes` 或 `accessories` 類型
- **THEN** 尺寸區塊 SHALL 不顯示制式 toggle

---

### Requirement: 尺寸選擇改用 WheelPicker
衣物表單的尺寸欄位 SHALL 以 WheelPicker 元件取代原有的 `<select>` 下拉選單。

#### Scenario: 尺寸選項透過 WheelPicker 選取
- **WHEN** 使用者在 `showSize` 為 true 的情況下進入尺寸區塊
- **THEN** 尺寸欄位 SHALL 顯示 WheelPicker，`placeholder` 為「請選擇」

#### Scenario: 尺寸選後寫入 form.size
- **WHEN** 使用者透過 WheelPicker 選取尺寸值
- **THEN** `form.size` SHALL 即時更新為選取的字串值

---

### Requirement: WheelPicker 點擊才展開
WheelPicker（及 YearMonthPicker）SHALL 以 click（按下後放開，位移 < 28px）作為展開觸發，而非 touchstart 或 pointerdown。只有按下不算展開。

#### Scenario: 按下後放開展開
- **WHEN** 使用者在 inactive WheelPicker 上按下後放開，且位移 < 28px
- **THEN** WheelPicker SHALL 展開（isActive = true）

#### Scenario: 只按下不展開
- **WHEN** 使用者在 inactive WheelPicker 上按下但尚未放開
- **THEN** WheelPicker SHALL 保持收合狀態（isActive = false）

#### Scenario: 拖拉超過門檻不算 click
- **WHEN** 使用者在 inactive WheelPicker 上按下後拖拉 >= 28px 再放開
- **THEN** WheelPicker SHALL 保持收合狀態（isActive = false）

---

### Requirement: WheelPicker 點外部才收合
WheelPicker 移除 600ms 自動收合 timer，改為點擊元件外部（pointerdown 落點不在元件內）才收合。

#### Scenario: 點外部收合
- **WHEN** WheelPicker 為 active 且使用者在元件外部按下（pointerdown）
- **THEN** WheelPicker SHALL 收合（isActive = false）

#### Scenario: 點內部不收合
- **WHEN** WheelPicker 為 active 且使用者在元件內部按下後放開（位移 < 28px）
- **THEN** WheelPicker SHALL 保持 active 狀態

---

### Requirement: WheelPicker 拖拉門檻 28px
WheelPicker 的拖拉門檻 SHALL 為 28px，每累積 28px 才切換一格。

#### Scenario: 拖拉 >= 28px 切換一格
- **WHEN** 使用者在 active WheelPicker 向上拖拉累積 >= 28px
- **THEN** 值 SHALL 向後切換一格（index + 1），startY 重設

#### Scenario: 拖拉 < 28px 不切換
- **WHEN** 使用者拖拉距離 < 28px
- **THEN** 值 SHALL 保持不變

---

### Requirement: 儲存與刪除按鈕高度對齊輸入框
儲存按鈕與刪除衣物按鈕的高度 SHALL 與表單輸入框（`clothes-form__input`）視覺一致，padding 四邊相同（`var(--spacing-md)` = 16px）。

#### Scenario: 按鈕與輸入框高度一致
- **WHEN** 使用者看到衣物表單底部的儲存與刪除按鈕
- **THEN** 兩個按鈕的外觀高度 SHALL 與表單上方的文字輸入框（如名稱欄位）視覺一致
