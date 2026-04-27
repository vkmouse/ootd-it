## ADDED Requirements

### Requirement: 滾輪式選擇器基本結構
WheelPicker 元件 SHALL 接受 `items: string[]`、`modelValue: string`、`placeholder?: string` 三個 prop，並透過 `update:modelValue` emit 傳回選中值。

#### Scenario: 渲染 inactive 狀態
- **WHEN** 使用者進入包含 WheelPicker 的頁面，且無正在進行的互動
- **THEN** WheelPicker SHALL 只顯示當前選中的值（`modelValue`）；若 `modelValue` 為空字串，SHALL 顯示 `placeholder`

#### Scenario: modelValue 有值時顯示值
- **WHEN** `modelValue` 為非空字串，且 WheelPicker 處於 inactive 狀態
- **THEN** 顯示文字 SHALL 等於 `modelValue`

#### Scenario: modelValue 為空時顯示 placeholder
- **WHEN** `modelValue` 為空字串，且 WheelPicker 處於 inactive 狀態
- **THEN** 顯示文字 SHALL 等於 `placeholder`（若未提供 placeholder 則顯示空白）

---

### Requirement: touch 互動展開滾筒
使用者觸碰 WheelPicker 後 SHALL 進入 active 狀態，呈現 3D 透視滾筒效果；上下滑動 SHALL 改變選中項目；停止互動後 600ms SHALL 自動回到 inactive 狀態。

#### Scenario: touchstart 觸發 active
- **WHEN** 使用者觸碰 WheelPicker 元素
- **THEN** WheelPicker SHALL 進入 active 狀態，展開顯示 5 個項目（center ±2）

#### Scenario: 向上滑動選擇前一項
- **WHEN** 使用者在 active 狀態下向上滑動（deltaY < 0），且當前值不是第一個項目
- **THEN** WheelPicker SHALL emit 前一個項目的值

#### Scenario: 向下滑動選擇後一項
- **WHEN** 使用者在 active 狀態下向下滑動（deltaY > 0），且當前值不是最後一個項目
- **THEN** WheelPicker SHALL emit 後一個項目的值

#### Scenario: 到達邊界不越界
- **WHEN** 當前值已是第一個項目且向上滑動，或已是最後一個項目且向下滑動
- **THEN** WheelPicker SHALL 不改變選中值，不 emit 任何事件

#### Scenario: touchend 後 600ms 收合
- **WHEN** 使用者放開手指（touchend）後 600ms 內無新互動
- **THEN** WheelPicker SHALL 回到 inactive 狀態，只顯示當前值

---

### Requirement: wheel 互動展開滾筒
使用者滾動滑鼠滾輪時 SHALL 觸發與 touch 相同的 active 展開與選值行為。

#### Scenario: wheel 事件觸發 active
- **WHEN** 使用者在 WheelPicker 上滾動滑鼠滾輪
- **THEN** WheelPicker SHALL 進入 active 狀態並根據滾動方向切換選項

#### Scenario: wheel 停止後 600ms 收合
- **WHEN** wheel 事件停止觸發後 600ms 內無新互動
- **THEN** WheelPicker SHALL 回到 inactive 狀態

---

### Requirement: 3D 透視滾筒視覺效果
active 狀態下，WheelPicker SHALL 使用 CSS 3D `perspective` + `rotateX` 呈現滾筒立體感，中心項目最突出，上下鄰項依距離逐漸縮小並降低 opacity。

#### Scenario: 5 個項目依距離套用不同視覺樣式
- **WHEN** WheelPicker 處於 active 狀態，顯示 center ±2 共 5 個 slot
- **THEN** center slot SHALL 以最大字體與 opacity 1.0 呈現；±1 slot SHALL 以 rotateX ±25° 與 opacity 0.55 呈現；±2 slot SHALL 以 rotateX ±40° 與 opacity 0.25 呈現

#### Scenario: 空 slot 顯示為空白
- **WHEN** center 項目為第一或最後，導致 ±1 或 ±2 超出 items 範圍
- **THEN** 超出範圍的 slot SHALL 顯示空白，仍保持占位高度

#### Scenario: active/inactive 高度過渡動畫
- **WHEN** WheelPicker 在 active 與 inactive 之間切換
- **THEN** 容器高度 SHALL 以 CSS transition（150ms ease）平滑過渡

---

### Requirement: 未選取時首次互動的行為
當 `modelValue` 為空字串時，使用者首次互動 SHALL 自動選取 items[0] 並 emit。

#### Scenario: 空值首次滑動自動選第一個
- **WHEN** `modelValue` 為空字串，使用者開始觸碰或滾動 WheelPicker
- **THEN** WheelPicker SHALL 立即 emit `items[0]` 作為初始選中值，並展開 active 狀態
