'use client'
import { IconType } from 'react-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import qs from 'query-string'

// this component is used for handling clicking categories and updating the url search parameters
interface NavbarCategoriesProps {
  icon: IconType
  label: string
  selected?: boolean
}

const NavbarCategories: React.FC<NavbarCategoriesProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter()
  const params = useSearchParams()

  const handleClick = useCallback(() => {
    let currentQuery = {}

    if (params) {
      currentQuery = qs.parse(params.toString()) // convert string to object (later used to combine url with parameters)
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label, // here combine url with parameters
    }

    if (params?.get('category') === label) {
      delete updatedQuery.category // when clicking the same category again, delete the parameter
    }

    const url = qs.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      { skipNull: true }
    )

    router.push(url)
  }, [label, params, router])

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer 
        ${selected ? 'border-b-neutral-800' : 'border-transparent'}
        ${selected ? 'text-neutral-800' : 'text-neutral-500'}
      `}
    >
      <Icon size={26} />
      <div className="font-medium text-sm select-none">{label}</div>
    </div>
  )
}

export default NavbarCategories
