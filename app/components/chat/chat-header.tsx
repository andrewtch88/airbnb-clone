import Avatar from '../Avatar'
import { SocketIndicator } from '../socket-indicator'
interface ChatHeaderProps {
  name: string | null
  imageUrl: string | null
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ name, imageUrl }) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <Avatar src={imageUrl} />
      <p className="ml-4 font-semibold text-md text-black">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  )
}
