// web/src/components/NoInternetBanner/NoInternetBanner.js

import { useEffect, useState } from 'react'

const NoInternetBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine)

    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  if (isOnline) return null

  return(
    <>

    <div className=" top-0 left-0 right-0 bg-red-600 text-white text-center p-2 z-[99]">
        🔌 No Internet Connection
    </div>
    </>

  )
}

export default NoInternetBanner
