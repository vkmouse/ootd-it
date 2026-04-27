## ADDED Requirements

### Requirement: 年月合併 Wheel 選擇器
YearMonthPicker 元件 SHALL 在單一容器內顯示年份與月份兩個獨立的滾輪（drum），共享同一個 `isActive` 狀態（展開/收合）。容器 SHALL 以 `--color-bg-sub` 為統一背景色，不加 gap、不加 border、不加 shadow，視覺上呈現為一個整體。

#### Scenario: 收合時顯示當前年月
- **WHEN** 元件為 inactive 狀態
- **THEN** 容器 SHALL 顯示為 44px 高，左半部顯示當前年份值，右半部顯示當前月份值（如 `2024   03`）

#### Scenario: 年或月未選取時顯示 placeholder
- **WHEN** 元件為 inactive 狀態且年份或月份尚未選取
- **THEN** 未選取的位置 SHALL 以淡色（`--color-text-muted`）顯示 placeholder（年 placeholder 顯示「年」，月 placeholder 顯示「月」）

#### Scenario: 點擊展開兩個 drum
- **WHEN** 使用者在元件上按下後放開（click，位移 < 28px）且元件為 inactive
- **THEN** 元件 SHALL 展開至 220px 高，同時顯示年 drum 與月 drum，各含 5 個 slot

#### Scenario: 點外部收合
- **WHEN** 元件為 active 且使用者在元件外部按下（pointerdown）
- **THEN** 元件 SHALL 收合回 inactive（44px）

#### Scenario: 點擊元件內部不收合
- **WHEN** 元件為 active 且使用者在元件內部按下後放開（位移 < 28px）
- **THEN** 元件 SHALL 保持 active 狀態不收合

---

### Requirement: 年月 drum 獨立滾動
兩個 drum 各自獨立追蹤拖拉：pointerdown 落點在容器左半部則操作年 drum，落點在右半部則操作月 drum。拖拉門檻 SHALL 為 **28px**，每累積 28px 才切換一格。

#### Scenario: 拖拉年 drum 改變年份
- **WHEN** 使用者在元件 active 狀態下，按下左半部後向上拖拉 >= 28px
- **THEN** 年份 SHALL 增加 1，且不超過上限（當前年份 + 1）

#### Scenario: 拖拉月 drum 改變月份
- **WHEN** 使用者在元件 active 狀態下，按下右半部後向下拖拉 >= 28px
- **THEN** 月份 SHALL 減少 1，且不低於下限（01）

#### Scenario: 拖拉不超過門檻時不切換
- **WHEN** 使用者拖拉距離 < 28px 後放開
- **THEN** 年份與月份 SHALL 保持不變

---

### Requirement: 年月 drum 視覺樣式
YearMonthPicker SHALL 使用與 WheelPicker 相同的 3D perspective 效果，center slot 正面顯示，±1 rotateX ±25° opacity 0.55，±2 rotateX ±40° opacity 0.25。indicator bar SHALL 以絕對定位橫跨整個容器寬度（`left: 0; right: 0; height: 44px`），背景色 `--color-secondary`。

#### Scenario: 選中 slot 視覺突出
- **WHEN** 元件為 active 狀態
- **THEN** 每個 drum 的 center slot SHALL 以 font-weight 600、`--color-text-main` 顯示，±1 與 ±2 slot 使用 `--color-text-muted` 並套用對應 rotateX

#### Scenario: indicator bar 橫跨整行
- **WHEN** 元件為 active 狀態
- **THEN** 中心 indicator bar SHALL 以 `--color-secondary` 背景色橫跨整個容器寬度（包含年與月區域），不使用 border 或 shadow
