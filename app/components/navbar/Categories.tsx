'use client'

import Container from '../Container'
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb'
import { FaSkiing } from 'react-icons/fa'
import { MdOutlineVilla } from 'react-icons/md'
import { GiBoatFishing, GiForestCamp } from 'react-icons/gi'
import NavbarCategories from './NavbarCategories'
import { usePathname, useSearchParams } from 'next/navigation'

const convertIconToNode = (IconType: any): React.ReactNode => {
  // Assuming IconType is a React component
  return <IconType />
}

export const categories = [
  {
    label: 'Beach',
    icon: convertIconToNode(TbBeach),
    description: 'This property is close to the beach!',
  },
  {
    label: 'Modern',
    icon: convertIconToNode(MdOutlineVilla),
    description: 'This property is modern!',
  },
  {
    label: 'Countryside',
    icon: convertIconToNode(TbMountain),
    description: 'This property is in the countryside!',
  },
  {
    label: 'Pools',
    icon: convertIconToNode(TbPool),
    description: 'This is property has a beautiful pool!',
  },
  {
    label: 'Lake',
    icon: convertIconToNode(GiBoatFishing),
    description: 'This property is near a lake!',
  },
  {
    label: 'Skiing',
    icon: convertIconToNode(FaSkiing),
    description: 'This property has skiing activities!',
  },
  {
    label: 'Camping',
    icon: convertIconToNode(GiForestCamp),
    description: 'This property offers camping activities!',
  },
]

const Categories = () => {
  const params = useSearchParams()
  const category = params?.get('category')
  const pathname = usePathname()

  const isMainPage = pathname === '/'

  if (!isMainPage) {
    return null
  }

  return (
    <Container>
      <div
        className="
        pt-4
        flex 
        flex-row 
        items-center 
        justify-between
        overflow-x-auto"
      >
        {categories.map((item) => (
          <NavbarCategories
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  )
}

export default Categories
