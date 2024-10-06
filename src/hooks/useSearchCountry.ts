import { useState } from 'react'

interface Country {
  id: number;
  name: string;
}

export const useCountrySearch = (initialCountries: Country[]) => {
   const [query, setQuery] = useState('')
   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

   const filteredCountries =
      query === ''
         ? initialCountries
         : initialCountries.filter((country) =>
            country.name.toLowerCase().includes(query.toLowerCase())
         )

   return {
      query,
      setQuery,
      selectedCountry,
      setSelectedCountry,
      filteredCountries,
   }
}
