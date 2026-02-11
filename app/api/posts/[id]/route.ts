import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePostSchema = z.object({
  content: z.string().min(1).max(300).optional(),
  prompt: z.string().optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  status: z.enum(['draft', 'scheduled', 'published', 'cancelled']).optional(),
})

// GET /api/posts/[id] - 取得單一貼文
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - 更新貼文
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validated = updatePostSchema.parse(body)

    const updateData: any = {}
    if (validated.content !== undefined) updateData.content = validated.content
    if (validated.prompt !== undefined) updateData.prompt = validated.prompt
    if (validated.scheduledAt !== undefined) {
      updateData.scheduledAt = validated.scheduledAt
        ? new Date(validated.scheduledAt)
        : null
    }
    if (validated.status !== undefined) updateData.status = validated.status
    updateData.updatedAt = new Date()

    const post = await prisma.post.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - 刪除貼文
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
