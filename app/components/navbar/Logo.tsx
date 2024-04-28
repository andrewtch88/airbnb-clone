'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Logo = () => {
  const router = useRouter()
  return (
    <Image
      onClick={() => router.push('/')}
      alt="logo"
      className="hidden md:block cursor-pointer select-none"
      height="120"
      width="120"
      src="/images/logo.png"
      priority={true}
      style={{ width: 'auto', height: 'auto' }}
    />
  )
}

export default Logo
