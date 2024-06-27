import getCurrentAdmin from '../actions/getCurrentAdmin'
import getListings from '../actions/getListings'
import getPayments from '../actions/getPayments'
import getReviews from '../actions/getReviews'
import AdminLogin from '../components/admin/AdminLogin'
import { safePayment, safeListing, safeReview } from '../types'
import AdminDashboardClient from './AdminDashboardClient'

const AdminDashboardPage = async () => {
  const currentAdmin = await getCurrentAdmin()
  // console.log({ currentAdmin })

  if (!currentAdmin) {
    return (
      <>
        <AdminLogin />
      </>
    )
  }

  const appealListings = await getListings({ onAppeal: true })
  const payments = await getPayments()
  const listings = await getListings({
    underPerforming: true,
  })
  const reviews = await getReviews()

  return (
    <AdminDashboardClient
      payments={payments as safePayment[]}
      appealListings={appealListings as safeListing[]}
      initialListings={listings as safeListing[]}
      initialReviews={reviews as safeReview[]}
    />
  )
}

export default AdminDashboardPage
