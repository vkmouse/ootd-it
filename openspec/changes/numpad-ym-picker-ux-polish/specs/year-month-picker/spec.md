## MODIFIED Requirements

### Requirement: 年月合併 Wheel 選擇器
YearMonthPicker 元件 SHALL 在單一容器內顯示年份與月份兩個獨立的滾輪（drum），共享同一個 `isActive` 狀態。收合（inactive）時 overlay SHALL 以 **`{年份}年{月份}月` 格式、靠左對齊** 顯示選取值；未選取的部分 SHALL 以淡色 placeholder 顯示。容器 SHALL 以 `--color-bg-sub` 為統一背景色，不加 gap、不加 border、不加 shadow。

#### Scenario: 收合時年月置左顯示
- **WHEN** 元件為 inactive 且年份與月份皆已選取
- **THEN** overlay SHALL 靠左顯示 `{年份}年{月份}月`（如 `2024年10月`），`padding-left: var(--spacing-md)`

#### Scenario: 年已選月未選時顯示
- **WHEN** 元件為 inactive，年份已選取，月份未選取
- **THEN** overlay SHALL 靠左顯示 `{年份}年`，其後跟隨淡色 placeholder「月」（如 `2024年　月`）

#### Scenario: 年未選月已選時顯示
- **WHEN** 元件為 inactive，年份未選取，月份已選取
- **THEN** overlay SHALL 靠左顯示淡色 placeholder「年」，其後跟隨 `{月份}月`（如 `　年10月`）

#### Scenario: 年月皆未選時顯示 placeholder
- **WHEN** 元件為 inactive 且年份與月份皆未選取
- **THEN** overlay SHALL 靠左以淡色顯示「年份   月份」placeholder

#### Scenario: 點擊展開兩個 drum
- **WHEN** 使用者在元件上按下後放開（click，位移 < 28px）且元件為 inactive
- **THEN** 元件 SHALL 展開至 220px 高，同時顯示年 drum 與月 drum，各含 5 個 slot

#### Scenario: 點外部收合
- **WHEN** 元件為 active 且使用者在元件外部按下（pointerdown）
- **THEN** 元件 SHALL 收合回 inactive（44px）

---

### Requirement: YearMonthPicker 展開自動滾動
YearMonthPicker 展開（進入 active 狀態）時，SHALL 自動將自身滾動至可視區域。

#### Scenario: 展開後元素滾入視窗
- **WHEN** 使用者點擊 YearMonthPicker 觸發展開
- **THEN** 元件 SHALL 自動 scrollIntoView（block: nearest）

---

### Requirement: YearMonthPicker overlay 字型與 input 一致
YearMonthPicker 收合 overlay 的文字 SHALL 採用與 `clothes-form__input` 相同的字型規格：`font-size: var(--font-size-base)`、有值時 `font-weight: 500`、placeholder 時 `font-weight: 400`。

#### Scenario: 有值時字型
- **WHEN** 年份或月份已選取，元件為 inactive
- **THEN** 已選取部分 SHALL 以 `font-size-base`、`font-weight: 500` 顯示

#### Scenario: placeholder 字型
- **WHEN** 年份或月份未選取，元件為 inactive
- **THEN** 未選取部分 SHALL 以 `font-size-base`、`font-weight: 400`、`--color-text-muted` 顯示
