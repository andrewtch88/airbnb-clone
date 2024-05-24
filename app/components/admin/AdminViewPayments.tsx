'use client'

import { safePayment, SafeUser } from '@/app/types'
import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import Paginate from '../Paginate'
import { format } from 'date-fns'
import ListingCard from '../listing/ListingCard'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { IoStar } from 'react-icons/io5'

interface AdminViewPaymentsProps {
  searchUserBy?: string
  payments: safePayment[]
}

interface PaymentDetailsProps {
  payment: safePayment
}

interface UserDetailsProps {
  user: SafeUser | undefined
}

const ReservationDates: React.FC<PaymentDetailsProps> = ({ payment }) => {
  const start = new Date(payment.reservation.startDate)
  const end = new Date(payment.reservation.endDate)

  return (
    <>
      {format(start, 'PP')} - {format(end, 'PP')}
    </>
  )
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  if (!user) {
    return null
  }

  const { image, name, email } = user

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center">
        {image ? <Avatar src={image} /> : <Avatar src={null} />}
        <div>
          <p className="text-base text-gray-900 ms-4">{name}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center">
        <div className="flex items-center">
          <p className="text-sm text-black font-medium ml-2">{email}</p>
        </div>
      </div>
    </div>
  )
}
const TenantDetails: React.FC<PaymentDetailsProps> = ({ payment }) => {
  return <UserDetails user={payment.reservation.user} />
}
const OwnerDetails: React.FC<PaymentDetailsProps> = ({ payment }) => {
  return <UserDetails user={payment.reservation.listing.user} />
}

const AdminViewPayments: React.FC<AdminViewPaymentsProps> = ({
  searchUserBy,
  payments,
}) => {
  // const [payments, setPayments] = useState<safePayment[]>([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.get(
  //       `/api/admin/payment?searchUserBy=${searchUserBy}`
  //     )
  //     setPayments(response.data)
  //   }

  //   fetchData()
  // }, [searchUserBy])

  const tableItem = (payment: safePayment) => (
    <tr key={payment.id} className="border border-gray-300">
      <td className="px-4 py-2 text-gray-500">
        {format(new Date(payment.createdAt), 'PP')}
      </td>
      {/* <td className="px-4 py-2 text-gray-500">
        {<ReservationDates payment={payment} />}
      </td> */}
      <td className="px-4 py-2 text-gray-500">
        {payment.total_amount_currency + payment.totalAmount}
      </td>
      <td className="px-4 py-2">{<TenantDetails payment={payment} />}</td>
      <td className="px-4 py-2">
        {<OwnerDetails payment={payment} />}
        <div className="flex items-center">
          {/* PROPERTY */}
          <div className="">
            <Link href={`/listings/${payment.reservation.listing.id}`} passHref>
              <p className="underline text-blue-500">
                {payment.reservation.listing.title + ' : '}
              </p>
            </Link>
          </div>

          {/* REVIEW COUNT AND AVERAGE RATING */}
          <p className="flex items-center text-md text-black">
            <IoStar className="mr-1 block w-4 h-4 fill-current" />
            {payment.reservation.listing.reviewCount > 0
              ? `${payment.reservation.listing.averageRating.toFixed(2)}`
              : 'New'}
          </p>
        </div>
      </td>
    </tr>
  )

  return (
    <section
      aria-labelledby="payment-table"
      className="border-t border-gray-200 pt-6 lg:pt-6 overflow-x-auto"
    >
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white overflow-x-auto">
          <thead className="border border-gray-500">
            <tr className="border border-gray-500 font-medium text-left">
              <th className="px-4 py-2">Date Paid</th>
              {/* <th className="px-4 py-2">Reservation Dates</th> */}
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Tenant</th>
              <th className="px-4 py-2">Property Owner</th>
              <th className="px-4 py-2">Cancel Reason</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="border border-gray-200">
            <Paginate
              items={payments}
              itemsPerPage={5}
              renderItem={tableItem}
            />
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminViewPayments
