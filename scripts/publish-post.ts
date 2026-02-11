import { chromium, Browser, Page } from 'playwright'

interface PublishOptions {
  content: string
  postId: string
}

/**
 * 自動填入 Threads 貼文內容，但不自動點擊發布按鈕
 * 用戶需要手動確認並點擊發布
 */
export async function publishPost({ content, postId }: PublishOptions) {
  let browser: Browser | null = null

  try {
    console.log(`[${new Date().toISOString()}] 開始處理貼文 ${postId}`)
    console.log(`內容: ${content.substring(0, 50)}...`)

    // 啟動瀏覽器（非 headless 模式，讓用戶可以看到）
    // 嘗試使用系統的 Chrome，如果沒有則使用 Chromium
    try {
      browser = await chromium.launch({
        headless: false,
        channel: 'chrome',
      })
    } catch {
      try {
        browser = await chromium.launch({
          headless: false,
          channel: 'msedge',
        })
      } catch {
        browser = await chromium.launch({
          headless: false,
        })
      }
    }

    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    })

    const page = await context.newPage()

    // 前往 Threads 網站
    console.log('正在開啟 Threads...')
    await page.goto('https://www.threads.net/', {
      waitUntil: 'networkidle',
    })

    // 等待頁面載入
    await page.waitForTimeout(2000)

    // 尋找貼文輸入框
    // Threads 的貼文輸入框選擇器可能會變動，這裡提供幾個常見的選擇器
    const textareaSelectors = [
      'textarea[placeholder*="開始一個討論串"]',
      'textarea[placeholder*="Start a thread"]',
      'div[contenteditable="true"][role="textbox"]',
      'textarea[aria-label*="貼文"]',
      'textarea[aria-label*="Post"]',
    ]

    let textareaFound = false
    let textarea: any = null

    for (const selector of textareaSelectors) {
      try {
        textarea = await page.waitForSelector(selector, { timeout: 5000 })
        if (textarea) {
          textareaFound = true
          console.log(`找到輸入框: ${selector}`)
          break
        }
      } catch (e) {
        // 繼續嘗試下一個選擇器
      }
    }

    if (!textareaFound) {
      throw new Error(
        '無法找到貼文輸入框。請確認您已登入 Threads，且頁面已完全載入。'
      )
    }

    // 點擊輸入框以聚焦
    await textarea.click()
    await page.waitForTimeout(500)

    // 填入內容
    console.log('正在填入貼文內容...')
    await textarea.fill(content)
    await page.waitForTimeout(500)

    // 確認內容已填入
    const filledContent = await textarea.inputValue()
    if (filledContent !== content) {
      // 如果 fill 失敗，嘗試使用 type
      await textarea.clear()
      await textarea.type(content, { delay: 50 })
    }

    console.log('✅ 貼文內容已自動填入！')
    console.log('⚠️  請手動確認內容並點擊發布按鈕')
    console.log('⚠️  系統不會自動點擊發布按鈕，以確保安全性')

    // 標記貼文為已處理（但不標記為已發布，因為用戶可能取消）
    // 這個狀態更新會在排程器中處理

    // 保持瀏覽器開啟，讓用戶可以手動發布
    console.log('瀏覽器將保持開啟，請手動完成發布...')
    console.log('發布完成後，請關閉瀏覽器視窗')

    // 等待用戶手動操作（最多等待 10 分鐘）
    // 實際使用時，用戶可以在發布後關閉瀏覽器
    await page.waitForTimeout(600000) // 10 分鐘

    return { success: true, message: '內容已填入，等待用戶手動發布' }
  } catch (error: any) {
    console.error('❌ 發布過程中發生錯誤:', error.message)
    throw error
  } finally {
    // 注意：這裡不自動關閉瀏覽器，讓用戶可以手動操作
    // 如果需要，可以添加一個選項來控制是否自動關閉
    // if (browser) await browser.close()
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('用法: tsx scripts/publish-post.ts <content> <postId>')
    process.exit(1)
  }

  const [content, postId] = args
  publishPost({ content, postId })
    .then(() => {
      console.log('完成')
      process.exit(0)
    })
    .catch((error) => {
      console.error('錯誤:', error)
      process.exit(1)
    })
}
