import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useEffect, useRef, useState } from 'react'

interface Item {
  id: number;
  name: string;
}

interface CountryCitySearchProps {
  onSelectItem: (item: Item | null) => void;
  searchIn: 'countries' | 'cities';
}

export const CountryCitySearch: React.FC<CountryCitySearchProps> = ({
  onSelectItem,
  searchIn
}) => {
   const [width, setWidth] = useState<number>(0)
   const containerRef = useRef<HTMLDivElement>(null)

   /*var countries : Item[] = [
      { id: 1, name: 'United Arab Emirates' },
      { id: 2, name: 'Saudi Arabia' },
      { id: 3, name: 'Qatar' },
      { id: 4, name: 'Bahrain' },
      { id: 5, name: 'Kuwait' },
   ]
   
   var cities : Item[] = [
      { id: 1, name: 'Damam' },
      { id: 2, name: 'Mecca' },
      { id: 3, name: 'Dubai' }
   ]*/

   const [countries, setCountries] = useState<any>([]);
   const [cities, setCities] = useState<any>([]);
   //var cities: Item[] = [];



   useEffect(() => {
      if (containerRef.current) {
         setWidth(containerRef.current.offsetWidth)
      }
      getCitiesAndCountries();
   }, [])

   function getUniqueArray(array: any){
      var uniqueArray = [];
      if (array.length > 0) {
         uniqueArray[0] = array[0];
      }
      for(var i = 0; i < array.length; i++){
          var isExist = false;
          for(var j = 0; j < uniqueArray.length; j++){
              if(array[i] == uniqueArray[j]){
                  isExist = true;
                  break;
              }
              else{
                  isExist = false;
              }
          }
          if(isExist == false){
              uniqueArray[uniqueArray.length] = array[i];
          }
      }
      return uniqueArray;
  }

   async function getCitiesAndCountries() {
      try {
         let response = await fetch('/api/admin/search', {
            method: 'GET',
         });
         var content = await response.json();
         if(!response.ok) {

         } else {
            //console.log('content: ', content)
            var users = content.users;
            var cities_array:any = [];
            var countries_array:any = [];
            for(var i = 0; i < users.length; i++) {
               if(users[i].city !== null) {
                  cities_array.push(users[i].city)
               }
               
               if(users[i].country !== null) {
                  countries_array.push(users[i].country)
               }
            }
            cities_array = getUniqueArray(cities_array);
            countries_array = getUniqueArray(countries_array);
            var count = 1;
            for(var i = 0; i < cities_array.length; i++) {
               cities.push({
                  id: count,
                  name: cities_array[i]
               })
               count++;
            }

            count = 1;
            for(var i = 0; i < countries_array.length; i++) {
               countries.push({
                  id: count,
                  name: countries_array[i]
               })
               count++;
            }
            setCities(cities)
            setCountries(countries)

            console.log('cities: ', cities)
            console.log('countries: ', countries)
         }
      } catch (error) {
         
      }
   }

   const [query, setQuery] = useState('')
   const [selectedItem, setSelectedItem] = useState<Item | null>(null)

   const items = searchIn === 'countries' ? countries : cities;

   
   const filteredItems = query === ''
      ? items
      //@ts-ignore
      : items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))

   const handleSelectItem = (item: Item | null) => {
      setSelectedItem(item)
      onSelectItem(item)
   }

   return (
      <div ref={containerRef} className="flex flex-row items-center px-6 gap-3 h-full w-full">
         <div>
         <FontAwesomeIcon size="lg" icon={faSearch} />
         </div>
         <div className="w-full">
         <Combobox value={selectedItem} onChange={handleSelectItem} onClose={() => setQuery('')}>
            <ComboboxInput
               aria-label="Search"
               placeholder={`Type to search by ${searchIn}`}
               displayValue={(item: Item | null) => item?.name || ''}
               onChange={(event) => setQuery(event.target.value)}
               className="h-[40px] w-full bg-transparent ml-2 border-none focus:outline-none focus:ring-0 -mt-1"
            />
               <ComboboxOptions anchor="bottom" style={{ width: `${width}px` }} className="-ml-6 mt-5 rounded bg-white empty:invisible">
                  {filteredItems.map((item: Item) => (
                  <ComboboxOption
                     key={item.id}
                     value={item}
                     className="data-[focus]:bg-lightfour cursor-pointer py-4 px-4"
                  >
                     {item.name}
                  </ComboboxOption>
                  ))}
               </ComboboxOptions>
         </Combobox>
         </div>
      </div>
   )
}
