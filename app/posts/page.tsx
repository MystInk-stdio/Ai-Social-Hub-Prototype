'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  content: string
  prompt: string | null
  scheduledAt: Date | null
  createdAt: Date
  updatedAt: Date
  status: string
  publishedAt: Date | null
}

export default function PostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editScheduledAt, setEditScheduledAt] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('載入失敗')
      const data = await response.json()
      setPosts(data)
    } catch (err: any) {
      setError(err.message || '載入貼文時發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此貼文嗎？')) return

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('刪除失敗')

      fetchPosts()
    } catch (err: any) {
      setError(err.message || '刪除時發生錯誤')
    }
  }

  const handleEdit = (post: Post) => {
    setEditingId(post.id)
    setEditContent(post.content)
    setEditScheduledAt(
      post.scheduledAt
        ? new Date(post.scheduledAt).toISOString().slice(0, 16)
        : ''
    )
  }

  const handleSaveEdit = async (id: string) => {
    if (!editContent.trim()) {
      setError('貼文內容不能為空')
      return
    }

    if (editContent.length > 300) {
      setError('貼文內容不能超過 300 字元')
      return
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
          scheduledAt: editScheduledAt || null,
          status: editScheduledAt ? 'scheduled' : 'draft',
        }),
      })

      if (!response.ok) throw new Error('更新失敗')

      setEditingId(null)
      fetchPosts()
    } catch (err: any) {
      setError(err.message || '更新時發生錯誤')
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return badges[status] || badges.draft
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      draft: '草稿',
      scheduled: '已排程',
      published: '已發布',
      cancelled: '已取消',
    }
    return texts[status] || status
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">載入中...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800 mb-2 block"
            >
              ← 返回首頁
            </button>
            <h1 className="text-3xl font-bold text-gray-900">貼文列表</h1>
          </div>
          <button
            onClick={() => router.push('/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ➕ 建立新貼文
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            <p>還沒有任何貼文</p>
            <button
              onClick={() => router.push('/create')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              建立第一則貼文
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                {editingId === post.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => {
                        if (e.target.value.length <= 300) {
                          setEditContent(e.target.value)
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                    <div className="text-sm text-gray-500 text-right">
                      {editContent.length} / 300
                    </div>
                    <input
                      type="datetime-local"
                      value={editScheduledAt}
                      onChange={(e) => setEditScheduledAt(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        儲存
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                          post.status
                        )}`}
                      >
                        {getStatusText(post.status)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 mb-3 whitespace-pre-wrap">
                      {post.content}
                    </p>
                    <div className="text-sm text-gray-500 space-y-1">
                      {post.prompt && (
                        <p>
                          <span className="font-medium">提示詞：</span>
                          {post.prompt}
                        </p>
                      )}
                      {post.scheduledAt && (
                        <p>
                          <span className="font-medium">排程時間：</span>
                          {new Date(post.scheduledAt).toLocaleString('zh-TW')}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">建立時間：</span>
                        {new Date(post.createdAt).toLocaleString('zh-TW')}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
