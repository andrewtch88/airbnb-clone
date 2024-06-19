import hasConversation from '../actions/getConversations'
import getCurrentUser from '../actions/getCurrentUser'
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

  if (conversations.length === 0) {
    return (
      <EmptyState
        title="No conversations found"
        subtitle="Looks like you have not chat with anyone yet."
      />
    )
  }

  return <InboxClient conversations={conversations} />
}

export default InboxPage
