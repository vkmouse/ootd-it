## 1. SVG Icon 資源準備

- [ ] 1.1 新增 `src/assets/icons/icon-x-circle.svg`（圓形 × 清空）
- [ ] 1.2 新增 `src/assets/icons/icon-backspace.svg`（退格箭頭）
- [ ] 1.3 新增 `src/assets/icons/icon-check.svg`（勾選確認）
- [ ] 1.4 在 `src/utils/icons.ts` 新增 `iconXCircle`、`iconBackspace`、`iconCheck` export

## 2. NumPad — 關閉行為修改

- [ ] 2.1 移除 `onOutsidePointerDown` 函式及其 `document.addEventListener` / `removeEventListener`
- [ ] 2.2 移除 `onMounted` / `onUnmounted` 中與外部點擊相關的程式碼（若這兩個生命週期鉤子只用於此，一併移除）
- [ ] 2.3 移除 `rootEl` ref（若不再需要）

## 3. NumPad — 展開自動滾動

- [ ] 3.1 在 `open()` 函式中加入 `nextTick(() => rootEl.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))`
- [ ] 3.2 確認 `import { nextTick }` 已加入或補上

## 4. NumPad — 功能鍵改 SVG icon

- [ ] 4.1 在 `<script setup>` 中 import `iconXCircle`、`iconBackspace`、`iconCheck`
- [ ] 4.2 將清空鍵 template 改為 `<span v-html="iconXCircle" class="numpad__key-icon" />`
- [ ] 4.3 將退格鍵 template 改為 `<span v-html="iconBackspace" class="numpad__key-icon" />`
- [ ] 4.4 將確定鍵 template 改為 `<span v-html="iconCheck" class="numpad__key-icon" />`
- [ ] 4.5 在 `<style>` 加入 `.numpad__key-icon` 樣式（`display: flex; width: 20px; height: 20px; ` + deep svg）

## 5. NumPad — 千分位格式化

- [ ] 5.1 新增 `formattedDisplay` computed：整數部分加逗號，保留末尾小數點及小數位
- [ ] 5.2 Overlay 顯示改為 `formattedDisplay`（無值時顯示 placeholder）
- [ ] 5.3 展開顯示列的 `numpad__display-value` 改為 `formattedDisplay`

## 6. NumPad — 字型統一

- [ ] 6.1 `.numpad__overlay-text`：`font-size` 改為 `var(--font-size-base)`，`font-weight` 改為 `500`
- [ ] 6.2 `.numpad__overlay-text--placeholder`：`font-weight` 改為 `400`
- [ ] 6.3 `.numpad__display-value`：`font-size` 改為 `var(--font-size-base)`，`font-weight` 改為 `500`

## 7. WheelPicker — 展開自動滾動與字型統一

- [ ] 7.1 在 `onPointerUp` 中展開分支（`isActive.value = true` 之後）加入 `nextTick(() => rootEl.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))`
- [ ] 7.2 確認 `nextTick` 已 import
- [ ] 7.3 `.wheel-picker__overlay-text`：`font-size` 改為 `var(--font-size-base)`，`font-weight` 改為 `500`
- [ ] 7.4 `.wheel-picker__overlay-text--placeholder`：`font-size` 改為 `var(--font-size-base)`，`font-weight` 改為 `400`

## 8. YearMonthPicker — overlay 格式與字型統一

- [ ] 8.1 修改 `overlayYearText` computed：有值時回傳 `${yearValue}年`，無值時回傳 `''`（改由 template 處理 placeholder）
- [ ] 8.2 修改 `overlayMonthText` computed：有值時回傳 `${monthValue}月`，無值時回傳 `''`
- [ ] 8.3 修改 overlay template：移除 `ym-picker__overlay-sep`，改為單一 `<span>` 組合文字或分段 span；整體靠左對齊（`justify-content: flex-start; padding-left: var(--spacing-md)`）
- [ ] 8.4 `.ym-picker__overlay`：`justify-content` 改為 `flex-start`，加入 `padding-left: var(--spacing-md)`
- [ ] 8.5 `.ym-picker__overlay-text`：`font-size` 改為 `var(--font-size-base)`，`font-weight` 改為 `500`
- [ ] 8.6 `.ym-picker__overlay-text--placeholder`：`font-size` 改為 `var(--font-size-base)`，`font-weight` 改為 `400`
- [ ] 8.7 在 `onPointerUp` 中展開分支加入 `nextTick(() => rootEl.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))`
- [ ] 8.8 確認 `nextTick` 已 import

## 9. 驗收

- [ ] 9.1 執行 `npm run type-check` 確認零錯誤
- [ ] 9.2 手動測試：NumPad 展開後點外部不收合；按確定（✓）才收合
- [ ] 9.3 手動測試：NumPad 展開後頁面自動滾動讓鍵盤可見
- [ ] 9.4 手動測試：功能鍵顯示 SVG icon（清空/退格/確認）
- [ ] 9.5 手動測試：金額 `1000` 顯示為 `1,000`；`990` 顯示為 `990`
- [ ] 9.6 手動測試：YearMonthPicker 選取 2024年10月後收合顯示 `2024年10月`，靠左對齊
- [ ] 9.7 手動測試：各元件 overlay 字型與名稱 input 視覺一致
