'use client'

import Select from 'react-select'
import { categories } from '../navbar/Categories'

export type CategorySelectValue = {
  label: string
  icon: React.ReactNode
  description: string
}

interface CountrySelectProps {
  value?: CategorySelectValue
  onChange: (value: CategorySelectValue) => void
}

const CategorySelectOption: React.FC<CountrySelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <Select
        placeholder="Choose category"
        // isClearable
        options={categories}
        value={value} // value reflected on the select option
        onChange={(value) => onChange(value as CategorySelectValue)}
        // options={""} is used here
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            <div className="text-2xl">{option.icon}</div>
            <div>{option.label}</div>
          </div>
        )}
        // custom styling for Select component
        // classNames={{
        //   control: () => 'p-3 border-2',
        //   input: () => 'text-lg',
        //   option: () => 'text-lg',
        // }}
        // custom theme for Select component
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6',
          },
        })}
      />
    </div>
  )
}

export default CategorySelectOption
