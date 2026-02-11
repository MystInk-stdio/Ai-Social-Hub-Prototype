# Threads AI 排程系統

一個本地運行的 Threads AI 草稿排程系統，使用 Next.js 14 + TypeScript 建構。系統會自動填入貼文內容，但**不會自動點擊發布按鈕**，確保所有貼文都需要手動確認後發布。

## ⚠️ 安全特性

- ✅ **不會自動點擊發布按鈕** - 所有貼文都需要手動確認
- ✅ **不儲存 Threads 密碼** - 用戶需要手動登入
- ✅ **不實作自動登入** - 確保帳號安全
- ✅ **本地運行** - 所有資料都儲存在本地 SQLite 資料庫

## 🛠️ 技術棧

- **前端**: Next.js 14 + TypeScript + TailwindCSS
- **後端**: Next.js API Routes
- **資料庫**: SQLite + Prisma ORM
- **排程**: node-cron
- **AI**: OpenAI API
- **自動化**: Playwright (非 headless 模式)

## 📁 專案結構

```
├── app/
│   ├── api/
│   │   ├── generate/          # AI 內容生成 API
│   │   ├── posts/              # 貼文 CRUD API
│   │   └── scheduled/          # 排程查詢 API
│   ├── create/                 # 建立貼文頁面
│   ├── posts/                  # 貼文列表頁面
│   ├── layout.tsx              # 根佈局
│   ├── page.tsx                # 首頁
│   └── globals.css             # 全域樣式
├── prisma/
│   ├── schema.prisma           # Prisma schema
│   └── client.ts               # Prisma client
├── scripts/
│   ├── scheduler.ts            # node-cron 排程器
│   └── publish-post.ts         # Playwright 自動填入腳本
├── .env.example                 # 環境變數範例
└── package.json
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env` 並填入您的 OpenAI API Key：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL="file:./prisma/dev.db"
```

### 3. 初始化資料庫

```bash
npm run db:generate
npm run db:push
```

### 4. 安裝 Playwright 瀏覽器

```bash
npx playwright install chromium
```

### 5. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 6. 啟動排程器（另一個終端機）

```bash
npm run scheduler
```

排程器會每分鐘檢查一次是否有需要發布的貼文。

## 📖 使用說明

### 建立貼文

1. 前往「建立新貼文」頁面
2. 輸入提示詞（例如：「分享一個關於 AI 工具的小技巧」）
3. 點擊「使用 AI 生成內容」
4. 檢查並編輯生成的內容（最多 300 字元）
5. （選填）設定排程發布時間
6. 點擊「儲存貼文」

### 管理貼文

1. 前往「貼文列表」頁面
2. 查看所有貼文及其狀態
3. 可以編輯、刪除貼文
4. 可以設定或修改排程時間

### 排程發布流程

1. 設定貼文的排程時間
2. 確保排程器正在運行（`npm run scheduler`）
3. 當排程時間到達時：
   - 系統會自動啟動 Playwright（非 headless 模式）
   - 開啟 Threads 網站
   - **自動填入貼文內容**
   - **等待您手動點擊發布按鈕**
4. 發布完成後，關閉瀏覽器視窗

## 🔒 安全注意事項

1. **不要將 `.env` 檔案提交到 Git**
2. **不要儲存 Threads 帳號密碼**
3. **系統不會自動點擊發布按鈕** - 這是設計上的安全措施
4. **首次使用時需要手動登入 Threads** - Playwright 會保持登入狀態（在瀏覽器設定檔中）

## 🧪 測試完整流程

### 端對端範例

1. **建立測試貼文**：
   - 前往 `/create`
   - 輸入提示詞：「測試貼文：這是一個自動填入測試」
   - 生成內容
   - 設定排程時間為 2 分鐘後
   - 儲存

2. **啟動排程器**：
   ```bash
   npm run scheduler
   ```

3. **等待排程時間**：
   - 排程器會每分鐘檢查一次
   - 當時間到達時，會自動開啟瀏覽器
   - 自動填入內容
   - **手動點擊發布按鈕**

4. **確認發布**：
   - 在 Threads 上確認貼文已發布
   - 關閉瀏覽器視窗

## 📝 API 端點

### POST /api/generate
生成 AI 內容

```json
{
  "prompt": "分享一個關於 AI 工具的小技巧"
}
```

### GET /api/posts
取得所有貼文

### POST /api/posts
建立新貼文

```json
{
  "content": "貼文內容",
  "prompt": "提示詞（選填）",
  "scheduledAt": "2024-01-01T12:00:00Z" // ISO 8601 格式（選填）
}
```

### GET /api/posts/[id]
取得單一貼文

### PUT /api/posts/[id]
更新貼文

### DELETE /api/posts/[id]
刪除貼文

### GET /api/scheduled
取得需要發布的排程貼文

## 🐛 疑難排解

### Playwright 無法找到輸入框

Threads 網站的選擇器可能會變動。如果遇到此問題：

1. 檢查 `scripts/publish-post.ts` 中的選擇器
2. 使用瀏覽器開發者工具檢查實際的選擇器
3. 更新 `textareaSelectors` 陣列

### 排程器沒有執行

1. 確認排程器正在運行：`npm run scheduler`
2. 檢查排程時間是否已設定
3. 查看終端機的日誌輸出

### OpenAI API 錯誤

1. 確認 `.env` 中的 `OPENAI_API_KEY` 已正確設定
2. 確認 API Key 有效且有足夠的額度
3. 檢查網路連線

## 📄 授權

此專案僅供個人使用，不作為 SaaS 產品。

## ⚠️ 免責聲明

此工具僅供個人使用，使用者需自行承擔使用風險。請遵守 Threads 的使用條款和服務條款。
