## 1. WheelPicker — 互動邏輯重寫

- [x] 1.1 移除 `touchstart`、`touchmove`、`touchend`、`onWheel` 事件 handler 及相關 ref（`touchStartY`、`deactivateTimer`）
- [x] 1.2 新增 pointer event handler：`onPointerDown`（記錄 startY、totalDelta、pointerId，呼叫 `el.setPointerCapture`）
- [x] 1.3 新增 `onPointerMove`：累積 delta；若 `Math.abs(totalDelta) >= 28` → 呼叫 `move()` 並重設 startY（totalDelta %= 28）
- [x] 1.4 新增 `onPointerUp`：若 `Math.abs(totalDelta) < 28`（視為 click）且 `!isActive` → 展開（`syncIndex()`、`isActive = true`）；釋放 pointer capture
- [x] 1.5 新增 click-outside 收合：`onMounted` 掛載 `document.addEventListener('pointerdown', onOutsideClick)`；`onUnmounted` 移除；`onOutsideClick` 檢查 `!rootEl.contains(e.target) && isActive` → `isActive = false`
- [x] 1.6 在 template 綁定 `@pointerdown`、`@pointermove`、`@pointerup`（取代舊 touch/wheel 事件），加上 template ref（`rootEl`）
- [x] 1.7 移除原本的 `scheduleDeactivate` function 及 `deactivateTimer` 相關程式碼

## 2. YearMonthPicker — 新元件

- [x] 2.1 建立 `src/components/YearMonthPicker.vue`，props：`yearItems: string[]`、`monthItems: string[]`、`yearValue: string`（modelValue 年）、`monthValue: string`（modelValue 月），emits：`update:yearValue`、`update:monthValue`
- [x] 2.2 建立 `isActive` ref、`localYearIndex` ref、`localMonthIndex` ref；`syncIndexes()` 函式依 `yearValue`/`monthValue` 同步 index
- [x] 2.3 實作 pointer handler：`onPointerDown`（記錄 startY、totalDelta、pointerId、`activeDrum`（依 `e.offsetX < el.offsetWidth / 2` 決定 'year' | 'month'），呼叫 `setPointerCapture`）
- [x] 2.4 實作 `onPointerMove`：累積 delta；若 `Math.abs(totalDelta) >= 28` → 呼叫對應 drum 的 `moveYear()` 或 `moveMonth()`，重設 totalDelta
- [x] 2.5 實作 `onPointerUp`：若為 click（`|totalDelta| < 28`）且 `!isActive` → `syncIndexes()` + `isActive = true`；釋放 capture
- [x] 2.6 實作 click-outside：`onMounted`/`onUnmounted` 掛載 document pointerdown listener，同 WheelPicker 邏輯
- [x] 2.7 實作 `computedSlots(localIndex, items)`：回傳 offset -2 到 +2 的 slot 陣列（同 WheelPicker 的 `slotItems` 邏輯）
- [x] 2.8 實作 `slotStyle(offset)` 函式（同 WheelPicker：rotateX、opacity、fontWeight、color）
- [x] 2.9 建立 template：容器（`ym-picker`）含 indicator bar（絕對定位，橫跨全寬）、左半部年 drum（`ym-picker__drum--year`）、右半部月 drum（`ym-picker__drum--month`），各含 5 個 slot；inactive overlay 顯示 `yearValue + '   ' + monthValue` 或 placeholder
- [x] 2.10 實作 CSS：容器高度 44px（inactive）→ 220px（active），`transition: height 150ms ease`；`overflow: hidden`；`background-color: var(--color-bg-sub)`；`border-radius: var(--radius-xl)`；drum layout 使用 flex row，各佔 50%；indicator bar z-index 低於 drum slots

## 3. ClothesEditView — 整合更新

- [x] 3.1 在 `<script setup>` 中 import `YearMonthPicker`，移除 date-picker 區域對 `WheelPicker`（僅年月用途）的依賴（WheelPicker 仍保留，供尺寸欄位使用）
- [x] 3.2 將 template 中 `.date-picker` div 內的兩個 `<WheelPicker>`（年、月）替換為一個 `<YearMonthPicker>`，綁定 `yearItems`、`monthItems`、`yearValue`（selectedYear 轉 string）、`monthValue`（selectedMonth padStart）及對應 `update:yearValue`、`update:monthValue` emit handler
- [x] 3.3 移除 `.date-picker` CSS 的 `gap` 設定（YearMonthPicker 已自帶 flex 佈局）
- [x] 3.4 調整 `.clothes-form__submit` 和 `.clothes-form__delete` 的 `padding` 從 `var(--spacing-sm) var(--spacing-md)` 改為 `var(--spacing-md)`

## 4. 驗證

- [x] 4.1 執行 `npm run type-check` 確認零型別錯誤
- [ ] 4.2 瀏覽器手動測試：WheelPicker（尺寸）按下不展開、放開才展開；點外部收合；拖拉需 28px 才切換
- [ ] 4.3 手動測試：YearMonthPicker inactive 顯示正確（年月並排、placeholder）；點擊展開兩個 drum
- [ ] 4.4 手動測試：年 drum 和月 drum 分別獨立滾動，各自不影響對方
- [ ] 4.5 手動測試：儲存和刪除按鈕高度與輸入框視覺一致
- [ ] 4.6 手動測試：編輯模式載入現有年月資料後 YearMonthPicker 正確顯示初始值
