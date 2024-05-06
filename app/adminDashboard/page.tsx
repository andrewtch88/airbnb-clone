import getCurrentAdmin from '../actions/getCurrentAdmin'
import getListings from '../actions/getListings'
import AdminLogin from '../components/admin/AdminLogin'
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

  const listings = await getListings({ lowRatedOnly: true })

  return <AdminDashboardClient listings={listings} />
}

export default AdminDashboardPage
