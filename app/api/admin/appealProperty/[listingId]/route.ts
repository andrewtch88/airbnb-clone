import getCurrentAdmin from '@/app/actions/getCurrentAdmin'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId?: string
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  try {
    const currentAdmin = await getCurrentAdmin()

    if (!currentAdmin) {
      return NextResponse.error()
    }

    const { listingId } = params

    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.error()
    }

    const body = await request.json()

    const { appeal } = body

    if (!appeal) {
      return NextResponse.error()
    }

    let existingAppeal, existingProperty

    if (appeal === 'approve') {
      existingAppeal = await prisma.appeal.deleteMany({
        where: {
          listingId,
        },
      })

      existingProperty = await prisma.listing.update({
        where: {
          id: listingId,
        },
        data: {
          isSuspended: false,
        },
      })
    } else if (appeal === 'reject') {
      existingAppeal = await prisma.appeal.update({
        where: {
          listingId,
        },
        data: {
          status: 'rejected',
        },
      })
    }

    if (appeal === 'approve') {
      return NextResponse.json({
        appeal: existingAppeal,
        property: existingProperty,
      })
    } else if (appeal === 'reject') {
      return NextResponse.json({
        appeal: existingAppeal,
        message: 'Appeal rejected',
      })
    }
  } catch (error) {
    console.log('api/admin/appealProperty', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
