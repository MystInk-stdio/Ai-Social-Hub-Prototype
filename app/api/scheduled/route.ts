import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/scheduled - 取得需要發布的排程貼文
export async function GET() {
  try {
    const now = new Date()
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
    })

    return NextResponse.json(scheduledPosts)
  } catch (error) {
    console.error('Error fetching scheduled posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheduled posts' },
      { status: 500 }
    )
  }
}
