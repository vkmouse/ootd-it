## Context

`ClothesEditView.vue` 目前使用簡單的 `date-col` div 搭配 inline touch/wheel handler 實作年月選擇，共有 6 個 handler function（yearTouchStart、yearTouchMove、monthTouchStart、monthTouchMove、yearWheel、monthWheel）。尺寸選擇使用原生 `<select>` 下拉選單，體驗與整體視覺不統一。

視覺設計原則：以填滿背景色區隔層次、不使用 border/shadow、不實作 hover state。

## Goals / Non-Goals

**Goals:**
- 實作可複用的 `WheelPicker.vue` 元件，支援任意 `string[]` 選項
- inactive 狀態下只顯示當前值（緊湊），active 時展開 3D 透視滾筒效果（±2 鄰項）
- 600ms 無互動後自動回到 inactive
- 替換年份、月份、尺寸三個選擇器
- 褲子新增通用尺寸/褲子尺寸制式切換 toggle

**Non-Goals:**
- 不實作無限迴圈捲動（到底就停止）
- 不支援鍵盤操作
- 不實作超過 480px 的 RWD
- 不變更 API 或 DB schema

## Decisions

### D1：WheelPicker 的 active 觸發機制
**決定**：`touchstart` 或 `wheel` 事件將 `isActive` 設為 true；touchend 後、或 wheel 事件後的 timer（600ms）將 `isActive` 設回 false。

**替代方案考慮**：
- *點擊才展開*：需要額外一步操作，體驗較差
- *永遠展開*：佔用垂直空間，在長表單（ClothesEditView）中影響可讀性

**理由**：符合使用者描述的「沒有 active 到只顯示當前值」需求，且滑動過程自然展開，停止後自動收合。

### D2：WheelPicker 3D 效果實作方式
**決定**：使用 CSS `perspective` + `rotateX` transform 模擬滾筒。顯示 5 個 slot（index -2 到 +2），各 slot 高度固定 44px，active 時容器高度為 220px，inactive 時為 44px。

```
slot  offset  rotateX   opacity   font-weight   color
 -2    -2      -40°      0.25      400           --color-text-muted
 -1    -1      -25°      0.55      400           --color-text-muted
  0     0        0°      1.00      600           --color-text-main
 +1    +1      +25°      0.55      400           --color-text-muted
 +2    +2      +40°      0.25      400           --color-text-muted
```

容器設定：`perspective: 200px`，`overflow: hidden`，height 從 44px 到 220px 用 CSS transition（150ms ease）。inactive 狀態加 `cursor: ns-resize` 提示可滑動。

**Center 指示器**：在容器內用一個絕對定位的 div（高度 44px，背景色 `--color-secondary`，置中），提供視覺選中標示，符合 Filled Card 原則（無 border/shadow）。

**替代方案**：用絕對定位 + translateY 模擬滾動 → 沒有真實 3D 透視感；使用第三方套件 → 增加依賴且風格難以控制。

**Frontend-design 補充**：`overflow: hidden` 是必要的，確保 transition 期間 ±2 slot 不會溢出容器。`perspective: 200px`（比原本 180px 稍大）使弧度更自然。Center 指示器為純色背景條（不是 border/shadow），符合 Filled Card 原則。

### D3：褲子制式切換的資料模型
**決定**：在 ClothesEditView 內新增 `bottomsSizeType: ref<'alpha' | 'numeric'>('alpha')`，切換時清空 `form.size`。SIZE_OPTIONS 分拆為：
```ts
const BOTTOMS_ALPHA   = ['XS', 'S', 'M', 'L', 'XL', 'XXL']   // 通用尺寸
const BOTTOMS_NUMERIC = ['26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '38']  // 褲子尺寸
```
`sizeOptions` computed 根據 `form.category` 與 `bottomsSizeType` 返回對應陣列。

**理由**：不需要新的 DB 欄位，size 欄位本身已是 varchar，能儲存 'M' 也能儲存 '32'。

### D4：WheelPicker 的未選取狀態
**決定**：WheelPicker 接受 `modelValue = ''` 表示未選取，搭配 `placeholder` prop（例如 '年'、'月'、'請選擇'），在 inactive 時顯示 placeholder 文字而非空白。items 陣列本身不包含空字串。

**理由**：年份和月份允許不填，尺寸也可以不選。若把空字串塞進 items，會讓 WheelPicker 的邊界邏輯複雜化。

### D5：WheelPicker 在 active 展開時的「初始選中值」
**決定**：當 `modelValue === ''`（未選）時，active 展開後顯示 items 的第一個值為暫定焦點，但只有滑動後才真正 emit 更新；若 600ms 內無互動，回到 inactive 仍保持 `modelValue === ''`。

**替代方案**：展開後立即選取第一個 → 無法讓使用者「不填」。

## Risks / Trade-offs

- [CSS 3D transform 在部分低階 Android 裝置效能較差] → 使用 `will-change: transform` 加速合成層
- [同時有年份和月份兩個 WheelPicker，active 狀態可能同時觸發] → 各自獨立管理 `isActive`，互不干擾
- [褲子切換制式時清空 size，若使用者是編輯現有資料，舊值可能被清掉] → 載入資料時根據 size 值是否為數字自動判斷預設 `bottomsSizeType`
