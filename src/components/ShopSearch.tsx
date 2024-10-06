import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useEffect, useRef, useState } from 'react'

export interface Shop {
  id: number;
  name: string;
}

interface ShopSearchProps {
  onSelectShop: (shop: Shop | null) => void;
}

export const ShopSearch: React.FC<ShopSearchProps> = ({ onSelectShop }) => {
   const [width, setWidth] = useState<number>(0)
   const containerRef = useRef<HTMLDivElement>(null)

   const shops: Shop[] = [
      { id: 1, name: 'Shop A' },
      { id: 2, name: 'Shop B' },
      { id: 3, name: 'Shop C' },
      { id: 4, name: 'Shop D' },
      { id: 5, name: 'Shop E' }
   ]

   useEffect(() => {
      if (containerRef.current) {
         setWidth(containerRef.current.offsetWidth);
      }
   }, [])

   const [query, setQuery] = useState('')
   const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

   const filteredShops = query === ''
      ? shops
      : shops.filter(shop => shop.name.toLowerCase().includes(query.toLowerCase()))

   const handleSelectShop = (shop: Shop | null) => {
      setSelectedShop(shop)
      onSelectShop(shop)
   }

   return (
      <div ref={containerRef} className="flex flex-row items-center px-6 gap-3 h-full w-full">
         <div className="w-full">
            <Combobox value={selectedShop} onChange={handleSelectShop} onClose={() => setQuery('')}>
               <ComboboxInput
                  aria-label="Search Shops"
                  placeholder="Search by shop name"
                  displayValue={(shop: Shop | null) => shop?.name || ''}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-[45px] w-full bg-transparent -ml-4 border-none focus:outline-none focus:ring-0"
               />
               <ComboboxOptions anchor="bottom" style={{ width: `${width}px` }} className="ml-4 rounded bg-white empty:invisible z-20 border border-lightone">
                  {filteredShops.map((shop: Shop) => (
                     <ComboboxOption key={shop.id} value={shop} className="data-[focus]:bg-lightfour cursor-pointer py-4 px-4">
                        {shop.name}
                     </ComboboxOption>
                  ))}
               </ComboboxOptions>
            </Combobox>
         </div>
      </div>
   )
}
