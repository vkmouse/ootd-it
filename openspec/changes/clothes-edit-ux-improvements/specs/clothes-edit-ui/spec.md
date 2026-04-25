## MODIFIED Requirements

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

---

## ADDED Requirements

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
