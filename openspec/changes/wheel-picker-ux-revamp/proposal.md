## Why

WheelPicker 目前的互動行為有幾個問題：觸碰即展開（非點擊才展開）、稍微拖拉就跳格（門檻太低）、600ms 後自動收合（非點外部才收合）；年月選擇器視覺上是兩個分離的元件（有 gap、各自背景色），不像一個整體。儲存與刪除按鈕的高度明顯低於表單輸入框，造成視覺不一致。

## What Changes

- **WheelPicker 展開觸發改為 click**：按下並放開（pointerdown + pointerup，且位移小於門檻）才算點擊，只有按下不算展開
- **WheelPicker 收合改為點外部**：移除 600ms 自動收合 timer，改為點擊元件外部才收合（document pointer listener）
- **WheelPicker 拖拉門檻提高至 28px**：每累積 28px 才切換一格，避免輕觸即跳格
- **年月選擇器合併為 YearMonthPicker**：新元件，一個容器、同一背景色、無 gap，展開後同時顯示年 drum 和月 drum，各自獨立滾動；收合時顯示 `YYYY   MM` 格式
- **儲存與刪除按鈕高度對齊輸入框**：padding 從 `8px 16px` 改為 `16px`（四邊相同，與 `clothes-form__input` 一致）

## Capabilities

### New Capabilities

- `year-month-picker`: 年月合併 Wheel 元件（YearMonthPicker.vue），單一容器、兩個獨立 drum，共享展開/收合狀態

### Modified Capabilities

- `clothes-edit-ui`: 按鈕高度對齊輸入框；年月選擇器改用 YearMonthPicker；WheelPicker 行為變更（尺寸選擇器同步受益）
- `wheel-picker`（隱含於 `clothes-edit-ui` spec）: 展開觸發、收合機制、拖拉門檻的 UX 行為變更

## Impact

- 修改 `src/components/WheelPicker.vue`：互動邏輯全面重寫（pointerdown/pointermove/pointerup、click-outside、門檻 28px）
- 新增 `src/components/YearMonthPicker.vue`：包含兩個 drum、共享 isActive 狀態、click-outside 收合
- 修改 `src/views/ClothesEditView.vue`：引入 YearMonthPicker 取代 date-picker div 內兩個 WheelPicker；按鈕 CSS 調整
- 無 API 變更、無 DB schema 變更
