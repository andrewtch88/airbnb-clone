import getCurrentAdmin from '@/app/actions/getCurrentAdmin'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

interface IParams {
  suspendId?: string
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  try {
    const currentAdmin = await getCurrentAdmin()

    if (!currentAdmin) {
      return NextResponse.error()
    }

    const { suspendId } = params

    if (!suspendId || typeof suspendId !== 'string') {
      throw new Error('Invalid ID')
    }

    const listing = await prisma?.listing.update({
      where: {
        id: suspendId,
      },
      data: {
        isSuspended: true,
      },
    })

    return NextResponse.json(listing)
  } catch (error) {
    console.log('api/admin/suspendProperty/[suspendId]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
