'use client'

export interface RegionsButtonsProps {
  countries: {
    label: string
    image: string
  }[]
  country: string
  setCustomValue: (id: string, value: any) => void
  style?: React.CSSProperties
}

interface ButtonInputProps {
  onClick: (value: string) => void
  selected: boolean
  label?: string
  icon?: React.ReactNode
  description?: string
  imageUrl?: string
  squared?: boolean
  style?: React.CSSProperties
}

const ButtonInput: React.FC<ButtonInputProps> = ({
  label,
  icon,
  onClick,
  selected,
  description,
  imageUrl,
  squared,
  style,
}) => {
  return (
    <>
      <div
        onClick={() => {
          if (label) {
            onClick(label)
          }
          if (description) {
            onClick(description)
          }
        }}
        className={`${
          !squared ? 'p-4 gap-3' : ''
        } relative rounded-xl border-2 flex flex-col hover:border-black transition cursor-pointer
        ${selected ? 'border-black' : 'border-neutral-200'}`}
        style={style}
      >
        <div className="text-4xl">{icon}</div>
        <img src={imageUrl} className="object-cover w-full h-full rounded-md" />
        <div className="font-semilight">{label}</div>
      </div>
      <div className="font-semilight text-sm md:text-lg lg:text-sm">
        {description}
      </div>
    </>
  )
}

export default ButtonInput
