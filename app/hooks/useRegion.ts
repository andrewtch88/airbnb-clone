import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import useCountries from '@/app/hooks/useCountries'

countries.registerLocale(enLocale)
const { getByValue } = useCountries()

const getRegionByAddress = (address: string) => {
  const addressArray = address.split(', ')
  const country = addressArray[addressArray.length - 1]

  const location = countries.getAlpha2Code(country, 'en')
  const countryName = getByValue(location as string)

  return (
    countryName?.region ||
    'Region not found' + ', ' + countryName ||
    'Country not found'
  )
}

export default getRegionByAddress
