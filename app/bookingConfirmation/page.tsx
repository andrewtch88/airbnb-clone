import React from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import EmptyState from '../components/EmptyState'
import BookingConfirmationClient from './BookingConfirmationClient'

const BookingConfirmationPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You must be logged in to create a reservation"
      />
    )
  }

  return <BookingConfirmationClient />
}

export default BookingConfirmationPage
