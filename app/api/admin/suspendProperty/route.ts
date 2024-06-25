import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentAdmin from '@/app/actions/getCurrentAdmin'

export async function GET(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin()

    if (!currentAdmin) {
      return NextResponse.error()
    }

    const url = new URL(request.url)
    const sortBy = url.searchParams.get('sortBy')

    let query: any = {}
    let orderBy: any = {}

    if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' }
      query = { averageRating: { lt: 4, gt: 0 } }
    } else if (sortBy === 'gte: 3, lte: 4') {
      query = { averageRating: { gte: 3, lte: 4 } }
    } else if (sortBy === 'lte: 3') {
      query = { averageRating: { lte: 3, gt: 0 } }
    } else if (sortBy !== null) {
      throw new Error('Invalid Sort By Selection')
    }

    query = {
      ...query,
      isSuspended: false,
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: orderBy,
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.log('api/admin/suspendProperty', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
