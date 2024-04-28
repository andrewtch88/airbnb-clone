import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import useCountries from '@/app/hooks/useCountries'

countries.registerLocale(enLocale)
const { getByValue } = useCountries()

const getRegionByAddress = (address: string) => {
  const addressArray = address.split(', ')
  let country = ''
  let location: string | undefined = ''

  for (let i = 0; i < addressArray.length; i++) {
    if (countries.getAlpha2Code(addressArray[i], 'en')) {
      country = addressArray[i]
      location = countries.getAlpha2Code(country, 'en')
      break
    }
  }

  const countryDetails = getByValue(location as string)
  return (
    countryDetails?.region ||
    'Region not found' + ', ' + country ||
    'Country not found'
  )
}

export default getRegionByAddress
