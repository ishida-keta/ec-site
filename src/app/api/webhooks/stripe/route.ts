import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(body),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Webhook] Signature verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const metadata = session.metadata
      if (!metadata?.userId) {
        console.error('[Webhook] Missing userId in metadata')
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      // line_items の取得（productId のため itemsJson を使用）
      const items: { productId: string; name: string; price: number; quantity: number }[] =
        JSON.parse(metadata.itemsJson ?? '[]')

      const totalAmount = session.amount_total ?? 0

      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null

      await prisma.order.create({
        data: {
          userId: metadata.userId,
          totalAmount,
          status: 'PAID',
          paymentMethod: 'credit',
          stripePaymentId: paymentIntentId,
          shippingName: metadata.shippingName ?? '',
          shippingEmail: metadata.shippingEmail ?? '',
          shippingPhone: metadata.shippingPhone ?? '',
          shippingZip: metadata.shippingZip ?? '',
          shippingCity: metadata.shippingCity ?? '',
          shippingAddress: metadata.shippingAddress ?? '',
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
          },
        },
      })

      console.log(`[Webhook] Order created for session: ${session.id}`)
    } catch (err) {
      console.error('[Webhook] Failed to create order:', err)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
