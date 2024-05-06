'use client'

import { useState } from 'react'
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
import { safeListing } from '../types'

interface AdminDashboardProps {
  listings: safeListing[]
}

const AdminDashboardClient: React.FC<AdminDashboardProps> = ({ listings }) => {
  // console.log({ currentAdmin })
  const [activeTab, setActiveTab] = useState('suspendProperty')
  const [sortBy, setSortBy] = useState('newest')

  const router = useRouter()

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
              View Payments
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
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Properties with Low Ratings
          </h3>
          <AdminManageProperties listings={listings} />
        </div>
        <div
          className={`p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full ${
            activeTab === 'properties' ? '' : 'hidden'
          }`}
          id="properties"
          role="tabpanel"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Appeals Tab
          </h3>
          <p className="mb-2">
            This is some placeholder content the Appeals tab's associated
            content, clicking another tab will toggle the visibility of this one
            for the next.
          </p>
          <p>
            The tab JavaScript swaps classes to control the content visibility
            and styling.
          </p>
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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Latest</option>
                <option value="finalRating asc">Low to High</option>
                <option value="finalRating desc">High to Low</option>
              </select>
            </div>
          </div>
          <AdminManageReviews sortBy={sortBy} />
        </div>
        <div
          className={`p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full ${
            activeTab === 'payment' ? '' : 'hidden'
          }`}
          id="payment"
          role="tabpanel"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Payment Tab
          </h3>
          <p className="mb-2">
            This is some placeholder content the Payment tab's associated
            content, clicking another tab will toggle the visibility of this one
            for the next.
          </p>
          <p>
            The tab JavaScript swaps classes to control the content visibility
            and styling.
          </p>
        </div>
      </div>
    </Container>
  )
}

export default AdminDashboardClient
