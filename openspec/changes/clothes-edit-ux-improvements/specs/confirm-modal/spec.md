## ADDED Requirements

### Requirement: 通用確認對話框元件
系統 SHALL 提供 `ConfirmModal.vue` 元件，以 fixed overlay 方式顯示確認對話框，支援傳入標題、訊息與按鈕文字，並透過 emit 回報使用者選擇。

Props：
- `title: string` — 對話框標題
- `message: string` — 說明文字
- `confirmLabel: string` — 確認按鈕文字（預設「確認」）
- `cancelLabel: string` — 取消按鈕文字（預設「取消」）

Events：
- `confirm` — 使用者點擊確認按鈕
- `cancel` — 使用者點擊取消按鈕或背景遮罩

#### Scenario: 顯示對話框
- **WHEN** 父元件以 `v-if` 渲染 ConfirmModal
- **THEN** 畫面 SHALL 顯示全螢幕遮罩，遮罩中央顯示包含 title、message 及兩個按鈕的卡片

#### Scenario: 點擊確認
- **WHEN** 使用者點擊確認按鈕
- **THEN** 元件 SHALL emit `confirm` 事件

#### Scenario: 點擊取消
- **WHEN** 使用者點擊取消按鈕
- **THEN** 元件 SHALL emit `cancel` 事件

#### Scenario: 點擊背景遮罩關閉
- **WHEN** 使用者點擊遮罩背景（非卡片區域）
- **THEN** 元件 SHALL emit `cancel` 事件
