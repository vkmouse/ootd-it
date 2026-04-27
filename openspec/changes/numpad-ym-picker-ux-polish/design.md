## Context

衣物編輯表單（`ClothesEditView`）整合了三個自製互動元件：`WheelPicker`（尺寸滾輪）、`YearMonthPicker`（年月選擇）、`NumPad`（數字鍵盤）。這三個元件設計上已具備良好基礎（Filled Card 原則），但在實際使用時出現了數個可改善的 UX 細節：

- **NumPad 誤觸收合**：使用者填寫其他欄位時容易誤點外部關閉 numpad，導致輸入中斷
- **NumPad 功能鍵標籤**：「刪」「退」「確」三個字符在不同字型下渲染不一致；語義不夠清楚
- **展開截斷問題**：`NumPad`（236px）展開後如果在頁面中段，底部會超出可視區域
- **格式不一致**：overlay 文字比 input 文字大（`font-size-lg` vs `font-size-base`），視覺上感覺不像同一系統
- **入手時間可讀性**：`2024   10` 置中對齊，不易讀；數字沒有語義單位

## Goals / Non-Goals

**Goals:**
- NumPad 只能透過確定鍵關閉
- 三個展開式元件展開時自動 scroll into view
- NumPad 功能鍵改用 SVG icon（清空、退格、打勾）
- NumPad 金額顯示加千分位
- 所有 overlay 文字與 `clothes-form__input` 字型一致（`font-size-base`、`font-weight: 400`）
- YearMonthPicker overlay 改為 `2024年10月` 格式，置左對齊

**Non-Goals:**
- 不修改 WheelPicker 的 active 狀態 UI（只加 scrollIntoView）
- 不修改 NumPad 的按鍵佈局（仍為 4 欄 4 列）
- 不改動任何 API 或資料格式
- 不更動 design token

## Decisions

### 決策 1：NumPad 關閉方式
**採用**：移除 `onOutsidePointerDown` document listener，只保留 `pressConfirm` 呼叫 `close()`。  
**理由**：NumPad 展開是明確的使用者意圖，點外部（如色票、名稱欄）是繼續填表的自然操作，不應打斷金額輸入。其他 picker（WheelPicker、YearMonthPicker）保留點外部收合機制，因為它們只有滾動操作、沒有逐字輸入狀態。  
**捨棄**：加「點外部確認」邏輯 — 複雜且非預期行為。

### 決策 2：scrollIntoView 策略
**採用**：展開後在下一個 microtask（`nextTick`）呼叫 `rootEl.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })`。  
**`block: 'nearest'`** — 只在必要時滾動（若元件已在視窗內則不滾動），避免過度滾動造成跳動。  
**捨棄**：`block: 'end'` — 每次都強制置底，使用者體驗不自然。

### 決策 3：功能鍵 SVG icon
**採用**：
- 清空（刪）→ `icon-x-circle.svg`（圓形 ×）
- 退格（退）→ `icon-backspace.svg`（← 含截斷尾端）
- 確認（確）→ `icon-check.svg`（✓）
**理由**：全站已使用 SVG icon 語言，與現有系統一致；icon 意義比中文字符更直觀（尤其確認鍵 ✓ 比「確」更清楚）。  
**捨棄**：Unicode 字符（⌫、✓）— 不同字型/OS 渲染差異大。

### 決策 4：千分位格式化
**採用**：`formattedDisplay` computed，只針對整數部分加逗號，小數部分保持不變：
```
"1000"   → "1,000"
"1000.5" → "1,000.5"
"1000."  → "1,000."  （保留末尾 . 讓使用者繼續輸入小數）
```
`modelValue` 儲存/emit 仍維持無逗號原始字串。  
**捨棄**：用 `Intl.NumberFormat` — 不易處理末尾小數點的 edge case。

### 決策 5：字型統一基準
**採用**：以 `clothes-form__input` 為基準（`font-size: var(--font-size-base)`、`font-weight: 400`），所有 overlay 向下對齊。有值時 `font-weight: 500`（稍加強調但不突兀）。  
**捨棄**：把 input 向上對齊為 `font-size-lg` — 名稱欄 placeholder 字會過大。

### 決策 6：YearMonthPicker 格式
**採用**：overlay 顯示為 `2024年10月`，`justify-content: flex-start`，`padding-left: var(--spacing-md)`。  
部分選取：`2024年　月`（月未選取時顯示淡色「月」）；`　年10月`（年未選取）。  
**捨棄**：分欄顯示 — 維持原本分欄反而比整串文字更難讀。

## Risks / Trade-offs

- [NumPad 不點外部關閉] → 使用者展開後若不按「確」無法用其他方式關閉。但後面的儲存、刪除按鈕按下時 form 會 submit，這個行為可接受。
- [scrollIntoView smooth] → 在某些舊 Android WebView 不支援 smooth，會 fallback 為即時跳轉，可接受。
- [字型縮小] → overlay 文字從 `font-size-lg` 改為 `font-size-base`，視覺上稍微「安靜」，但整體更一致。
