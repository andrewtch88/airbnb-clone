import { Listing, Reservation, User } from '@prisma/client'

export type safeListing = Omit<Listing, 'createdAt'> & {
  createdAt: string
}

export type safeReservation = Omit<
  Reservation,
  'createdAt' | 'startDate' | 'endDate' | 'listing | user'
> & {
  createdAt: string
  startDate: string
  endDate: string
  listing: safeListing
  user: SafeUser
}

export type SafeUser = Omit<
  User,
  'createdAt' | 'updatedAt' | 'emailVerified'
> & {
  createdAt: string
  updatedAt: string
  emailVerified: string | null
}
