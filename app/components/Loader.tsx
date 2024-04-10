'use client'

import React from 'react'
import { PuffLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className="h-[70vh] w-full flex justify-center items-center">
      <PuffLoader color="red" size={100} />
    </div>
  )
}

export default Loader
