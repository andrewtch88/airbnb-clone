import { Resend } from 'resend'
import BookingConfirmation from '@/app/components/emails/BookingConfirmationEmail'
import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

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

    const { tenantEmail, tenantName, tenantImage, reviewText, startDate } = body

    if (
      !tenantEmail ||
      !tenantName ||
      !tenantImage ||
      !reviewText ||
      !startDate
    ) {
      return NextResponse.error()
    }

    const hintText = `“Hi there, I am arriving at ${startDate}.\n See you soon!”`

    const { data, error } = await resend.emails.send({
      from: 'Bearbnb <onboarding@resend.dev>',
      to: [tenantEmail],
      subject: 'New booking by ' + tenantName,
      react: BookingConfirmation({
        tenantName,
        tenantImage,
        reviewText: `${hintText}`,
        startDate,
      }),
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.log('api/email', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
