import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { FC, useCallback } from 'react'
import { IoMdClose } from 'react-icons/io'

interface ImageUploadProps {
  onChange: (value: string[]) => void
  value: string[]
  disabled?: boolean
}

const ImageUpload: FC<ImageUploadProps> = ({ onChange, value, disabled }) => {
  const handleUpload = useCallback(
    (result: any) => {
      onChange([...value, result.info.secure_url])
    },
    [onChange, value]
  )

  // Remove the image at the specified index
  const handleRemove = (index: number) => {
    const updatedImages = [...value]
    updatedImages.splice(index, 1)
    onChange(updatedImages)
  }

  return (
    <CldUploadWidget
      onUpload={disabled ? undefined : handleUpload}
      uploadPreset="chpfnrpy"
    >
      {({ open }) => {
        return (
          <div
            onClick={() => (disabled ? undefined : open())}
            className={`relative cursor-pointer hover:opacity-70 transition border-dashed 
              border-2 border-neutral-300 flex flex-col text-neutral-600 mt-[-30px]
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-semibold text-lg font-size-sm">
              Click here to upload, first image = thumbnail
            </div>
            <div className="flex flex-wrap gap-4">
              {Array.isArray(value) &&
                value.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative w-50 h-50 overflow-hidden"
                    style={{
                      height: '140px',
                      width: '140px',
                    }}
                  >
                    <Image
                      fill
                      style={{ objectFit: 'cover' }}
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <button
                      onClick={() => !disabled && handleRemove(index)}
                      className="p-1 border-0 hover:opacity-70 transition absolute left-0 top-0 bg-red-500 rounded-full text-white"
                    >
                      <IoMdClose size={18} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )
      }}
    </CldUploadWidget>
  )
}

export default ImageUpload
