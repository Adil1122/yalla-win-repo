'use client'

import React, { useState } from 'react'
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import IBarChart from '@/components/dashboard/IBarChart'
import Modal from '@/components/modal'

export default function AdminSelectWinners() {

   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const dataset = [
      { sales: 12, day: 'MON' },
      { sales: 34, day: 'TUE' },
      { sales: 28, day: 'WED' },
      { sales: 6, day: 'THU' },
      { sales: 2, day: 'FRI' },
      { sales: 22, day: 'SAT' },
      { sales: 16, day: 'SUN' },
   ]

   const handleAnnouneWinner = (action: 'games' | 'products') => {
      setModalIsOpen(true)
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col w-full h-full">
            <div className="flex flex-col gap-4 lg:flex-row">
               <div className="flex flex-col lg:flex-row items-center border lg:border-[3px] border-white">
                  <div className="flex items-center justify-center bg-white text-darkone whitespace-nowrap w-full lg:w-fit px-16 py-4 font-medium text-size-2 h-full cursor-pointer">Raffle Games</div>
                  <div className="flex items-center justify-center text-white whitespace-nowrap w-full lg:w-fit px-16 py-4 font-medium text-size-2 h-full cursor-pointer">Raffle Products</div>
               </div>
               <div className="lg:ml-auto w-full lg:w-fit">
                  <Menu>
                     <MenuButton className="w-full">
                        <div className="flex items-center gap-2 w-full lg:w-fit border lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white">
                           <div className="capitalize font-medium text-size-2">Announce new winner</div>
                           <div className="ml-auto">
                              <FontAwesomeIcon size="lg" icon={faChevronDown} />
                           </div>
                        </div>
                     </MenuButton>
                     <MenuItems anchor="bottom" className="w-[230px] bg-white py-2 lg:py-4 rounded-lg mt-[2px] px-8">
                        <MenuItem>
                           <div onClick={() => handleAnnouneWinner('games')} className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Raffle Games</div>
                        </MenuItem>
                        <MenuItem>
                           <div onClick={() => handleAnnouneWinner('products')} className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Raffle Products</div>
                        </MenuItem>
                     </MenuItems>
                  </Menu>
               </div>
            </div>
            <div className="flex flex-col gap-3 lg:gap-6 mt-20 lg:mt-36 w-full lg:w-[70%] mx-auto">
               <div className="flex flex-col lg:flex-row lg:gap-2 text-white font-bold text-head-1 lg:text-head-6">
                  <div>Total Sales Amount:</div>
                  <div>AED 12343</div>
               </div>
               <div className="bg-light-background-three backdrop-blur-64 w-full lg:px-12 py-6">
                  <IBarChart dataset={dataset}
                     xAxisDataKey="day"
                     yAxisLabel=""
                     seriesDataKey="sales"
                     height={350}
                  />
               </div>
            </div>
         </div>

         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Announce New Winner</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-10">
                  <div className="flex flex-col gap-6">
                     <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Amount</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="AED 20" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">Game Name</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" />
                           </div>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">People %</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" />
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">Country</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" />
                           </div>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">City</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" />
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center ml-auto gap-6">
                        <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                        <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Save</button>
                     </div>
                  </div>
               </div>
            </div>
         </Modal>
      </section>
   )
}
