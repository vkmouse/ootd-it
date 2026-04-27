## MODIFIED Requirements

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

### Requirement: 圖片上傳互動
衣物編輯表單 SHALL 以點擊圖片預覽區（包含佔位符）的方式觸發圖片選取，隱藏原有的獨立 file input 欄位。佔位符 SHALL 顯示上傳 icon 及文字說明以暗示可點擊。圖片預覽區比例 SHALL 為 **1:1（square）**。選取後前端顯示本地預覽，送出表單時以 `multipart/form-data` 呼叫 `POST /api/clothes/:id/image`。

#### Scenario: 點擊圖片預覽區觸發選取
- **WHEN** 使用者點擊圖片預覽區（包含佔位符）
- **THEN** 系統 SHALL 觸發隱藏的 file input，開啟裝置圖片選取介面

#### Scenario: 預覽區比例為 1:1
- **WHEN** 使用者進入衣物新增或編輯頁面
- **THEN** 圖片預覽區 SHALL 呈現 1:1 square 比例
