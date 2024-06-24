import {
  Listing,
  Reservation,
  User,
  Review,
  Admin,
  Appeal,
  Payment,
  ReserveNotification,
  InboxNotification,
  ConversationNotification,
} from '@prisma/client'

export type safeListing = Omit<Listing, 'createdAt'> & {
  createdAt: string
  updatedAt: string
  overallRatingCounts?: { [key: number]: number }
  ratingCategoriesAvg?: {
    cleanlinessRating: number
    accuracyRating: number
    checkIn_Rating: number
    communicationRating: number
    locationRating: number
    valueRating: number
  }
  user?: SafeUser
  reviews?: safeReview[] // an array of SafeReview objects
  appeal?: safeAppeal
}

// reviews: [
//   {
//     id: 'review1',
//       // ...
//     },
//   },
//   {
//     id: 'review2',
//       // ...
//     },
//   },
//   {
//     id: 'review3',
//       // ...
//     },
//   },
// ];

export type safePayment = Omit<Payment, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  reservation: safeReservation
}

export type safeReservation = Omit<
  Reservation,
  'createdAt' | 'startDate' | 'endDate' | 'listing' | 'user'
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

export type SafeAdmin = Omit<
  Admin,
  'createdAt' | 'updatedAt' | 'emailVerified'
> & {
  createdAt: string
  updatedAt: string
  emailVerified: string | null
}

export type safeReview = Omit<Review, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  user: SafeUser // later can use review.user to associate the user that makes the review
  listing?: safeListing
}

export type safeAppeal = Omit<Appeal, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  user: SafeUser
  listing: safeListing
}

export type safeReserveNotification = Omit<
  ReserveNotification,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

export type safeInboxNotification = Omit<
  InboxNotification,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
  conversations: ConversationNotification
}
