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
衣物表單的顏色欄位 SHALL 以 16 個圓形固定色票橫排（可換行）呈現，使用者點選色票後 SHALL 以主色描邊標示選中狀態。

色票定義（名稱 → hex）：
`黑 #1A1A1A`、`深灰 #4A4A4A`、`灰 #9E9E9E`、`淺灰 #CFCFCF`、`白 #F5F5F5`、`米 #F0EAD6`、`卡其 #C3B091`、`棕 #795548`、`深棕 #4E342E`、`深藍 #1A237E`、`藍 #1565C0`、`天藍 #64B5F6`、`墨綠 #1B5E20`、`紅 #C62828`、`粉 #F48FB1`、`紫 #7B1FA2`

#### Scenario: 色票橫排顯示
- **WHEN** 使用者進入衣物新增或編輯頁面
- **THEN** 顏色區域 SHALL 顯示 16 個圓形色塊，以 `flex-wrap` 方式排列

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

#### Scenario: 顯示備註輸入欄
- **WHEN** 使用者進入衣物新增或編輯頁面
- **THEN** 顏色區域 SHALL 在色票下方顯示 placeholder 為「備註（例：#8A8A8A、帶藍色調）」的文字輸入欄位

#### Scenario: 編輯模式預填備註
- **WHEN** 使用者進入編輯模式且 `color_note` 有值
- **THEN** 備註欄位 SHALL 顯示既有的 `color_note` 內容

---

### Requirement: 滾輪式年月選擇器
入手時間欄位 SHALL 以自製滾輪元件呈現，分為年份與月份兩個欄位，使用者可透過上下滑動（touch）或滾輪（wheel）調整數值。年份範圍為 2000 至當年+1，月份為 01-12。

#### Scenario: 顯示當前選取的年月
- **WHEN** 使用者進入衣物表單且 `acquired_date` 有值
- **THEN** 滾輪選擇器 SHALL 顯示對應的年份與月份數值

#### Scenario: 向上滑動增加數值
- **WHEN** 使用者在年份或月份欄位向上滑動（或向上滾動滾輪）
- **THEN** 對應數值 SHALL 增加 1，且不超過上限（年 = 當年+1，月 = 12）

#### Scenario: 向下滑動減少數值
- **WHEN** 使用者在年份或月份欄位向下滑動（或向下滾動滾輪）
- **THEN** 對應數值 SHALL 減少 1，且不低於下限（年 = 2000，月 = 1）

#### Scenario: 無入手時間時滾輪不顯示初始值
- **WHEN** 使用者進入新增模式且尚未選擇入手時間
- **THEN** 滾輪選擇器 SHALL 顯示預設提示（例如「年」、「月」的空狀態），或顯示當年當月作為預設值

---

### Requirement: 圖片上傳互動
衣物編輯表單 SHALL 以點擊圖片預覽區（包含佔位符）的方式觸發圖片選取，隱藏原有的獨立 file input 欄位。佔位符 SHALL 顯示上傳 icon 暗示可點擊。選取後前端顯示本地預覽，送出表單時以 `multipart/form-data` 呼叫 `POST /api/clothes/:id/image`。

#### Scenario: 點擊圖片預覽區觸發選取
- **WHEN** 使用者點擊圖片預覽區（包含佔位符）
- **THEN** 系統 SHALL 觸發隱藏的 file input，開啟裝置圖片選取介面

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

### Requirement: 選色票自動填入備註
顏色備註欄位（`color_note`）SHALL 在使用者選擇色票時，若當前 `color_note` 為空，自動填入所選色票的名稱（如「黑」、「深灰」、「淺藍」）。若 `color_note` 已有內容則不覆蓋。

#### Scenario: 備註為空時自動填入
- **WHEN** 使用者點擊某色票且 `color_note` 欄位目前為空
- **THEN** `color_note` SHALL 自動填入該色票名稱

#### Scenario: 備註有內容時不覆蓋
- **WHEN** 使用者點擊某色票且 `color_note` 欄位已有內容
- **THEN** `color_note` SHALL 保持原有內容不變

#### Scenario: 取消選取色票時不清除備註
- **WHEN** 使用者點擊已選中的色票（取消選取）
- **THEN** `color_note` SHALL 保持原有內容不變

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
