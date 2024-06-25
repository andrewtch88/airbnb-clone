import hasConversation from '../actions/getConversations'
import getCurrentUser from '../actions/getCurrentUser'
import { getInboxNotification } from '../actions/getNotifications'
import EmptyState from '../components/EmptyState'
import InboxClient from './InboxClient'

const InboxPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to view your inbox"
      />
    )
  }

  const conversations = await hasConversation()
  const notifications = await getInboxNotification()

  if (conversations.length === 0) {
    return (
      <EmptyState
        title="No conversations found"
        subtitle="Looks like you have not chat with anyone yet."
      />
    )
  }

  return (
    <InboxClient // @ts-ignore
      inboxNotifications={notifications}
      conversations={conversations} // @ts-ignore
      currentUser={currentUser}
    />
  )
}

export default InboxPage
