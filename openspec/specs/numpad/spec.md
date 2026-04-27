## ADDED Requirements

### Requirement: 數字鍵盤（NumPad）元件
系統 SHALL 提供一個 `NumPad.vue` 元件，供純數字欄位輸入使用，以展開式自製鍵盤取代原生系統鍵盤。

元件接受 `modelValue: string` 與可選的 `placeholder: string`，並 emit `update:modelValue`。

鍵盤佈局（4 欄，右欄為功能鍵）：
```
7    8    9    刪（清除全部）
4    5    6    退（退格）
1    2    3    確（確認，跨兩列）
00   0    .
```

#### Scenario: 收合狀態顯示
- **WHEN** 頁面載入，NumPad 未被點擊
- **THEN** 元件 SHALL 以高 44px 的收合狀態呈現，顯示目前 `modelValue`；若為空則顯示 `placeholder`

#### Scenario: 點擊展開鍵盤
- **WHEN** 使用者點擊 NumPad 元件（收合狀態）
- **THEN** 元件 SHALL 展開顯示數字鍵盤，頂部顯示目前輸入值

#### Scenario: 輸入數字
- **WHEN** 使用者點擊數字鍵（0-9 或 00）
- **THEN** `modelValue` SHALL 在尾端附加對應數字字元

#### Scenario: 輸入小數點
- **WHEN** 使用者點擊 `.` 且目前值尚未含 `.`
- **THEN** `modelValue` SHALL 在尾端附加 `.`

#### Scenario: 小數點重複保護
- **WHEN** 使用者點擊 `.` 且目前值已含 `.`
- **THEN** `modelValue` SHALL 保持不變

#### Scenario: 退格刪除
- **WHEN** 使用者點擊「退」鍵且 `modelValue` 非空
- **THEN** `modelValue` SHALL 移除最後一個字元

#### Scenario: 清除全部
- **WHEN** 使用者點擊「刪」鍵
- **THEN** `modelValue` SHALL 設為空字串 `''`

#### Scenario: 確認收起
- **WHEN** 使用者點擊「確」鍵
- **THEN** 元件 SHALL 收合，保留目前 `modelValue`

#### Scenario: 點擊外部收起
- **WHEN** 使用者點擊 NumPad 元件以外的任意區域
- **THEN** 元件 SHALL 收合，保留目前 `modelValue`
