import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/app/libs/stripe'
import prisma from '@/app/libs/prismadb'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return NextResponse.json(
      { error: `Webhook error: ${error.message}` },
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session
  const userId = session?.metadata?.userId
  const listingId = session?.metadata?.listingId
  const totalPrice = session?.metadata?.totalPrice
  const startDate = session?.metadata?.startDate
  const endDate = session?.metadata?.endDate
  const perNightPrice = session?.metadata?.perNightPrice

  if (event.type === 'checkout.session.completed') {
    if (
      !userId ||
      !listingId ||
      !totalPrice ||
      !startDate ||
      !endDate ||
      !perNightPrice
    ) {
      return NextResponse.json(
        { error: `Webhook error: Missing metadata` },
        { status: 400 }
      )
    }

    try {
      const reserveAndPaymentRecord = await prisma.$transaction(
        async (prisma) => {
          const createReservation = await prisma.listing.update({
            where: { id: listingId },
            data: {
              reservations: {
                create: {
                  // relation between listing and reservation
                  userId: userId,
                  startDate: new Date(startDate),
                  endDate: new Date(endDate),
                  totalPrice: Number(totalPrice),
                },
              },
            },
            select: {
              reservations: {
                select: {
                  id: true,
                },
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
              },
            },
          })

          const reservationId = createReservation.reservations[0].id

          const existingPayment = await prisma.payment.findUnique({
            where: { reservationId },
          })

          if (existingPayment) {
            throw new Error('Payment already exists for this reservation')
          }

          const payment = await prisma.payment.create({
            data: {
              reservationId: reservationId,
              totalAmount: Math.round(Number(totalPrice!)),
              total_amount_currency: 'MYR',
              perNightPrice: Math.round(Number(perNightPrice!)),
              per_night_currency: 'MYR',
            },
          })

          return { createReservation, payment }
        }
      )

      return NextResponse.json(reserveAndPaymentRecord)
    } catch (error) {
      console.error('Error creating reservation:', error)
      return NextResponse.json(
        { error: `Internal Server Error: ${error.message}` },
        { status: 500 }
      )
    }
  } else {
    return NextResponse.json(
      { message: `Unhandled event type: ${event.type}` },
      { status: 200 }
    )
  }
}
