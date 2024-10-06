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

   const countries : Item[] = [
      { id: 1, name: 'United Arab Emirates' },
      { id: 2, name: 'Saudi Arabia' },
      { id: 3, name: 'Qatar' },
      { id: 4, name: 'Bahrain' },
      { id: 5, name: 'Kuwait' },
   ]
   
   const cities : Item[] = [
      { id: 1, name: 'Damam' },
      { id: 2, name: 'Mecca' },
      { id: 3, name: 'Dubai' }
   ]

   useEffect(() => {
      if (containerRef.current) {
         setWidth(containerRef.current.offsetWidth)
      }
   }, [])

   const [query, setQuery] = useState('')
   const [selectedItem, setSelectedItem] = useState<Item | null>(null)

   const items = searchIn === 'countries' ? countries : cities;

   const filteredItems = query === ''
      ? items
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
