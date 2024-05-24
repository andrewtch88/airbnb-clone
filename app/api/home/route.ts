import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const franceResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=France+things+to+do&language=en&key=${process.env.NEXT_PUBLIC_GMAP_API_KEY}`
    )
    const australiaResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Australia+things+to+do&language=en&key=${process.env.NEXT_PUBLIC_GMAP_API_KEY}`
    )
    const japanResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Japan+point+of+interest&language=en&key=${process.env.NEXT_PUBLIC_GMAP_API_KEY}`
    )

    if (!franceResponse.ok || !australiaResponse.ok || !japanResponse.ok) {
      throw new Error('Failed to fetch data')
    }

    const franceData = await franceResponse.json()
    const australiaData = await australiaResponse.json()
    const japanData = await japanResponse.json()

    return NextResponse.json({ franceData, australiaData, japanData })
  } catch (error) {
    console.log('api/home', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
