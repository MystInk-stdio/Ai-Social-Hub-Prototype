import cron from 'node-cron'
import { prisma } from '../lib/prisma'
import { publishPost } from './publish-post'

/**
 * 排程器：每分鐘檢查一次是否有需要發布的貼文
 * 當找到需要發布的貼文時，啟動 Playwright 自動填入內容
 * 但不自動點擊發布按鈕，需要用戶手動確認
 */
async function checkScheduledPosts() {
  try {
    const now = new Date()
    console.log(`[${now.toISOString()}] 檢查排程貼文...`)

    // 找出所有已排程且時間已到的貼文
    const scheduledPosts = await prisma.post.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: {
          lte: now,
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: 1, // 一次只處理一個貼文
    })

    if (scheduledPosts.length === 0) {
      console.log('沒有需要發布的貼文')
      return
    }

    const post = scheduledPosts[0]
    console.log(`找到需要發布的貼文: ${post.id}`)
    console.log(`內容: ${post.content.substring(0, 50)}...`)

    // 更新狀態為處理中（可以添加一個 'processing' 狀態）
    await prisma.post.update({
      where: { id: post.id },
      data: {
        status: 'scheduled', // 保持 scheduled，直到用戶手動發布
      },
    })

    // 啟動 Playwright 自動填入
    try {
      await publishPost({
        content: post.content,
        postId: post.id,
      })

      // 注意：這裡不自動更新為 'published'
      // 因為用戶可能取消發布
      // 如果需要，可以添加一個手動標記已發布的 API
      console.log('✅ 貼文內容已自動填入瀏覽器')
      console.log('⚠️  請在瀏覽器中手動確認並點擊發布')
    } catch (error: any) {
      console.error(`❌ 處理貼文 ${post.id} 時發生錯誤:`, error.message)
      // 可以選擇將狀態改回 'scheduled' 或標記為 'failed'
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: 'scheduled', // 保持 scheduled，下次再試
        },
      })
    }
  } catch (error) {
    console.error('檢查排程貼文時發生錯誤:', error)
  }
}

// 啟動排程器：每分鐘執行一次
console.log('🚀 啟動 Threads AI 排程器...')
console.log('⏰ 每分鐘檢查一次排程貼文')
console.log('⚠️  系統不會自動點擊發布按鈕，需要手動確認')

// 立即執行一次檢查
checkScheduledPosts()

// 然後每分鐘執行一次
cron.schedule('* * * * *', () => {
  checkScheduledPosts()
})

// 優雅關閉
process.on('SIGINT', () => {
  console.log('\n正在關閉排程器...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n正在關閉排程器...')
  process.exit(0)
})
