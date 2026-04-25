## Why

ClothesEditView 的圖片上傳體驗不夠直覺（獨立 file input 欄位），顏色備註需手動輸入、缺少刪除衣物功能，造成使用流程斷裂。

## What Changes

- **圖片上傳互動**：點擊圖片預覽區（含佔位符）即觸發隱藏的 file input，移除獨立的「選擇檔案」輸入欄
- **顏色備註自動填入**：選擇色票時，若 `color_note` 為空則自動填入色票名稱（如「黑」、「深灰」），使用者仍可手動覆蓋
- **刪除衣物功能**：編輯模式新增刪除按鈕，彈出確認 Modal 後呼叫 DELETE API，同步刪除資料庫記錄與 R2 圖片，成功後回上一頁
- **通用確認 Modal 元件**：新增 `ConfirmModal.vue`，支援傳入標題、訊息、按鈕文字

## Capabilities

### New Capabilities

- `confirm-modal`：通用確認對話框元件（ConfirmModal.vue），接受 title、message、confirmLabel、cancelLabel props，emit confirm/cancel 事件

### Modified Capabilities

- `clothes-edit-ui`：圖片上傳互動改為點擊圖片區觸發；選色票時若備註為空自動填入色票名稱；編輯模式新增刪除按鈕
- `clothes-image-upload`：新增 `DELETE /api/clothes/:id` 端點，刪除 DB 記錄並從 R2 移除圖片

## Impact

- `src/views/ClothesEditView.vue`：修改圖片區 template、onColorSelect 邏輯、新增刪除流程
- `src/components/ConfirmModal.vue`：新增元件
- `functions/api/clothes/[id].ts`：新增 `onRequestDelete` handler
