'use client'

import qs from 'query-string'
import { useCallback, useMemo, useState } from 'react'
import { Range } from 'react-date-range'
import { differenceInDays, formatISO } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'

import Calendar from '../inputs/Calendar'
import Counter from '../inputs/Counter'
import { regions } from '@/app/components/SearchByRegions'
import ButtonInput from '../inputs/ButtonWithIcons'
import { BiSearch } from 'react-icons/bi'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import PlacesAutocomplete from '../PlacesAutocomplete'
import Input from '../inputs/Input'
import Button from '../Button'
import Heading from '../Heading'
import { RegionsButtonsProps } from '../inputs/ButtonWithIcons'

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const Search = () => {
  // start flyout menu operations
  const router = useRouter()
  const params = useSearchParams()

  const selectedAddress = params?.get('address')
  const selectedRegion = params?.get('region')
  const selectedStartDate = params?.get('startDate')
  const selectedEndDate = params?.get('endDate')
  const selectedGuestCount = params?.get('guestCount')

  const locationLabel = useMemo(() => {
    if (selectedAddress && selectedRegion) {
      const addressArray = selectedAddress.split(', ')
      const country = addressArray[addressArray.length - 1]
      return country
    }

    if (selectedAddress) {
      const addressArray = selectedAddress.split(', ')
      const country = addressArray[addressArray.length - 1]
      return country
    }

    if (selectedRegion) {
      return selectedRegion
    }

    return 'Anywhere'
  }, [selectedAddress, selectedRegion])

  const durationLabel = useMemo(() => {
    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate as string)
      const end = new Date(selectedEndDate as string)
      let diff = differenceInDays(end, start)

      if (diff === 0) {
        diff = 1
      }

      return `${diff} Days`
    }

    return 'Any Week'
  }, [selectedStartDate, selectedEndDate])

  const guestCountLabel = useMemo(() => {
    if (selectedGuestCount) {
      return `${selectedGuestCount} Guests`
    }

    return 'Add Guests'
  }, [selectedGuestCount])

  const [step, setStep] = useState(STEPS.LOCATION)
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      address: '',
      region: '',
      roomCount: 1,
      bathroomCount: 1,
      guestCount: 1,
    },
  })

  // register(`formField name`) or setCustomValue(`formField name`, value) then watch(`formField name`) to read current input value
  const address = watch('address')
  const region = watch('region')
  const guestCount = watch('guestCount')
  const roomCount = watch('roomCount')
  const bathroomCount = watch('bathroomCount')

  // arguments are form field name and value
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true, // field value changed or not
      shouldTouch: true, // field has been interacted or not, for handling validation messages or styles
      shouldValidate: true,
    })
  }

  const prevPage = useCallback(() => {
    setStep((value) => value - 1)
  }, [])

  const nextPage = useCallback(() => {
    setStep((value) => value + 1)
  }, [])

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      if (step !== STEPS.INFO) {
        return nextPage()
      }

      setIsLoading(true)

      let currentQuery = {}

      if (params) {
        currentQuery = qs.parse(params.toString())
      }

      const updatedQuery: any = {
        ...currentQuery,
        guestCount: guestCount,
        roomCount: roomCount,
        bathroomCount: bathroomCount,
      }

      if (address) {
        updatedQuery.address = address
      }

      if (region && region !== "I'm flexible") {
        updatedQuery.region = region
      }

      // transform dates to string as they're used as url parameters
      if (dateRange.startDate) {
        updatedQuery.startDate = formatISO(dateRange.startDate)
      }

      if (dateRange.endDate) {
        updatedQuery.endDate = formatISO(dateRange.endDate)
      }

      const url = qs.stringifyUrl(
        {
          url: '/',
          query: updatedQuery,
        },
        { skipNull: true }
      )

      setStep(STEPS.LOCATION)

      router.push(url)

      setIsLoading(false)
    },
    [
      step,
      address,
      region,
      router,
      guestCount,
      roomCount,
      bathroomCount,
      dateRange,
      params,
      nextPage,
    ]
  )

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search'
    }

    return 'Next'
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined
    }

    return 'Back'
  }, [step])

  const secondaryAction = step === STEPS.LOCATION ? undefined : prevPage
  // end flyout menu operations

  const RegionsButtons: React.FC<RegionsButtonsProps> = ({
    regions,
    region,
    setCustomValue,
    style,
  }) => {
    return (
      <>
        {regions.map((item) => (
          <div key={item.label} className="col-span-1 p-1">
            <ButtonInput
              selected={region === item.label}
              onClick={() => setCustomValue('region', item.label)}
              description={item.label}
              imageUrl={item.image}
              squared
              style={style}
            />
          </div>
        ))}
      </>
    )
  }

  let bodyContent = (
    <>
      {/* Search Places Suggestion on the left */}
      <div className="md:w-1/2 md:order-first">
        <div className="font-bold p-5 gap-1 ">Search by destinations</div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-1 p-5">
          <PlacesAutocomplete noMapOnSmallScreens={true}>
            <Input
              id="address"
              label="Where"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </PlacesAutocomplete>
        </div>
      </div>

      {/* Search By Region larger screens */}
      <div className="md:w-1/2 flex flex-col p-5 hidden md:block">
        <div className="font-bold">Search by region</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 max-h-[50vh] overflow-y-auto">
          <RegionsButtons
            regions={regions}
            region={region}
            setCustomValue={setCustomValue}
          />
        </div>
      </div>

      {/* Search By Region smaller screens*/}
      <div className="md:hidden flex flex-col p-5">
        <div className="font-bold">Search by region</div>
        <div className="w-full h-[40vh] rounded-lg object-cover flex space-x-2 overflow-x-auto">
          <RegionsButtons
            regions={regions}
            region={region}
            setCustomValue={setCustomValue}
            style={{ width: '150px', height: '150px' }}
          />
        </div>
      </div>
    </>
  )

  if (step === STEPS.DATE) {
    bodyContent = (
      <>
        <div className="md:w-1/2 md:order-first p-4">
          <Heading title="When's your trip?" subtitle="Pick your dates" />
        </div>

        <div className="md:w-1/2 flex flex-col pb-8">
          <Calendar
            onChange={(value) => setDateRange(value.selection)}
            value={dateRange}
          />
        </div>

        <div className="p-10"></div>
      </>
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <>
        <div className="md:w-1/2 md:order-first p-5">
          <Heading
            title="More information"
            subtitle="Find your perfect place!"
          />
        </div>

        <div className="md:w-1/2 flex flex-col pb-8">
          <div className="p-3">
            <Counter
              onChange={(guestCount) =>
                setCustomValue('guestCount', guestCount)
              }
              value={guestCount}
              title="Guests"
              subtitle="How many people?"
            />
          </div>
          <hr />
          <div className="p-3">
            <Counter
              onChange={(roomCount) => setCustomValue('roomCount', roomCount)}
              value={roomCount}
              title="Rooms"
              subtitle="How many rooms you need?"
            />
          </div>
          <hr />
          <div className="p-3">
            <Counter
              onChange={(bathroomCount) =>
                setCustomValue('bathroomCount', bathroomCount)
              }
              value={bathroomCount}
              title="Bathrooms"
              subtitle="How many bathrooms you need?"
            />
          </div>
          <div className="p-3"></div>
        </div>
      </>
    )
  }

  // not using searchModal, using popover (headless ui)
  return (
    <Popover>
      {/* Placeholder Search Bar */}
      <Popover.Button>
        <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer select-none">
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-semibold px-6">{locationLabel}</div>
            <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
              {durationLabel}
            </div>
            <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-10">
              <div className="hidden sm:block">{guestCountLabel}</div>
              <div className="flex items-center p-2 bg-rose-500 rounded-full text-white font-bold">
                <BiSearch size={18} />
                <div className="hidden sm:block ml-2">Search</div>
              </div>
            </div>
          </div>
        </div>
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        {/* Flyout Search Menu */}
        <Popover.Panel className="items-center justify-center absolute left-1/2 z-50 mt-4 flex w-screen max-w-max -translate-x-1/2 px-4 mx-auto">
          <div className="relative w-full mx-auto max-w-screen-lg w-full md:w-3/4 mx-auto overflow-hidden bg-white rounded-3xl text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 flex flex-col md:flex-row relative">
            {bodyContent}

            {/* Footer */}
            <div className="flex flex-col items-end absolute inset-x-0 bottom-0">
              <div className="h-16 w-full flex items-end justify-end">
                {/* Added container with fixed height */}
                {secondaryAction && secondaryActionLabel && (
                  <Button
                    outline
                    disabled={isLoading}
                    label={secondaryActionLabel}
                    onClick={secondaryAction}
                  />
                )}
                <Button
                  disabled={isLoading}
                  label={actionLabel}
                  onClick={onSubmit}
                />
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default Search
