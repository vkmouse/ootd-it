## Why

`NumPad` 和 `YearMonthPicker` 在日常使用中有幾個明顯的 UX 摩擦點：展開後可能被頁面截斷、點外部誤關閉、功能鍵（刪/退/確）不直觀、金額未顯示千分位、入手時間格式不易閱讀、以及與文字輸入欄位字型不一致。這些問題集中在衣物編輯表單，是使用頻率最高的互動區，值得一次性整體修正。

## What Changes

**YearMonthPicker**
- Overlay 顯示格式從 `2024   10`（置中）改為 `2024年10月`（置左）
- 未選取時顯示置左的 placeholder「年份」「月份」

**NumPad**
- 移除點外部關閉行為，改為只有按「確定」才關閉
- 展開時自動 `scrollIntoView`，避免鍵盤被頁面截斷
- 功能鍵「刪」「退」「確」改用 SVG icon（清空 / 退格 / 確認）
- 顯示列與 overlay 數字加入千分位格式化（`1000` → `1,000`）
- Overlay 與顯示列字型改為與 `clothes-form__input` 一致（`font-size-base`、`font-weight: 400`）

**WheelPicker / YearMonthPicker**
- 展開時自動 `scrollIntoView`
- Overlay 字型與 `clothes-form__input` 一致

**新增 SVG icons**
- `icon-backspace.svg`（退格）
- `icon-check.svg`（確認）
- `icon-x-circle.svg`（清空）

## Capabilities

### New Capabilities
<!-- 無新功能 -->

### Modified Capabilities

- `numpad`: 關閉行為改為只靠確定鍵；展開自動滾動；功能鍵改 icon；千分位格式；字型統一
- `year-month-picker`: overlay 格式改為「年月」中文顯示、置左；展開自動滾動；字型統一
- `wheel-picker`: 展開自動滾動；overlay 字型統一

## Impact

- `src/components/NumPad.vue` — JS 邏輯 + template + style
- `src/components/YearMonthPicker.vue` — computed + style
- `src/components/WheelPicker.vue` — JS 邏輯（scrollIntoView）+ style
- `src/assets/icons/icon-backspace.svg` — 新增
- `src/assets/icons/icon-check.svg` — 新增
- `src/assets/icons/icon-x-circle.svg` — 新增
- `src/utils/icons.ts` — 新增三個 export
- 不影響任何 API 或資料結構
