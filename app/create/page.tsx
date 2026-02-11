'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePostPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [content, setContent] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('請輸入提示詞')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '生成失敗')
      }

      const data = await response.json()
      setContent(data.content)
    } catch (err: any) {
      setError(err.message || '生成內容時發生錯誤')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!content.trim()) {
      setError('請輸入或生成貼文內容')
      return
    }

    if (content.length > 300) {
      setError('貼文內容不能超過 300 字元')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          prompt,
          scheduledAt: scheduledAt || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '儲存失敗')
      }

      router.push('/posts')
    } catch (err: any) {
      setError(err.message || '儲存時發生錯誤')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← 返回
          </button>
          <h1 className="text-3xl font-bold text-gray-900">建立新貼文</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* 提示詞輸入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              提示詞（Prompt）
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：分享一個關於 AI 工具的小技巧"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating ? '生成中...' : '🤖 使用 AI 生成內容'}
            </button>
          </div>

          {/* 貼文內容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              貼文內容（最多 300 字元）
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setContent(e.target.value)
                }
              }}
              placeholder="貼文內容將顯示在這裡，您可以手動編輯"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
            />
            <div className="mt-1 text-sm text-gray-500 text-right">
              {content.length} / 300
            </div>
          </div>

          {/* 排程時間 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              排程發布時間（選填）
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              留空則儲存為草稿，設定時間後系統會在指定時間自動填入內容（需手動確認發布）
            </p>
          </div>

          {/* 儲存按鈕 */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving || !content.trim()}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isSaving ? '儲存中...' : '💾 儲存貼文'}
            </button>
            <button
              onClick={() => router.push('/posts')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
