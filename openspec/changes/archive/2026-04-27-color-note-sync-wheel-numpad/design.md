## Context

`ClothesEditView.vue` 是衣物新增／編輯頁面，包含顏色色票選擇、備註欄位、WheelPicker 年月選擇器、以及入手價格欄位。目前有三個獨立但都屬於 UX 修正的問題需要解決。

## Goals / Non-Goals

**Goals:**
- 修正 `color_note` 追蹤邏輯：允許在「目前值屬於色票名稱」時覆蓋
- 修正 WheelPicker / YearMonthPicker：未展開時禁止滑動觸發值變更
- 新增 `NumPad.vue` 元件取代入手價格的原生 `<input type="number">`

**Non-Goals:**
- 不修改色票清單本身
- 不調整 WheelPicker 的展開動畫或外觀
- NumPad 不支援負數

## Decisions

### D1：color_note 追蹤方式

**決策**：用 `COLOR_SWATCHES` 名稱陣列作為「可追蹤集合」，判斷 `color_note` 是否屬於其中；若是，允許覆蓋。

```
isAutoFilled = !color_note || COLOR_SWATCHES.some(s => s.name === color_note)
if (新選色 && isAutoFilled) color_note = 新色名
```

**備選方案**：另外維護一個 `colorNoteIsTracking: boolean`。  
**否決原因**：需要額外狀態；且「值在色票清單中」本身就是完整的追蹤條件，不需多餘旗標。

### D2：WheelPicker 滑動保護

**決策**：在 `onPointerMove` 開頭加入 `if (!isActive.value) return`。

WheelPicker 和 YearMonthPicker 的 `onPointerDown` 已正確只在 `!isActive` 時觸發展開，問題在於 `onPointerMove` 沒有相同的保護，導致未展開時滑動仍觸發 `move()`。最小修改即可修正。

### D3：NumPad 元件設計

**決策**：新建獨立的 `NumPad.vue`，行為模式與 WheelPicker 一致（collapsed/expanded 兩態），但以網格按鈕取代滾筒。

**props**：
- `modelValue: string`
- `placeholder?: string`（預設 `''`）

**emit**：`update:modelValue`

**佈局（5 列 × 4 欄，CSS Grid）**：
```
7    8    9    刪
4    5    6    退
1    2    3    確
00   0    .    （確佔兩列）
```

**關閉方式**：
1. 按「確定」鍵 → 收起
2. 點擊元件外部 → 收起（`document.addEventListener('pointerdown', ...)` 與 WheelPicker 相同做法）

**視覺**：
- Collapsed 高度 44px，展開後高 `44px（顯示列）+ 4 × 48px（按鍵列）= 236px`
- 顯示列（collapsed 時為 overlay，展開時為頂部顯示區）
- 按鍵背景 `--color-bg-sub`，功能鍵（刪、退、確）以 `--color-secondary` 區隔
- 符合 Filled Card 原則：無 border、無 shadow、無 hover

## Risks / Trade-offs

- [NumPad 小數點限制] `.` 最多只應出現一次 → Mitigation：按下 `.` 時檢查現有值是否已含 `.`，若有則忽略
- [NumPad 初始值] 從 API 載入的 `acquired_price` 是數字，需 `String()` 轉換後傳入 → Mitigation：ClothesEditView 已以 `String()` 儲存，不需額外處理
