## Context

ClothesEditView 是新增／編輯衣物的單一頁面，目前圖片上傳透過獨立 `<input type="file">` 欄位操作，顏色備註需全手動輸入，且沒有刪除功能。後端 `[id].ts` 只有 GET/PATCH，圖片由 `[id]/image.ts` 管理（POST/GET）。

## Goals / Non-Goals

**Goals:**
- 點擊圖片預覽區觸發 file input，視覺上無獨立上傳欄位
- 選色票時若 `color_note` 為空自動填入色票名稱
- 編輯模式新增刪除按鈕，透過通用 ConfirmModal 確認
- DELETE `/api/clothes/:id` 同步刪除 DB 記錄與 R2 object

**Non-Goals:**
- 不實作多圖上傳
- 不實作 undo / 回收桶
- 不修改圖片壓縮或格式轉換邏輯

## Decisions

### 圖片區改為點擊觸發
隱藏原本的 `<input type="file">`，在圖片預覽 div 上綁定 `@click` 呼叫 `inputRef.click()`。理由：mobile-first 設計下點擊整塊圖片區比小欄位更直覺，不需要引入額外依賴。

### 顏色備註自動填入
在 `onColorSelect()` 中加入判斷：`if (!form.color_note) form.color_note = selectedColorName`。只在空白時填入，保留使用者已有內容。

### 刪除確認使用 ConfirmModal
新增 `src/components/ConfirmModal.vue`，props: `title`, `message`, `confirmLabel`, `cancelLabel`，emit: `confirm`, `cancel`。以 `v-if` 控制顯示。設計為通用元件，未來其他頁面可複用。不使用 `window.confirm()`，維持一致的視覺風格。

### DELETE endpoint 刪除順序
先刪 R2 再刪 DB。理由：若 DB 先刪成功但 R2 失敗，圖片會成為孤兒（佔存儲空間且無法追蹤）；反之若 R2 先刪但 DB 失敗，記錄仍在只是 image_url 指向不存在的 object，危害較低。R2 `delete()` 對不存在的 key 不拋錯，安全。

## Risks / Trade-offs

- **R2 刪除失敗時 DB 記錄未刪** → Worker 回傳 500，前端提示錯誤，使用者可重試；R2 object 仍存在（無孤兒）
- **ConfirmModal 疊加層級** → 以固定 `position: fixed; z-index` 處理，目前頁面無其他 modal，無衝突風險
- **點擊圖片區無視覺提示** → 可在佔位符加上 icon 暗示可點擊，由 spec 定義
