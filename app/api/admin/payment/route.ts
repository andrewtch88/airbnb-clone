import getCurrentAdmin from '@/app/actions/getCurrentAdmin'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function GET(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin()

    if (!currentAdmin) {
      return NextResponse.error()
    }

    const url = new URL(request.url)

    let searchUserBy: any
    // searchUserBy = url.searchParams.get('searchUserBy')

    const payments = await prisma.payment.findMany({
      include: {
        reservation: {
          include: {
            user: true, // Includes the user related to the reservation
            listing: {
              include: {
                user: true, // Includes the user related to the listing
              },
            },
          },
        },
      },
      // where: {
      //   OR: [
      //     {
      //       reservation: {
      //         user: {
      //           OR: [
      //             {
      //               name: { contains: searchUserBy, mode: 'insensitive' },
      //             },
      //             {
      //               email: { contains: searchUserBy, mode: 'insensitive' },
      //             },
      //           ],
      //         },
      //       },
      //     },
      //     {
      //       reservation: {
      //         listing: {
      //           user: {
      //             OR: [
      //               {
      //                 name: {
      //                   contains: searchUserBy,
      //                   mode: 'insensitive',
      //                 },
      //               },
      //               {
      //                 email: {
      //                   contains: searchUserBy,
      //                   mode: 'insensitive',
      //                 },
      //               },
      //             ],
      //           },
      //         },
      //       },
      //     },
      //   ],
      // },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.log('api/admin/payment', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
