import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// POST /api/generate - 使用 OpenAI 生成 Threads 貼文
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '你是一個專業的社群媒體內容創作者，專門為 Threads 平台撰寫吸引人的貼文。貼文必須在 300 字元以內，風格要簡潔有力、引人入勝。',
        },
        {
          role: 'user',
          content: `根據以下提示，生成一篇 Threads 貼文（最多 300 字元）：\n\n${prompt}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.8,
    })

    const generatedContent =
      completion.choices[0]?.message?.content?.trim() || ''

    if (!generatedContent) {
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      )
    }

    // 確保內容不超過 300 字元
    const content = generatedContent.slice(0, 300)

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate content',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
