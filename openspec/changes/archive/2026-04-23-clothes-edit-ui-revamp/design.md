## Context

`ClothesEditView` 是 OOTD-IT App 的核心資料錄入頁面。目前的 UI 使用原生 select、text input、type="month" 等基礎元素，視覺風格與 App 的 Filled Card 設計語言不符，且顏色欄位為純文字，無法支援後續的衣物顏色統計功能。

本次改版目標是在維持現有功能（新增 / 編輯衣物）的前提下，全面提升 UI 互動體驗，同時為顏色資料結構化奠基。

## Goals / Non-Goals

**Goals:**
- 類型選擇改為 SVG 圖示橫排，視覺直觀
- 顏色選擇改為 16 個固定色票，確保資料一致性，以利後續統計
- 新增 `color_note` 欄位讓使用者記錄自由文字備註（色碼、色感等），不用於搜尋
- 入手時間改為自製滾輪式年月選擇器（2000～當年+1）
- 圖片上傳允許空值，無圖時顯示通用衣物輪廓 SVG 佔位
- 新增 5 個符合專案 SVG 規範的 icon 檔案

**Non-Goals:**
- 不改動衣物列表（WardrobeView）的顯示邏輯
- 不實作 color_note 的搜尋或過濾功能
- 不改動 R2 圖片上傳的後端邏輯
- 不實作 RWD 或超過 480px 的佈局

## Decisions

### 決策 1：色票數量與顏色定義

選擇 16 個固定色票，涵蓋服裝最常見色系（黑白灰階、卡其棕、深藍、墨綠、紅粉紫）。

`color` 欄位儲存色票的**名稱**（如「黑」、「深藍」），而非 hex 值。如此可讓前端依名稱渲染色塊，後端查詢時以語意字串統計，不因 hex 值微差而分散資料。

備選方案：儲存 hex 值 → 棄用，因為相近色會被視為不同色，統計失真。

色票清單：
| 名稱 | hex |
|---|---|
| 黑 | `#1A1A1A` |
| 深灰 | `#4A4A4A` |
| 灰 | `#9E9E9E` |
| 淺灰 | `#CFCFCF` |
| 白 | `#F5F5F5` |
| 米 | `#F0EAD6` |
| 卡其 | `#C3B091` |
| 棕 | `#795548` |
| 深棕 | `#4E342E` |
| 深藍 | `#1A237E` |
| 藍 | `#1565C0` |
| 天藍 | `#64B5F6` |
| 墨綠 | `#1B5E20` |
| 紅 | `#C62828` |
| 粉 | `#F48FB1` |
| 紫 | `#7B1FA2` |

### 決策 2：color_note 欄位策略

`color_note` 不做搜尋/過濾，純粹供使用者自行記錄（例如「帶一點藍的灰」、「#8A8A8A」）。新增為獨立欄位而非合併進 `color`，保持資料結構乾淨。

Migration 在 `initdb.ts` 以 `ALTER TABLE ... ADD COLUMN color_note TEXT` 加入，沿用既有 try/catch 忽略重複執行的模式。

### 決策 3：滾輪式年月選擇器實作

使用 Vue 的 `@touchstart` / `@touchmove` / `@touchend` 與 `@wheel` 事件，在 `ClothesEditView` 內部以純 script 實作，不引入外部套件。

滾輪邏輯：Y 軸位移 > 閾值（10px）才觸發，防止誤觸。年份陣列預先計算（2000 ～ 當年+1），月份固定 01-12。

備選方案：使用 `input[type=number]` + 按鈕 → 棄用，視覺與既有設計不符。

### 決策 4：預設佔位圖

使用單一通用衣物輪廓 SVG（`icon-clothes-placeholder.svg`），不依選取的類型動態切換。理由：類型在填寫流程中可能比圖片晚選，動態切換佔位圖會造成視覺閃爍。

### 決策 5：類型 SVG icon 規格

所有新增 icon 遵循專案規範：`viewBox="0 0 24 24" fill="none" stroke="currentColor"`，統一從 `src/utils/icons.ts` export，元件透過解析 SVG 字串（`v-html`）渲染。

## Risks / Trade-offs

- **滾輪選擇器的觸控精度**：行動裝置上手指滑動範圍不一，需要適當的閾值設定。→ 以 10px 為觸發閾值，實作後依測試調整。
- **color_note migration 重複執行**：多次呼叫 initdb 會嘗試重複加欄位。→ 沿用既有 try/catch 模式，無副作用。
- **既有資料相容性**：舊資料 `color` 欄位可能存有自由文字（非色票名稱），無法自動對應色票選取狀態。→ 編輯已有資料時，若 `color` 值不在色票清單內，不預選任何色票，備註欄位顯示原值。

## Migration Plan

1. 部署前先呼叫 `/api/initdb` 觸發 `color_note` 欄位 migration
2. 前端部署後，舊資料仍可正常顯示（`color` 為空或任意字串時，色票不預選）
3. Rollback：移除 `color_note` 欄位僅需 `ALTER TABLE clothes DROP COLUMN color_note`（SQLite 3.35+），或直接前端不渲染該欄位
