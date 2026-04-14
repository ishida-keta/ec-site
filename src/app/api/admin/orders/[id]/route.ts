import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

// PUT /api/admin/orders/[id] - 注文ステータス更新（ADMIN専用）
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'status は必須です' }, { status: 400 })
    }

    const upperStatus = status.toUpperCase() as OrderStatus
    if (!Object.values(OrderStatus).includes(upperStatus)) {
      return NextResponse.json({ error: '無効なステータスです' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: upperStatus },
      include: {
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
        user: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('[PUT /api/admin/orders/[id]]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
