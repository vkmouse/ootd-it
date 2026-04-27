## Why

目前顏色備註（`color_note`）的自動填入邏輯不完整，無法追蹤使用者連續點選色票的操作；WheelPicker 在未展開時允許滑動觸發值變更，造成誤觸；入手價格欄位使用原生 `<input type="number">`，在手機上會彈出系統鍵盤，體驗不一致。這三個問題都影響衣物新增／編輯頁面的使用流暢度。

## What Changes

- **color_note 追蹤邏輯升級**：將「只在空白時填入」改為「若 `color_note` 目前值屬於任意色票名稱，視為可追蹤狀態，允許跟著色票覆蓋；若使用者已自訂文字（不在色票清單），則不干預」
- **WheelPicker 滑動保護**：`onPointerMove` 加入 `isActive` 判斷，未展開時拒絕執行滾動邏輯；`YearMonthPicker` 同樣修正
- **新增 NumPad 數字鍵盤元件**：取代入手價格的原生 `<input type="number">`，以自製展開式數字鍵盤輸入，避免系統鍵盤彈出
  - 鍵盤佈局（4 列 × 4 欄，右欄為功能鍵）：
    - 第 1 列：`7` `8` `9` `刪（清除全部）`
    - 第 2 列：`4` `5` `6` `退（退格）`
    - 第 3 列：`1` `2` `3` `確（確認，跨兩列）`
    - 第 4 列：`00` `0` `.` （確認繼續）
  - 點擊外部區域自動收起

## Capabilities

### New Capabilities
- `numpad`: 自製展開式數字鍵盤元件，供入手價格等純數字欄位使用，不觸發系統鍵盤

### Modified Capabilities
- `clothes-edit-ui`: 顏色備註追蹤邏輯、WheelPicker 滑動保護、入手價格改用 NumPad

## Impact

- `src/components/WheelPicker.vue`：`onPointerMove` 加 `isActive` 判斷
- `src/components/YearMonthPicker.vue`：`onPointerMove` 加 `isActive` 判斷
- `src/components/NumPad.vue`：新建元件
- `src/views/ClothesEditView.vue`：`onColorSelect` 邏輯調整；入手價格欄位改用 `<NumPad>`
