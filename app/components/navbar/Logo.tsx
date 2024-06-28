'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface LogoProps {
  showComponent?: boolean
}

const Logo: React.FC<LogoProps> = ({ showComponent }) => {
  const router = useRouter()

  return (
    <>
      <Image
        onClick={() =>
          showComponent == false
            ? router.push('/adminDashboard')
            : router.push('/listingsPage')
        }
        alt="logo"
        className="hidden lg:block cursor-pointer select-none"
        height="120"
        width="120"
        src="/images/logo.png"
        priority={true}
        style={{ width: 'auto', height: 'auto' }}
      />
      <Image
        onClick={() =>
          showComponent == false
            ? router.push('/adminDashboard')
            : router.push('/listingsPage')
        }
        alt="small logo"
        className="lg:hidden cursor-pointer select-none"
        height="60"
        width="60"
        src="/images/small_logo.jpg"
        priority={true}
        style={{ width: 'auto', height: 'auto' }}
      />
    </>
  )
}

export default Logo
