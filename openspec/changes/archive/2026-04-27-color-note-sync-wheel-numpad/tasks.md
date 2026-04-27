## 1. color_note 追蹤邏輯

- [x] 1.1 修改 `ClothesEditView.vue` 的 `onColorSelect` 函式：將「只在空白時填入」改為「若 `color_note` 屬於任意色票名稱則覆蓋，否則保持不動」

## 2. WheelPicker 滑動保護

- [x] 2.1 修改 `WheelPicker.vue` 的 `onPointerMove`：在函式開頭加入 `if (!isActive.value) return`
- [x] 2.2 修改 `YearMonthPicker.vue` 的 `onPointerMove`：在函式開頭加入 `if (!isActive.value) return`

## 3. NumPad 元件

- [x] 3.1 新建 `src/components/NumPad.vue`，實作收合／展開兩態，props: `modelValue`, `placeholder`，emit: `update:modelValue`
- [x] 3.2 在 NumPad 中實作鍵盤佈局（4 欄 CSS Grid）：`7 8 9 刪 / 4 5 6 退 / 1 2 3 確(跨兩列) / 00 0 .`
- [x] 3.3 實作各鍵邏輯：數字附加、小數點重複保護、退格、清除全部、確認收起
- [x] 3.4 實作點擊外部自動收起（`document.addEventListener('pointerdown', ...)`）

## 4. 整合至 ClothesEditView

- [x] 4.1 在 `ClothesEditView.vue` import `NumPad` 元件
- [x] 4.2 將入手價格的 `<input type="number">` 替換為 `<NumPad>`，placeholder 設為「例：990」
- [x] 4.3 執行 `npm run type-check` 確認零錯誤
