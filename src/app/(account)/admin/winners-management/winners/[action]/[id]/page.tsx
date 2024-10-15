'use client'

import React, { useState } from 'react'
import { faArrowLeft, faChevronDown, faChevronLeft, faChevronRight, faSearch, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'

type Tab = 'all' | 'app' | 'web' | 'shop'

export default function AdminWinnersView({ params } : {params: { action: string, id: string }}) {

   const [activeTab, setActiveTab] = useState<Tab>('all')
   const router = useRouter()

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">
            <div onClick={() => {router.back()}} className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
               <div className="cursor-pointer">
                  <FontAwesomeIcon size="xl" icon={faArrowLeft} />
               </div>
               <div className="cursor-pointer text-head-3 font-medium">View Details</div>
            </div>
            <div className="px-12 mt-12 w-full">
               <div className="flex flex-row items-center gap-3 w-full">
                  <div className="flex items-center w-full gap-3 bg-white rounded-lg py-3 px-6 w-full lg:w-1/3">
                     <div>
                        <FontAwesomeIcon size="lg" icon={faSearch} />
                     </div>
                     <div className="w-full">
                        <input type="text" className="h-[40px] w-full bg-transparent ml-2 border-none focus:outline-none focus:ring-0 -mt-1" placeholder={params.action == 'games' ? 'Search by ticket no' : 'Search by QR code'} />
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col mt-12 px-12">
               <table className="w-full">
                  <thead>
                     <tr className="bg-white">
                     <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tl rounded-bl">ID</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Name</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Image</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">{params.action == 'games' ? 'Game Name' : 'Product Name'}</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">{params.action == 'games' ? 'Game Type' : 'Product Type'}</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">QR ID</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Ticket Number</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winning Amount</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Annoucement Date</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                     <tr>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">3</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Person 3</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                           <img src="" alt="" />
                        </td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 3</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Rumble</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 1200</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1 Aug, 2024</td>
                     </tr>
                     <tr>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">3</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Person 3</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                           <img src="" alt="" />
                        </td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 3</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Rumble</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 1200</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1 Aug, 2024</td>
                     </tr>
                  </tbody>
               </table>
               <div className="font-poppins-medium mt-6 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">
                  <div className="px-4 py-2 flex items-center justify-center cursor-pointer">
                     <FontAwesomeIcon size="1x" icon={faChevronLeft} />
                  </div>
                  <div className="px-4 py-2 flex items-center justify-center cursor-pointer">1</div>
                  <div className="px-4 py-2 text-black bg-white flex items-center justify-center cursor-pointer">2</div>
                  <div className="px-4 py-2 flex items-center justify-center cursor-pointer">3</div>
                  <div className="px-4 py-2 flex items-center justify-center cursor-pointer">
                     <FontAwesomeIcon size="1x" icon={faChevronRight} />
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
