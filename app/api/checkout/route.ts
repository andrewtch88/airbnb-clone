import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import { stripe } from '@/app/libs/stripe'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Please login to perform this action.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { listingId, totalPrice, startDate, endDate, perNightPrice } = body

    if (!listingId || !totalPrice || !startDate || !endDate || !perNightPrice) {
      return NextResponse.error()
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
        isSuspended: false,
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Not a valid listing.' },
        { status: 400 }
      )
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'MYR',
          unit_amount: Math.round(totalPrice! * 100),
          product_data: {
            name: listing.title!,
            description: listing.description!.substring(0, 300) + '...',
            images: [listing.imageSrc[0]!],
          },
        },
      },
    ]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/listings/${listingId}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/listings/${listingId}?success=false`,
      line_items,
      metadata: {
        userId: currentUser.id,
        listingId: listingId,
        totalPrice: totalPrice,
        startDate: startDate,
        endDate: endDate,
        perNightPrice: perNightPrice,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.log('api/checkout', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
