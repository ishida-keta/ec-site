import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/admin/orders - 全注文一覧（ADMIN専用）
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim()

    const orders = await prisma.order.findMany({
      where: search
        ? {
            OR: [
              { shippingName: { contains: search, mode: 'insensitive' } },
              { shippingEmail: { contains: search, mode: 'insensitive' } },
              { id: { contains: search } },
              {
                user: {
                  email: { contains: search, mode: 'insensitive' },
                },
              },
            ],
          }
        : undefined,
      include: {
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('[GET /api/admin/orders]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
