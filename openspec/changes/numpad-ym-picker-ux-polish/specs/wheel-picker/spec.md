## MODIFIED Requirements

### Requirement: WheelPicker 展開自動滾動
WheelPicker 展開（進入 active 狀態）時，SHALL 自動將自身滾動至可視區域。

#### Scenario: 展開後元素滾入視窗
- **WHEN** 使用者點擊 WheelPicker 觸發展開
- **THEN** WheelPicker SHALL 自動 scrollIntoView（block: nearest）

---

### Requirement: WheelPicker overlay 字型與 input 一致
WheelPicker 收合 overlay 的文字 SHALL 採用與 `clothes-form__input` 相同的字型規格：`font-size: var(--font-size-base)`、有值時 `font-weight: 500`、placeholder 時 `font-weight: 400`。

#### Scenario: 有值時字型
- **WHEN** `modelValue` 非空，WheelPicker 為 inactive
- **THEN** overlay 文字 SHALL 以 `font-size-base`、`font-weight: 500` 顯示

#### Scenario: placeholder 字型
- **WHEN** `modelValue` 為空，WheelPicker 為 inactive
- **THEN** overlay 文字 SHALL 以 `font-size-base`、`font-weight: 400`、`--color-text-muted` 顯示
