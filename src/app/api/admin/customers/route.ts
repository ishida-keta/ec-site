import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/** GET /api/admin/customers — 会員（顧客）一覧のみ。ADMIN（従業員）は含めない */
export async function GET(request: Request) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const search = url.searchParams.get('search')?.trim() ?? ''

  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
      prefecture: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(users)
}
