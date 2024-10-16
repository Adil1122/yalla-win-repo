'use client'

import React, { useEffect, useState } from 'react'
import { faArrowLeft, faChevronDown, faChevronLeft, faChevronRight, faPencil, faSearch, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { SwitchComponent } from '@/components/SwitchComponent'
import { get } from 'http'

type ResultType = 'shop' | 'app' | 'web'
type Tab = 'results' | 'images'

export default function AdminWinnerResults() {

   const [activeTab, setActiveTab] = useState<ResultType>('shop')
   const [activeTabTwo, setActiveTabTwo] = useState<Tab>('results')
   const [toggled, setToggled] = useState(false)

   const handleTabChange = (tab: ResultType) => {
      setActiveTab(tab)
   }
   
   const handleTabTwoChange = (tab: Tab) => {
      setActiveTabTwo(tab)
   }

   const handleToggle = () => {
      setToggled(!toggled)
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">

            <div className="mx-12 mt-24 flex items-center w-full lg:max-w-[60%] border-[2px] border-white text-white font-bold text-size-4">
               <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'shop' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('shop')}>Shop Results</div>
               <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'app' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('app')}>App Results</div>
               <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'web' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('web')}>Website Results</div>
            </div>

            <div className="flex items-center mt-12 px-12">
               <div className="flex items-center w-full gap-12 text-white text-size-4">
                  <div className={`cursor-pointer ${activeTabTwo === 'results' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('results')}>Results</div>
                  <div className={`cursor-pointer ${activeTabTwo === 'images' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('images')}>Images</div>
               </div>
               <div className="flex items-center gap-4 ml-auto">
                  <div className="text-white whitespace-nowrap font-medium text-size-4">Hide All Results</div>
                  <div className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer" onClick={handleToggle}>
                     <div className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${toggled ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col mt-12 px-12">
               {activeTabTwo == 'results' && (
                  <>
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game Name</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Ticket Number</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 3</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">891829182</td>
                           </tr>
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 4</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">891829182</td>
                           </tr>
                        </tbody>
                     </table>
                     <table className="w-full mt-12">
                        <thead>
                           <tr className="bg-white">
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Name</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Ticket Number</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Iphone 15</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">891829182</td>
                           </tr>
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Ihpne 4</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">891829182</td>
                           </tr>
                        </tbody>
                     </table>
                     
                  </>
               )}
               
               {activeTabTwo == 'images' && (
                  <div className="grid grid-cols-3 gap-6">
                     <div className="">
                        <img src="/assets/images/home.svg" alt="" />
                     </div>
                     <div className="">
                        <img src="/assets/images/home.svg" alt="" />
                     </div>
                     <div className="">
                        <img src="/assets/images/home.svg" alt="" />
                     </div>
                     <div className="">
                        <img src="/assets/images/home.svg" alt="" />
                     </div>
                     <div className="">
                        <img src="/assets/images/home.svg" alt="" />
                     </div>
                     <div className="">
                        <img src="/assets/images/home.svg" alt="" />
                     </div>
                  </div>
               )}
               
            </div>
         </div>
      </section>
   )
}
