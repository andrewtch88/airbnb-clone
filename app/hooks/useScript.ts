import { useEffect } from 'react'

interface UseScriptProps {
  url: string
}

const useScript: React.FC<UseScriptProps> = ({ url }) => {
  useEffect(() => {
    const script = document.createElement('script')

    script.src = url
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [url])

  // Returning null or a placeholder element, as it's required by the React.FC type
  return null
}

export default useScript
