'use client'
import React from 'react'

// wrapper component to provide consistent styling to all child components (max width and centering)
interface ContainerProps {
  children: React.ReactNode
}

// CSS: viewport options
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      {children}
    </div>
  )
}

export default Container
