## MODIFIED Requirements

### Requirement: NumPad 關閉行為
NumPad SHALL 只能透過使用者按下確定鍵（`icon-check`）來關閉。點擊 NumPad 元件外部 SHALL 不關閉 NumPad。

#### Scenario: 按確定鍵關閉
- **WHEN** 使用者在展開的 NumPad 中按下確定鍵
- **THEN** NumPad SHALL 收合至 inactive 狀態（44px）

#### Scenario: 點外部不關閉
- **WHEN** NumPad 為 active 狀態，使用者點擊 NumPad 以外的區域
- **THEN** NumPad SHALL 保持 active 狀態，不收合

---

### Requirement: NumPad 展開自動滾動
NumPad 展開（進入 active 狀態）時，SHALL 自動將自身滾動至可視區域。

#### Scenario: 展開後元素滾入視窗
- **WHEN** 使用者點擊 NumPad overlay 觸發展開
- **THEN** NumPad SHALL 在展開動畫完成後自動 scrollIntoView（block: nearest）

---

### Requirement: NumPad 功能鍵使用 SVG icon
NumPad 的三個功能鍵 SHALL 以 SVG icon 取代文字字符：
- 清空鍵（原「刪」）SHALL 使用 `iconXCircle`
- 退格鍵（原「退」）SHALL 使用 `iconBackspace`
- 確定鍵（原「確」）SHALL 使用 `iconCheck`

#### Scenario: 功能鍵顯示 SVG icon
- **WHEN** 使用者展開 NumPad
- **THEN** 功能鍵區域 SHALL 分別顯示對應 SVG icon，不顯示文字字符

---

### Requirement: NumPad 金額顯示千分位
NumPad 的收合 overlay 與展開顯示列 SHALL 將數字以千分位格式化顯示。千分位格式化 SHALL 不影響 `modelValue` 的儲存格式。

#### Scenario: 整數加千分位
- **WHEN** `modelValue` 為 `"1000"`
- **THEN** 顯示 SHALL 為 `"1,000"`

#### Scenario: 小數保留末尾小數點
- **WHEN** `modelValue` 為 `"1000."`
- **THEN** 顯示 SHALL 為 `"1,000."`（保留末尾小數點以利繼續輸入）

#### Scenario: modelValue 不含逗號
- **WHEN** 使用者按下任意數字鍵
- **THEN** emitted `modelValue` SHALL 為無逗號的原始字串（如 `"1000"`）

---

### Requirement: NumPad overlay 字型與 input 一致
NumPad 收合 overlay 與展開顯示列的文字 SHALL 採用與 `clothes-form__input` 相同的字型規格：`font-size: var(--font-size-base)`、有值時 `font-weight: 500`、placeholder 時 `font-weight: 400`。

#### Scenario: 有值時字型
- **WHEN** `modelValue` 非空，NumPad 為 inactive
- **THEN** overlay 文字 SHALL 以 `font-size-base`、`font-weight: 500` 顯示

#### Scenario: placeholder 字型
- **WHEN** `modelValue` 為空，NumPad 為 inactive
- **THEN** overlay 文字 SHALL 以 `font-size-base`、`font-weight: 400`、`--color-text-muted` 顯示
