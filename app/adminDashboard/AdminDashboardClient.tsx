'use client'

import { useEffect, useState } from 'react'
import Container from '../components/Container'

import '../globals.css'
import { FaUserFriends } from 'react-icons/fa'
import { BsHousesFill } from 'react-icons/bs'
import { MdOutlineRateReview } from 'react-icons/md'
import { GiReceiveMoney } from 'react-icons/gi'

import AdminManageReviews from '../components/admin/AdminManageReviews'
import Button from '../components/Button'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import AdminManageProperties from '../components/admin/AdminManageProperties'
import { safeListing, safePayment, safeReview } from '../types'
import AdminManageAppeals from '../components/admin/AdminManageAppeals'
import AdminViewPayments from '../components/admin/AdminViewPayments'
import { FieldValues, useForm } from 'react-hook-form'

interface AdminDashboardProps {
  appealListings: safeListing[]
  payments: safePayment[]
  initialListings: safeListing[]
  initialReviews: safeReview[]
}

const AdminDashboardClient: React.FC<AdminDashboardProps> = ({
  appealListings,
  payments,
  initialListings,
  initialReviews,
}) => {
  // console.log({ currentAdmin })

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('payment')
  const [sortReviewBy, setSortReviewBy] = useState('newest')
  const [sortPropertyBy, setSortPropertyBy] = useState('newest')

  const router = useRouter()

  const {
    register,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      searchUserBy: '',
    },
  })

  const searchUserBy = watch('searchByUser')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleTabClick = (e: any, tabId: any) => {
    e.preventDefault()
    setActiveTab(tabId)
  }

  const handleSignOut = () => {
    signOut()
    toast.success('You have logged out', { duration: 3000 })
    router.refresh()
  }

  return (
    <div className="overflow-x-auto">
      <Container>
        <div className="relative mb-10">
          <p className="text-3xl font-bold mr-4">
            Logged in as {'System Administrator'}
          </p>
          <div className="mt-4 md:mt-0 md:absolute md:top-0 md:right-0 w-20">
            <Button label="Logout" onClick={handleSignOut} />
          </div>
        </div>

        <div className="md:flex">
          <ul
            className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0"
            id="default-tab"
            data-tabs-toggle="#default-tab-content"
            role="tablist"
          >
            <li>
              <a
                href="#"
                className={`inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                  activeTab === 'suspendProperty' ? 'active' : ''
                }`}
                onClick={(e) => handleTabClick(e, 'suspendProperty')}
              >
                <FaUserFriends size={20} className="me-2" />
                <span className="whitespace-nowrap overflow-hidden">
                  Manage Properties
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                  activeTab === 'properties' ? 'active' : ''
                }`}
                onClick={(e) => handleTabClick(e, 'properties')}
              >
                <BsHousesFill size={20} className="me-2" />
                Manage Appeals
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                  activeTab === 'reviews' ? 'active' : ''
                }`}
                onClick={(e) => handleTabClick(e, 'reviews')}
              >
                <MdOutlineRateReview size={20} className="me-2" />
                Manage Reviews
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                  activeTab === 'payment' ? 'active' : ''
                }`}
                onClick={(e) => handleTabClick(e, 'payment')}
              >
                <GiReceiveMoney size={20} className="me-2" />
                View payments
              </a>
            </li>
          </ul>
          <div
            className={`p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full ${
              activeTab === 'suspendProperty' ? '' : 'hidden'
            }`}
            id="suspendProperty"
            role="tabpanel"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Underperforming Properties
              </h3>
              <div className="flex items-center mb-2">
                <p className="mr-2">Sort by: </p>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  value={sortPropertyBy}
                  onChange={(e) => setSortPropertyBy(e.target.value)}
                >
                  <option value="newest">Latest</option>
                  <option value="gte: 3, lte: 4">
                    Average Performing Properties
                  </option>
                  <option value="lte: 3">Below Average Properties</option>
                </select>
              </div>
            </div>
            <AdminManageProperties
              initialListings={initialListings}
              sortBy={mounted ? sortPropertyBy : 'default'}
            />
          </div>
          <div
            className={`p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full ${
              activeTab === 'properties' ? '' : 'hidden'
            }`}
            id="properties"
            role="tabpanel"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Latest Appeals on Property Suspensions
            </h3>
            <AdminManageAppeals listings={appealListings} />
          </div>
          <div
            className={`p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full ${
              activeTab === 'reviews' ? '' : 'hidden'
            }`}
            id="reviews"
            role="tabpanel"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Latest Reviews on Properties
              </h3>
              <div className="flex items-center mb-2">
                <p className="mr-2">Sort by: </p>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  value={sortReviewBy}
                  onChange={(e) => setSortReviewBy(e.target.value)}
                >
                  <option value="newest">Latest</option>
                  <option value="finalRating asc">Low to High</option>
                  <option value="finalRating desc">High to Low</option>
                </select>
              </div>
            </div>
            <AdminManageReviews
              sortBy={mounted ? sortReviewBy : 'default'}
              initialReviews={initialReviews}
            />
          </div>
          <div
            className={`p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full ${
              activeTab === 'payment' ? '' : 'hidden'
            }`}
            id="payment"
            role="tabpanel"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                View Payments
              </h3>
              {/* <div className="flex items-center mb-2">
                <p className="mr-2">Search by: </p>
                <Input
                  id="searchUserBy"
                  label="Username, Email"
                  register={register}
                  errors={errors}
                  required
                />
              </div> */}
            </div>
            <div className="overflow-x-auto">
              {/* <AdminViewPayments searchUserBy={searchUserBy} /> */}
              <AdminViewPayments payments={payments} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AdminDashboardClient
