import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const postSchema = z.object({
  content: z.string().min(1).max(300),
  prompt: z.string().optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
})

// GET /api/posts - 取得所有貼文
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - 建立新貼文
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = postSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        content: validated.content,
        prompt: validated.prompt,
        scheduledAt: validated.scheduledAt
          ? new Date(validated.scheduledAt)
          : null,
        status: validated.scheduledAt ? 'scheduled' : 'draft',
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
