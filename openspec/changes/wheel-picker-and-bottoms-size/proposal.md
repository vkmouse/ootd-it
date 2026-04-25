## Why

目前「入手時間」的年月選擇器是簡單的單值顯示搭配滑動，缺乏視覺回饋，而尺寸選擇器使用 `<select>` 下拉選單，互動體驗落後。同時褲子的尺寸僅支援褲子尺寸格式（28–38），許多使用者的褲子實際上是用 S/M/L 等通用尺寸標示，導致無法準確記錄。

## What Changes

- **新增 `WheelPicker` 共用元件**：滾輪式選擇器，inactive 時只顯示當前值，active（滑動/滾輪互動）時展開呈現 5 個項目（中心 ±2）的 3D 透視滾筒動畫，600ms 無操作後自動收合。
- **入手時間改用 WheelPicker**：年份與月份各改為一個 WheelPicker 實例，取代現有的 touch/wheel 事件程式碼。
- **尺寸選擇改用 WheelPicker**：取代 `<select>` 下拉選單。
- **褲子尺寸新增制式切換**：bottoms 類型在尺寸區塊增加一個切換按鈕，讓使用者在「通用尺寸（XS/S/M/L/XL/XXL）」與「褲子尺寸（26–38）」之間切換，WheelPicker 的選項隨之改變。

## Capabilities

### New Capabilities

- `wheel-picker`: 通用 WheelPicker 元件，支援任意字串清單、3D 透視滾筒效果、inactive/active 兩種顯示狀態、touch 與 wheel 互動。

### Modified Capabilities

- `clothes-edit-ui`: 尺寸選擇器由 select 改為 WheelPicker；褲子新增制式切換；入手時間由 date-col 改為 WheelPicker。

## Impact

- 新增 `src/components/WheelPicker.vue`
- 修改 `src/views/ClothesEditView.vue`：引入 WheelPicker、新增褲子尺寸制式切換邏輯、移除舊 touch/wheel 事件 handler
- 無 API 變更、無 DB schema 變更
