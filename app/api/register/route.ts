import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

import prisma from '@/app/libs/prismadb'
import { verifyEmail } from '@devmehq/email-validator-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    const nameRegex = /^[a-zA-Z ]{2,30}$/
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    const { validFormat, validSmtp, validMx } = await verifyEmail({
      emailAddress: email,
      verifyMx: true,
      verifySmtp: false,
      timeout: 3000,
    })

    if (!validFormat && !validMx) {
      return NextResponse.json(
        { error: 'Invalid email format, please try again' },
        { status: 400 }
      )
    }

    if (nameRegex.test(name) === false) {
      return NextResponse.json(
        { error: 'Invalid name format, please try again' },
        { status: 400 }
      )
    }

    if (passwordRegex.test(password) === false) {
      return NextResponse.json(
        { error: 'Min 8 alphanumeric characters for password' },
        { status: 400 }
      )
    }

    const emailExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (emailExists) {
      return NextResponse.json(
        { error: 'Email already exists, please try again' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.log('api/register', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
