'use client'

import React, { useEffect, useState } from 'react'
import { faArrowLeft, faChevronDown, faChevronLeft, faChevronRight, faPencil, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { SwitchComponent } from '@/components/SwitchComponent'
import { get } from 'http'

type Tab = 'games' | 'products' | 'sales' | 'transaction'
type InvoiceTab = 'invoice' | 'ticket'

export default function AdminWinnerHistory() {

   const [activeTab, setActiveTab] = useState<Tab>('games')

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">
            <div className="px-12 mt-12">
               <div className="flex flex-row items-center gap-3 w-full lg:w-1/2">
                  <div className="flex items-center w-full gap-3 bg-white rounded-lg py-3 px-6">
                     <div>
                        <FontAwesomeIcon size="lg" icon={faSearch} />
                     </div>
                     <div className="w-full">
                        <input type="text" className="h-[40px] w-full bg-transparent ml-2 border-none focus:outline-none focus:ring-0 -mt-1" placeholder="Search By QR Id" />
                     </div>
                  </div>
                  <div className="w-full lg:w-fit">
                     <Menu>
                        <MenuButton className="w-full">
                           <div className="flex items-center border gap-6 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white">
                              <div className="capitalize font-medium text-size-2">Daily</div>
                              <FontAwesomeIcon size="lg" icon={faChevronDown} />
                           </div>
                        </MenuButton>
                        <MenuItems anchor="bottom" className="w-[110px] bg-white py-2 lg:py-4 rounded-lg mt-[2px] px-4">
                           <MenuItem>
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Daily</div>
                           </MenuItem>
                           <MenuItem>
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Weekly</div>
                           </MenuItem>
                           <MenuItem>
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Monthly</div>
                           </MenuItem>
                        </MenuItems>
                     </Menu>
                  </div>
               </div>
            </div>
            <div className="mt-12 px-12 flex items-center w-full gap-12 text-white text-size-4">
               <div className={`cursor-pointer ${activeTab === 'games' ? 'underline' : ''}`} onClick={() => handleTabChange('games')}>Game Winners</div>
               <div className={`cursor-pointer ${activeTab === 'products' ? 'underline' : ''}`} onClick={() => handleTabChange('products')}>Mega Prize Winners</div>
            </div>

            <div className="flex flex-col mt-12 px-12">
               <table className="w-full">
                  <thead>
                     <tr className="bg-white">
                     <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Trasnaction #</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Payment</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Via</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Card No</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Amount</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Note</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                  <tr>
                     <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1</td>
                     <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Paymenr type</td>
                     <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center"></td>
                     <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center"></td>
                     <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 1</td>
                     <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center"></td>
                     <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center"></td>
                  </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </section>
   )
}
