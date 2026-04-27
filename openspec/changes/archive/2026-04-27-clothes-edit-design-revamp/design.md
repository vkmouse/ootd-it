## Context

`ClothesEditView` 是衣物新增／編輯的主要頁面，整合了多個自製互動元件（`WheelPicker`、`YearMonthPicker`、`NumPad`）。`WardrobeView` 是主要的衣物瀏覽頁，透過 `ClothesCard` 元件呈現列表。

兩個頁面目前功能完整，但存在跨頁面的視覺不一致：
- 圓角混用 `--radius-md`（8px）、`--radius-lg`（12px）與 `--radius-xl`（16px）
- `ClothesCard` 實作的圖片比例（1:1）與 spec 規定(3:4)不符
- `WardrobeView` 清單無 padding，卡片貼邊
- 浮動新增按鈕使用文字字符 `＋`，與全站 SVG icon 語言不一致

設計系統基礎（Filled Card 原則）已就緒：
- 無 border、無 shadow、無 hover 狀態
- 以背景色深淺建立層次
- design token 集中於 `src/assets/variables.css`
- SVG icon 統一由 `src/utils/icons.ts` export

## Goals / Non-Goals

**Goals:**
- 統一 `ClothesEditView` 所有互動元素的圓角為 `--radius-xl`
- 提升圖片上傳區的視覺引導
- 強化類型選擇器的 active 狀態對比
- 讓 Submit / Delete 按鈕有明確的視覺優先級差異
- 色票排列對齊（4 列 × 4 欄 grid）
- 修正 `ClothesCard` 圓角（`--radius-xl`）與圖片比例（3:4）
- 補上 `WardrobeView` list padding
- 浮動新增按鈕改用 SVG icon

**Non-Goals:**
- 不改動任何 JS 邏輯或 API
- 不修改 `WheelPicker`、`YearMonthPicker`、`NumPad` 的內部元件樣式
- 不新增動畫或 hover 狀態（遵守專案規範）
- 不更動 design token（僅使用現有 token）

## Decisions

### 決策 1：圓角統一策略
**採用**：所有互動容器一律使用 `--radius-xl`（16px），包含 ClothesCard、ClothesEditView 內所有按鈕與 input。  
**理由**：WheelPicker / NumPad 已使用 `--radius-xl`，統一後整個 APP 視覺語言一致。  
**捨棄**：引入新 token `--radius-input` — 過度工程，目前只有這些頁面受影響。

### 決策 2：圖片比例（ClothesCard + 編輯預覽一致）
**採用**：`aspect-ratio: 3 / 4`（portrait），兩處統一。  
**理由**：
1. wardrobe spec 已明文規定 3:4，此次補齊實作
2. 衣物多為直幅拍攝，3:4 更自然
3. ClothesCard 與 ClothesEditView 比例一致，使用者心智模型連貫  
**捨棄**：ClothesCard 保持 1:1 — 違反 spec，且與編輯頁預覽不一致。

### 決策 3：Delete 按鈕
**採用**：純文字樣式，`color: #C62828`（固定危險紅），`background: none`。  
**理由**：符合 Filled Card 無背景卡感，同時讓刪除動作有清楚的危險語義。  
**捨棄**：使用 `--color-bg-sub` 背景 — 與其他 input 控件視覺混淆。

### 決策 4：色票排列
**採用**：`display: grid; grid-template-columns: repeat(4, 1fr)`，4×4 規則格狀。  
**理由**：16 顆色票用 flex-wrap 排列時因螢幕寬度出現不對齊的尾行；4×4 grid 保證對稱整齊。  
**捨棄**：8 欄單列 — 在小螢幕上每顆過小。

### 決策 5：浮動新增按鈕 icon
**採用**：新增 `src/assets/icons/icon-plus.svg`，在 `utils/icons.ts` 新增 `iconPlus` export，WardrobeView 改用 `v-html` 方式渲染。  
**理由**：統一全站 SVG icon 管理規則（所有 icon 由 `@/utils/icons` import），避免使用文字字符。  
**捨棄**：維持文字 `＋` — 字形渲染在不同系統字體下可能不一致。

## Risks / Trade-offs

- [ClothesCard 圖片比例改變] → 若使用者已上傳 1:1 舊圖，`object-fit: cover` 會裁切顯示，屬預期行為，不影響儲存的圖片本身
- [3:4 卡片高度] → 在 2 欄 grid 下每張卡片圖片高度約 304px（@480px max-width），偏高，但符合時尚 app（Instagram shop）標準，為可接受的 trade-off
- [4×4 色票 grid] → 在極小螢幕（< 320px）下每顆可能過小，但本專案 max-width 480px 且不考慮 320px 以下，可接受
