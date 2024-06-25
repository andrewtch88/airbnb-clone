import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import useCountries from '@/app/hooks/useCountries'

const getRegionByAddress = (address: string) => {
  // countries.registerLocale(enLocale)
  // const { getByValue } = useCountries()

  const addressArray = address.split(', ')
  let country = ''
  let location: string | undefined = ''

  // Iterate from the end to the beginning
  for (let i = addressArray.length - 1; i >= 0; i--) {
    if (countries.getAlpha2Code(addressArray[i], 'en')) {
      country = addressArray[i]
      location = countries.getAlpha2Code(country, 'en')
      break
    }
  }

  // const countryDetails = getByValue(location as string)
  return (
    // countryDetails?.region || 'Region not found' + ', ' +
    country || 'Country not found'
  )
}

export const europeanCountries = [
  'Albania',
  'Andorra',
  'Armenia',
  'Austria',
  'Azerbaijan',
  'Belarus',
  'Belgium',
  'Bosnia and Herzegovina',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Georgia',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Kazakhstan',
  'Kosovo',
  'Latvia',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Moldova',
  'Monaco',
  'Montenegro',
  'Netherlands',
  'North Macedonia',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Russia',
  'San Marino',
  'Serbia',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
  'Turkey',
  'Ukraine',
  'United Kingdom',
  'Vatican City',
]

export default getRegionByAddress
