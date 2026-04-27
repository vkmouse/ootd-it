## Context

`WheelPicker.vue` 是目前 `ClothesEditView` 中所有選擇器（尺寸、年份、月份）共用的元件。目前以 `touchstart` 立刻展開、8px 拖拉門檻切換、600ms timer 自動收合，使用者反映「滑一點點就跳好幾格」且「難以控制展開時機」。

年月選擇器目前是兩個獨立 WheelPicker 並排於 `.date-picker` 容器內，有 `gap`、各自背景色，視覺上不像同一個元素。使用者希望年月是一個整體。

視覺設計原則：Filled Card — 無 border、無 shadow、不寫 hover。主題切換以 `:root` 為 dark、`body.light` 為 light。

## Goals / Non-Goals

**Goals:**
- WheelPicker 互動改為 click-to-expand（press + release = click）
- 移除 600ms 自動收合，改為 click-outside 才收合
- 拖拉門檻提高至 28px
- 新建 `YearMonthPicker.vue`：一個容器、同背景色、無 gap，兩個 drum 各自獨立滾動，共享 isActive
- 按鈕高度對齊輸入框（padding: 16px）

**Non-Goals:**
- 不支援鍵盤操作
- 不實作無限迴圈捲動
- 不支援超過 480px 的 RWD
- 不變更 API 或 DB schema
- 不重構現有 WheelPicker 以外的元件

## Decisions

### D1：指針事件模型（Pointer Events）

**決定**：使用 `pointer events`（`pointerdown`、`pointermove`、`pointerup`）取代 `touch events`，搭配 `setPointerCapture` 確保拖拉期間不丟失事件。

```
pointerdown → 記錄 startY、設定 pointerId（capture）
pointermove → 計算累積位移；若 |delta| >= 28px → 切換一格並重設 startY
pointerup   → 若累積位移 < 28px（視為 click）：
                  - 元件 inactive → 展開（isActive = true）
                  - 元件 active → 不做任何事（不收合）
              若累積位移 >= 28px → 結束拖拉
releasePointerCapture on pointerup
```

click-outside 收合：元件 mounted 時掛載 document pointerdown listener（不是 click，避免事件順序問題）；listener 檢查 `!rootEl.contains(e.target)` 且 `isActive`，則 `isActive = false`。

**替代方案考慮**：
- 保留 touch events → 無法使用 `setPointerCapture`，且 desktop 體驗差
- 使用 click event → `click` 在 `touchend` 後 300ms 觸發，可能有延遲

**理由**：Pointer Events 統一處理滑鼠與觸控，`setPointerCapture` 確保拖拉不中斷。

---

### D2：WheelPicker 展開後允許「再次 click」不收合

**決定**：pointerup 時若元件已 active，不收合（不 toggle）。唯一收合方式是點外部（document listener）。

**替代方案**：點 active 元件本身 toggle 收合 → 使用者難以分辨「拖拉結束」和「點擊」，容易誤收合。

**理由**：更可預期，符合 "click outside to dismiss" 模式。

---

### D3：YearMonthPicker 架構

**決定**：新建 `src/components/YearMonthPicker.vue`，props 為 `yearItems: string[]`、`monthItems: string[]`、`selectedYear: string`、`selectedMonth: string`，emit `update:year` 和 `update:month`。

```
[收合 inactive]
┌──────────────────────────────────┐
│  2024           03               │  ← 各置於左右半部，中間留空格
└──────────────────────────────────┘

[展開 active，220px 高]
┌──────────────────────────────────┐
│  2022        │  01               │
│  2023        │  02               │
│██ 2024 ████████ 03 ██████████████│  ← indicator 橫跨全寬
│  2025        │  04               │
│  2026        │  05               │
└──────────────────────────────────┘
```

容器：單一 `background-color: var(--color-bg-sub)`，`border-radius: var(--radius-xl)`，`overflow: hidden`，height 從 44px 到 220px，`transition: height 150ms ease`。

內部分為左右兩個 `drum-area`（各佔 50% 寬），各自顯示 5 個 slot（同 WheelPicker 的 3D perspective/rotateX 邏輯）。indicator bar 以絕對定位橫跨整行（`left: 0; right: 0`），`background-color: var(--color-secondary)`。

**拖拉獨立性**：pointerdown 時記錄 `activeDrum: 'year' | 'month'`（依 `e.clientX < halfWidth` 判斷），pointermove 時只更新對應 drum 的 localIndex。

**替代方案**：
- 修改 WheelPicker 支援雙欄模式 → 元件 API 複雜化，單一 WheelPicker 也要支援，prop 設計複雜
- 保留兩個 WheelPicker 但移除 gap → 依然有各自 overlay 層疊問題，click-outside 難以協調（兩個獨立的 document listener）

**理由**：獨立元件簡潔，props/emits 清晰，isActive 僅有一份。

---

### D4：按鈕高度對齊

**決定**：將 `.clothes-form__submit` 和 `.clothes-form__delete` 的 `padding` 從 `var(--spacing-sm) var(--spacing-md)` 改為 `var(--spacing-md)`（四邊 16px），與 `.clothes-form__input` 一致。`border-radius` 維持 `var(--radius-md)`。

**理由**：最小修改，不改變其他視覺屬性。

## Risks / Trade-offs

- [pointer capture 在部分舊版 Android WebView 不完全支援] → 測試時若有問題，可改為純 pointermove listener 不 capture，接受少量事件丟失
- [YearMonthPicker 的 click-outside document listener 若與其他 overlay 競爭] → 目前 ClothesEditView 無 overlay，風險低
- [WheelPicker 移除自動 600ms 收合後，使用者開著選擇器離開頁面] → 這是可接受的 UX，下次進入頁面時狀態會 reset
- [inactive placeholder 顯示格式：「2024   03」若年或月只有一個有值] → 只有年時顯示「2024」，只有月時顯示「03」，兩者都沒有則顯示 placeholder（例：「年   月」）
