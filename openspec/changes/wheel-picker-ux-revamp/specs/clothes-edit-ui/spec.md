## ADDED Requirements

### Requirement: WheelPicker 點擊才展開
WheelPicker（及 YearMonthPicker）SHALL 以 click（按下後放開，位移 < 28px）作為展開觸發，而非 touchstart 或 pointerdown。只有按下不算展開。

#### Scenario: 按下後放開展開
- **WHEN** 使用者在 inactive WheelPicker 上按下後放開，且位移 < 28px
- **THEN** WheelPicker SHALL 展開（isActive = true）

#### Scenario: 只按下不展開
- **WHEN** 使用者在 inactive WheelPicker 上按下但尚未放開
- **THEN** WheelPicker SHALL 保持收合狀態（isActive = false）

#### Scenario: 拖拉超過門檻不算 click
- **WHEN** 使用者在 inactive WheelPicker 上按下後拖拉 >= 28px 再放開
- **THEN** WheelPicker SHALL 保持收合狀態（isActive = false）

---

### Requirement: WheelPicker 點外部才收合
WheelPicker 移除 600ms 自動收合 timer，改為點擊元件外部（pointerdown 落點不在元件內）才收合。

#### Scenario: 點外部收合
- **WHEN** WheelPicker 為 active 且使用者在元件外部按下（pointerdown）
- **THEN** WheelPicker SHALL 收合（isActive = false）

#### Scenario: 點內部不收合
- **WHEN** WheelPicker 為 active 且使用者在元件內部按下後放開（位移 < 28px）
- **THEN** WheelPicker SHALL 保持 active 狀態

---

### Requirement: WheelPicker 拖拉門檻 28px
WheelPicker 的拖拉門檻 SHALL 為 28px，每累積 28px 才切換一格。

#### Scenario: 拖拉 >= 28px 切換一格
- **WHEN** 使用者在 active WheelPicker 向上拖拉累積 >= 28px
- **THEN** 值 SHALL 向後切換一格（index + 1），startY 重設

#### Scenario: 拖拉 < 28px 不切換
- **WHEN** 使用者拖拉距離 < 28px
- **THEN** 值 SHALL 保持不變

---

### Requirement: 儲存與刪除按鈕高度對齊輸入框
儲存按鈕與刪除衣物按鈕的高度 SHALL 與表單輸入框（`clothes-form__input`）視覺一致，padding 四邊相同（`var(--spacing-md)` = 16px）。

#### Scenario: 按鈕與輸入框高度一致
- **WHEN** 使用者看到衣物表單底部的儲存與刪除按鈕
- **THEN** 兩個按鈕的外觀高度 SHALL 與表單上方的文字輸入框（如名稱欄位）視覺一致

## MODIFIED Requirements

### Requirement: 滾輪式年月選擇器
入手時間欄位 SHALL 改用 `YearMonthPicker` 元件呈現，年份與月份整合於同一個容器，無 gap，無各自 border，整塊同一背景色。使用者 SHALL 能在展開後分別獨立滾動年 drum 和月 drum。年份範圍為 2000 至當年+1，月份為 01–12。

#### Scenario: 顯示當前選取的年月
- **WHEN** 使用者進入衣物表單且 `acquired_date` 有值
- **THEN** YearMonthPicker SHALL 在收合狀態顯示對應的年份與月份（如 `2024   03`）

#### Scenario: 點擊展開後可分別滾動年月
- **WHEN** 使用者點擊 YearMonthPicker（click）
- **THEN** 元件 SHALL 展開，同時顯示年 drum（左半部）和月 drum（右半部）

#### Scenario: 向上拖拉年 drum 增加年份
- **WHEN** 使用者在展開後的年 drum（左半部）向上拖拉 >= 28px
- **THEN** 年份 SHALL 增加 1，且不超過當年+1

#### Scenario: 向下拖拉年 drum 減少年份
- **WHEN** 使用者在展開後的年 drum（左半部）向下拖拉 >= 28px
- **THEN** 年份 SHALL 減少 1，且不低於 2000

#### Scenario: 向上拖拉月 drum 增加月份
- **WHEN** 使用者在展開後的月 drum（右半部）向上拖拉 >= 28px
- **THEN** 月份 SHALL 增加 1，且不超過 12

#### Scenario: 向下拖拉月 drum 減少月份
- **WHEN** 使用者在展開後的月 drum（右半部）向下拖拉 >= 28px
- **THEN** 月份 SHALL 減少 1，且不低於 1

#### Scenario: 無入手時間時顯示 placeholder
- **WHEN** 使用者進入新增模式且尚未選擇入手時間
- **THEN** YearMonthPicker SHALL 在收合狀態顯示「年」（左）和「月」（右）的淡色 placeholder
