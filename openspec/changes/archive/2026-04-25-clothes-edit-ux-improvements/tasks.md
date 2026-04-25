## 1. 新增 ConfirmModal 元件

- [x] 1.1 建立 `src/components/ConfirmModal.vue`，實作 overlay + 卡片結構，props: title、message、confirmLabel、cancelLabel，emit: confirm、cancel
- [x] 1.2 點擊背景遮罩觸發 cancel emit
- [x] 1.3 套用專案視覺設計原則（filled card、無框線、無陰影）

## 2. 新增 upload icon

- [x] 2.1 準備 `icon-upload.svg` 並放置於 `src/assets/icons/`
- [x] 2.2 在 `src/utils/icons.ts` 匯出 `iconUpload`

## 3. 修改 ClothesEditView — 圖片上傳互動

- [x] 3.1 在圖片預覽區（含佔位符）加上 `@click` handler，呼叫隱藏 file input 的 `.click()`
- [x] 3.2 將 `<input type="file">` 改為 `display: none`（移除獨立可見欄位）
- [x] 3.3 佔位符顯示 `iconUpload` 取代原有 `iconClothesPlaceholder`

## 4. 修改 ClothesEditView — 選色票自動填入備註

- [x] 4.1 修改 `onColorSelect()` 函式：選色票時若 `form.color_note` 為空則填入色票名稱

## 5. 新增 DELETE API

- [x] 5.1 在 `functions/api/clothes/[id].ts` 新增 `onRequestDelete` handler
- [x] 5.2 驗證 owner，查無記錄回傳 404
- [x] 5.3 若 `image_url` 非 null，先執行 `env.IMAGES.delete(image_url)`
- [x] 5.4 執行 DB `DELETE FROM clothes WHERE id = ? AND owner_email = ?`
- [x] 5.5 回傳 `{ ok: true }`

## 6. 修改 ClothesEditView — 刪除按鈕

- [x] 6.1 引入 ConfirmModal 元件，以 `v-if` 控制顯示
- [x] 6.2 在編輯模式（`isEdit`）下顯示刪除按鈕
- [x] 6.3 點擊刪除按鈕顯示 ConfirmModal（標題「刪除衣物」，說明此操作不可復原）
- [x] 6.4 確認後呼叫 `DELETE /api/clothes/:id`，成功後執行 `router.back()`

## 7. 類型檢查

- [x] 7.1 執行 `npm run type-check` 確認零錯誤
