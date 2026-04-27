## ADDED Requirements

### Requirement: 褲子尺寸制式切換
當使用者選擇 `bottoms`（褲子）類型時，尺寸區塊 SHALL 在 WheelPicker 上方顯示一個制式切換 toggle，讓使用者在「通用尺寸（XS/S/M/L/XL/XXL）」與「褲子尺寸（26–38）」之間切換。切換時 SHALL 清空當前已選尺寸。

#### Scenario: 選擇褲子類型後顯示制式 toggle
- **WHEN** 使用者選擇 `bottoms` 類型
- **THEN** 尺寸區塊 SHALL 顯示兩個可點選的 toggle 標籤：「通用」和「褲子尺寸」，預設選中「通用」

#### Scenario: 切換制式時清空已選尺寸
- **WHEN** 使用者點擊未選中的制式 toggle
- **THEN** 系統 SHALL 切換制式，清空 `form.size`，WheelPicker 顯示對應制式的選項清單

#### Scenario: 通用尺寸清單
- **WHEN** bottomsSizeType 為 `alpha`
- **THEN** 尺寸 WheelPicker 的 items SHALL 為 `['XS', 'S', 'M', 'L', 'XL', 'XXL']`

#### Scenario: 褲子尺寸清單
- **WHEN** bottomsSizeType 為 `numeric`
- **THEN** 尺寸 WheelPicker 的 items SHALL 為 `['26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '38']`

#### Scenario: 編輯模式載入時自動判斷制式
- **WHEN** 使用者進入編輯模式，`size` 值為純數字字串（如 '30'）
- **THEN** 系統 SHALL 自動將 `bottomsSizeType` 設為 `numeric`，並選中對應褲子尺寸值

#### Scenario: 非褲子類型不顯示制式 toggle
- **WHEN** 使用者選擇 `tops`、`outerwear`、`shoes` 或 `accessories` 類型
- **THEN** 尺寸區塊 SHALL 不顯示制式 toggle

---

### Requirement: 尺寸選擇改用 WheelPicker
衣物表單的尺寸欄位 SHALL 以 WheelPicker 元件取代原有的 `<select>` 下拉選單。

#### Scenario: 尺寸選項透過 WheelPicker 選取
- **WHEN** 使用者在 `showSize` 為 true 的情況下進入尺寸區塊
- **THEN** 尺寸欄位 SHALL 顯示 WheelPicker，`placeholder` 為「請選擇」

#### Scenario: 尺寸選後寫入 form.size
- **WHEN** 使用者透過 WheelPicker 選取尺寸值
- **THEN** `form.size` SHALL 即時更新為選取的字串值

---

### Requirement: 入手時間改用 WheelPicker
衣物表單的「入手時間」欄位 SHALL 以兩個並排的 WheelPicker 元件（年、月）取代原有的 `date-col` div 與所有相關 touch/wheel handler。

#### Scenario: 年份 WheelPicker 選項範圍
- **WHEN** 使用者互動年份 WheelPicker
- **THEN** items SHALL 包含 2000 至 `currentYear + 1` 的所有年份字串，WheelPicker placeholder 為「年」

#### Scenario: 月份 WheelPicker 選項範圍
- **WHEN** 使用者互動月份 WheelPicker
- **THEN** items SHALL 包含 '01' 到 '12' 的補零月份字串，WheelPicker placeholder 為「月」

#### Scenario: 選擇後更新對應 ref
- **WHEN** 使用者透過年份 WheelPicker 選取值
- **THEN** `selectedYear` SHALL 更新為對應數字；月份同理更新 `selectedMonth`
