import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/** GET /api/admin/customers/[id] — 顧客 1 名と注文一覧（ADMIN アカウントは 404） */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const user = await prisma.user.findFirst({
    where: { id, role: 'USER' },
    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
      prefecture: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}
