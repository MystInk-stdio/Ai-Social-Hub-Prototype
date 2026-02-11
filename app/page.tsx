import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Threads AI 排程系統
        </h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">
            ⚠️ <strong>安全提示：</strong> 系統不會自動點擊發布按鈕，所有貼文都需要手動確認後發布。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/create"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">
              ➕ 建立新貼文
            </h2>
            <p className="text-gray-600">
              使用 AI 生成 Threads 貼文內容，並儲存為草稿或設定排程時間
            </p>
          </Link>

          <Link
            href="/posts"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">
              📋 貼文列表
            </h2>
            <p className="text-gray-600">
              查看、編輯、刪除所有貼文，並設定排程發布時間
            </p>
          </Link>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">
            📌 使用說明
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>建立貼文：輸入提示詞，AI 會生成內容（最多 300 字元）</li>
            <li>編輯內容：可以手動修改 AI 生成的內容</li>
            <li>設定排程：選擇發布時間，系統會在指定時間自動填入內容</li>
            <li>手動發布：系統會開啟瀏覽器並自動填入，但需要您手動點擊發布</li>
            <li>啟動排程器：執行 <code className="bg-blue-100 px-2 py-1 rounded">npm run scheduler</code></li>
          </ol>
        </div>
      </div>
    </main>
  )
}
