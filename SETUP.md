# 快速設定指南

## 步驟 1: 安裝依賴

```bash
npm install
```

## 步驟 2: 設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入您的 OpenAI API Key：

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
DATABASE_URL="file:./prisma/dev.db"
```

## 步驟 3: 初始化資料庫

```bash
npm run db:generate
npm run db:push
```

這會：
- 生成 Prisma Client
- 建立 SQLite 資料庫檔案

## 步驟 4: 安裝 Playwright 瀏覽器

```bash
npx playwright install chromium
```

## 步驟 5: 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 步驟 6: 啟動排程器（另一個終端機視窗）

```bash
npm run scheduler
```

排程器會每分鐘檢查一次是否有需要發布的貼文。

## 測試完整流程

### 1. 建立測試貼文

1. 前往 http://localhost:3000/create
2. 輸入提示詞：「測試貼文：這是一個自動填入測試」
3. 點擊「使用 AI 生成內容」
4. 檢查生成的內容
5. 設定排程時間為 2 分鐘後（例如：現在是 14:00，設定為 14:02）
6. 點擊「儲存貼文」

### 2. 確認排程器運行

在執行 `npm run scheduler` 的終端機中，您應該會看到：

```
🚀 啟動 Threads AI 排程器...
⏰ 每分鐘檢查一次排程貼文
⚠️  系統不會自動點擊發布按鈕，需要手動確認
[2024-01-01T12:00:00.000Z] 檢查排程貼文...
沒有需要發布的貼文
```

### 3. 等待排程時間

當排程時間到達時，排程器會：

1. 檢測到需要發布的貼文
2. 啟動 Playwright（非 headless 模式，會看到瀏覽器視窗）
3. 開啟 https://www.threads.net/
4. 自動填入貼文內容
5. **等待您手動點擊發布按鈕**

### 4. 手動發布

1. 在開啟的瀏覽器中確認內容
2. **手動點擊發布按鈕**
3. 發布完成後，關閉瀏覽器視窗

## 常見問題

### Q: Playwright 無法找到輸入框？

A: Threads 網站的選擇器可能會變動。如果遇到此問題：

1. 確認您已登入 Threads（在瀏覽器中手動登入一次）
2. 檢查 `scripts/publish-post.ts` 中的選擇器
3. 使用瀏覽器開發者工具檢查實際的選擇器
4. 更新 `textareaSelectors` 陣列

### Q: 排程器沒有執行？

A: 確認：

1. 排程器正在運行：`npm run scheduler`
2. 排程時間已正確設定
3. 查看終端機的日誌輸出

### Q: OpenAI API 錯誤？

A: 確認：

1. `.env` 中的 `OPENAI_API_KEY` 已正確設定
2. API Key 有效且有足夠的額度
3. 網路連線正常

## 安全提醒

- ✅ 系統**不會**自動點擊發布按鈕
- ✅ 系統**不會**儲存 Threads 密碼
- ✅ 系統**不會**實作自動登入
- ✅ 所有貼文都需要手動確認後發布
