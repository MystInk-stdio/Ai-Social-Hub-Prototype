# 專案結構說明

```
threads-ai-scheduler/
│
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── generate/
│   │   │   └── route.ts          # POST /api/generate - AI 內容生成
│   │   ├── posts/
│   │   │   ├── route.ts          # GET/POST /api/posts - 貼文列表/建立
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET/PUT/DELETE /api/posts/[id] - 單一貼文操作
│   │   └── scheduled/
│   │       └── route.ts          # GET /api/scheduled - 查詢排程貼文
│   │
│   ├── create/
│   │   └── page.tsx              # 建立貼文頁面 (/create)
│   │
│   ├── posts/
│   │   └── page.tsx              # 貼文列表頁面 (/posts)
│   │
│   ├── layout.tsx                # 根佈局
│   ├── page.tsx                  # 首頁 (/)
│   └── globals.css               # 全域樣式
│
├── lib/
│   └── prisma.ts                 # Prisma Client 單例
│
├── prisma/
│   └── schema.prisma             # Prisma Schema (SQLite)
│
├── scripts/
│   ├── scheduler.ts              # node-cron 排程器
│   └── publish-post.ts           # Playwright 自動填入腳本
│
├── .env.example                   # 環境變數範例
├── .gitignore                    # Git 忽略檔案
├── next.config.js                # Next.js 設定
├── package.json                  # 專案依賴和腳本
├── postcss.config.js             # PostCSS 設定
├── tailwind.config.js            # TailwindCSS 設定
├── tsconfig.json                 # TypeScript 設定
│
├── README.md                     # 專案說明文件
├── SETUP.md                      # 快速設定指南
└── PROJECT_STRUCTURE.md          # 本檔案
```

## 主要檔案說明

### API Routes

- **`/api/generate`**: 呼叫 OpenAI API 生成貼文內容
- **`/api/posts`**: 貼文的 CRUD 操作
- **`/api/scheduled`**: 查詢需要發布的排程貼文

### 前端頁面

- **`/`**: 首頁，提供導航連結
- **`/create`**: 建立新貼文頁面
- **`/posts`**: 貼文列表和管理頁面

### 排程系統

- **`scripts/scheduler.ts`**: 使用 node-cron 每分鐘檢查排程貼文
- **`scripts/publish-post.ts`**: 使用 Playwright 自動填入內容（不自動發布）

### 資料庫

- **`prisma/schema.prisma`**: 定義 Post 模型
- **`lib/prisma.ts`**: Prisma Client 單例，避免開發環境重複建立連線

## 資料流程

1. **建立貼文**：
   ```
   用戶輸入提示詞 → /api/generate → OpenAI API → 返回內容
   → 用戶編輯 → /api/posts → 儲存到 SQLite
   ```

2. **排程發布**：
   ```
   scheduler.ts (每分鐘) → 查詢排程貼文 → publish-post.ts
   → Playwright 開啟瀏覽器 → 自動填入內容 → 等待手動發布
   ```

## 安全設計

- ✅ 不自動點擊發布按鈕
- ✅ 不儲存 Threads 密碼
- ✅ 不實作自動登入
- ✅ 所有操作都需要手動確認
