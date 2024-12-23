'use client'

import React, { useState } from 'react'
import { faArrowLeft, faChevronDown, faChevronLeft, faChevronRight, faSearch, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'

type Tab = 'all' | 'app' | 'web' | 'shop'

export default function AdminEnterTicketNumber({ params } : {params: { action: string; }}) {

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
               <div className="cursor-pointer text-head-3 font-medium">{params.action == 'games' ? 'Enter Ticket Number' : 'Enter QR Code'}</div>
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
                  <div className="flex items-center">
                     <Menu>
                        <MenuButton className="w-full">
                           <div className="flex items-center border gap-6 lg:border-[3px] border-white lg:rounded-xl py-4 px-10 text-white">
                              <div className="capitalize font-medium text-size-2">Daily</div>
                              <FontAwesomeIcon size="lg" icon={faChevronDown} />
                           </div>
                        </MenuButton>
                        <MenuItems anchor="bottom" className="w-[110px] bg-white py-2 lg:py-4 rounded-lg mt-[2px] px-4">
                           <MenuItem>
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Yalla 3</div>
                           </MenuItem>
                           <MenuItem>
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Yalla 4</div>
                           </MenuItem>
                           <MenuItem>
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Yalla 6</div>
                           </MenuItem>
                        </MenuItems>
                     </Menu>
                  </div>
               </div>
            </div>

            <div className="flex flex-col mt-12 px-12">
               <table className="w-full">
                  <thead>
                     <tr className="bg-white">
                        {params.action == 'products' && (
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Username</th>
                        )}
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">{params.action == 'games' ? 'Game Name' : 'Product Name'}</th>
                        {params.action == 'products' && (
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Image</th>
                        )}
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">{params.action == 'games' ? 'Ticket No' : 'QR Code'}</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                     <tr>
                        {params.action == 'products' && (
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Name here</td>
                        )}
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 3</td>
                        {params.action == 'products' && (
                           <img src="" alt="" />
                        )}
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">891829182</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1 Aug, 2024</td>
                        <td>
                           <div className="flex items-center justify-center gap-2">
                              <button type="button" onClick={() => router.push(`/admin/winners-management/winners/${params.action == 'games' ? 'games' : 'products'}/12`)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                 <FontAwesomeIcon size="lg" icon={faEye} />
                              </button>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        {params.action == 'products' && (
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Name here</td>
                        )}
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 3</td>
                        {params.action == 'products' && (
                           <img src="" alt="" />
                        )}
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">891829182</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1 Aug, 2024</td>
                        <td>
                           <div className="flex items-center justify-center gap-2">
                              <button type="button" onClick={() => router.push(`/admin/winners-management/winners/${params.action == 'games' ? 'games' : 'products'}/12`)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                 <FontAwesomeIcon size="lg" icon={faEye} />
                              </button>
                           </div>
                        </td>
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
