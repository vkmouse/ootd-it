## 1. WheelPicker 元件

- [x] 1.1 建立 `src/components/WheelPicker.vue`，定義 props（`items`、`modelValue`、`placeholder`）與 emit（`update:modelValue`）
- [x] 1.2 實作 inactive 狀態：只顯示 `modelValue` 或 `placeholder` 的單行文字，高度 44px
- [x] 1.3 實作 active 狀態：高度展開至 220px，顯示 5 個 slot（center ±2），使用 CSS perspective + rotateX 3D 效果
- [x] 1.4 實作 slot 視覺樣式：center opacity 1.0、±1 rotateX ±25° opacity 0.55、±2 rotateX ±40° opacity 0.25
- [x] 1.5 實作 inactive ↔ active 高度 CSS transition（150ms ease）
- [x] 1.6 實作 touch 互動：touchstart → active；touchmove 計算 delta 切換選項並 emit；touchend 啟動 600ms timer 回到 inactive
- [x] 1.7 實作 wheel 互動：wheel → active，根據 deltaY 切換選項並 emit，600ms timer 回到 inactive
- [x] 1.8 實作邊界保護：第一項不往前、最後一項不往後
- [x] 1.9 實作 `modelValue === ''` 首次互動自動 emit `items[0]` 的邏輯
- [x] 1.10 超出 items 範圍的 slot 顯示空白但保持占位高度

## 2. ClothesEditView — 入手時間改用 WheelPicker

- [x] 2.1 移除 `yearTouchStartY`、`monthTouchStartY` ref 及 6 個 touch/wheel handler function
- [x] 2.2 import `WheelPicker`，建立 `yearItems`（'2000'–當前年+1）與 `monthItems`（'01'–'12'）computed
- [x] 2.3 將 template 中的兩個 `date-col` div 替換為兩個 `<WheelPicker>` 並設定 placeholder（'年'、'月'）
- [x] 2.4 年份 WheelPicker 的 `update:modelValue` 將字串轉數字後寫入 `selectedYear`；月份同理寫入 `selectedMonth`

## 3. ClothesEditView — 尺寸改用 WheelPicker + 褲子制式切換

- [x] 3.1 新增 `bottomsSizeType: ref<'alpha' | 'numeric'>('alpha')` 及兩個尺寸常數 `BOTTOMS_ALPHA`、`BOTTOMS_NUMERIC`
- [x] 3.2 更新 `sizeOptions` computed：bottoms 依 `bottomsSizeType` 返回對應陣列
- [x] 3.3 `onCategorySelect` 切換類型時重設 `bottomsSizeType` 為 `'alpha'`（非 bottoms 時無影響）
- [x] 3.4 `onMounted` 編輯模式載入 size 時，若為純數字字串則自動設 `bottomsSizeType = 'numeric'`
- [x] 3.5 template 中移除 `<select>` 尺寸選單，替換為 `<WheelPicker>` 並設定 placeholder 為「請選擇」
- [x] 3.6 在尺寸 WheelPicker 上方新增褲子制式 toggle（僅 `form.category === 'bottoms'` 時顯示），點擊切換 `bottomsSizeType` 並清空 `form.size`

## 4. 驗證

- [x] 4.1 執行 `npm run type-check` 確認零型別錯誤
- [ ] 4.2 瀏覽器手動測試：WheelPicker inactive/active 切換視覺正確
- [ ] 4.3 手動測試：年份、月份、尺寸各 WheelPicker 能正確選值並存入資料庫
- [ ] 4.4 手動測試：褲子制式切換後 WheelPicker 選項更新，舊值清空
- [ ] 4.5 手動測試：編輯現有褲子尺寸（數字）的褲子時，制式自動切換至「褲子尺寸」並預選正確值
