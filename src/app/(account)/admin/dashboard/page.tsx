'use client'

import React, { useState } from 'react'
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import IBarChart from '@/components/dashboard/IBarChart'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import GoogleMap from '@/components/GoogleMap'
import { CountryCitySearch } from '@/components/CountryCitySearch'

type Tab = 'app' | 'web' | 'merchant'
type TabTwo = 'games' | 'products' | 'coupons'

export default function AdminDashboard() {

   const [activeTab, setActiveTab] = useState<Tab>('app')
   const [activeTabTwo, setActiveTabTwo] = useState<TabTwo>('games')
   const [selectedItem, setSelectedItem] = useState<{ id: number; name: string } | null>(null)
   const [searchType, setSearchType] = useState<'cities' | 'countries'>('cities')

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }
   
   const handleTabTwoChange = (tab: TabTwo) => {
      setActiveTabTwo(tab)
   }

   const dataset = [
      { sales: 12, day: 'MON' },
      { sales: 34, day: 'TUE' },
      { sales: 28, day: 'WED' },
      { sales: 6, day: 'THU' },
      { sales: 2, day: 'FRI' },
      { sales: 22, day: 'SAT' },
      { sales: 16, day: 'SUN' },
   ]

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col w-full h-full lg:w-[85%]">
            <div className="flex flex-col gap-4 lg:flex-row w-full">
               <div className="lg:w-[50%] bg-white rounded-lg">
                  <CountryCitySearch searchIn={searchType} onSelectItem={setSelectedItem} />
               </div>
               <div className="w-full lg:w-fit">
                  <Menu>
                     <MenuButton className="w-full">
                        <div className="flex items-center border gap-6 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white">
                           <div className="capitalize font-medium text-size-2">Search By</div>
                           <FontAwesomeIcon size="lg" icon={faChevronDown} />
                        </div>
                     </MenuButton>
                     <MenuItems anchor="bottom" className="w-[140px] bg-white py-2 lg:py-4 rounded-lg mt-[2px] px-4">
                        <MenuItem>
                           <div className="flex gap-2 items-center">
                              <input checked name="search-radio" type="radio" className="h-5 w-5 text-themeone focus:text-themeone focus:ring-0" />
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Country</div>
                           </div>
                        </MenuItem>
                        <MenuItem>
                           <div className="flex gap-2 items-center">
                              <input name="search-radio" type="radio" className="h-5 w-5 text-themeone focus:text-themeone focus:ring-0" />
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">City</div>
                           </div>
                        </MenuItem>
                     </MenuItems>
                  </Menu>
               </div>
            </div>
            <div className="flex mt-16 items-center w-full gap-12 bg-light-background-three backdrop-blur-64 py-4 px-10 border-[2px] border-bg-light-background-three text-white font-bold text-size-4">
               <div className={`cursor-pointer ${activeTab === 'app' ? 'underline' : ''}`} onClick={() => handleTabChange('app')}>App</div>
               <div className={`cursor-pointer ${activeTab === 'web' ? 'underline' : ''}`} onClick={() => handleTabChange('web')}>Web</div>
               <div className={`cursor-pointer ${activeTab === 'merchant' ? 'underline' : ''}`} onClick={() => handleTabChange('merchant')}>Merchant</div>
            </div>
            <div className="flex flex-col mt-12">
               <div className="flex flex-col gap-4 lg:flex-row w-full">
                  <div className="flex items-center w-full gap-12 text-white font-bold text-size-4">
                     <div className={`cursor-pointer ${activeTabTwo === 'games' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('games')}>Games</div>
                     <div className={`cursor-pointer ${activeTabTwo === 'products' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('products')}>Products</div>
                     <div className={`cursor-pointer ${activeTabTwo === 'coupons' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('coupons')}>Coupons</div>
                  </div>
                  <div className="flex items-center border gap-6 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white cursor-pointer">
                     <div className="capitalize font-medium text-size-2 whitespace-nowrap">View Details</div>
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
               {activeTab == 'app' && (
                  <>
                     {activeTabTwo == 'games' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 mt-12 lg:mt-16 w-full gap-16 mx-auto">
                           <div className="bg-light-background-three backdrop-blur-64 w-full lg:px-12 py-6">
                              <div className="font-bold text-white text-head-3">Total Sales</div>
                              <div>
                                 <IBarChart dataset={dataset}
                                    xAxisDataKey="day"
                                    yAxisLabel=""
                                    seriesDataKey="sales"
                                    height={300}
                                 />
                              </div>
                           </div>
                           <div className="bg-light-background-three backdrop-blur-64 w-full lg:px-12 py-6">
                              <div className="font-bold text-white text-head-3">Total Orders</div>
                              <IBarChart dataset={dataset}
                                 xAxisDataKey="day"
                                 yAxisLabel=""
                                 seriesDataKey="sales"
                                 height={300}
                              />
                           </div>
                           <div className="bg-white w-full lg:px-12 py-6 gap-12 flex flex-col">
                              <div className="text-darkone text-head-3">Total Users</div>
                              <div className="bg-gradient-to-r from-themeone to-themetwo w-fit px-16 py-4 text-head-1 font-medium mx-auto rounded-lg text-white">123</div>
                           </div>
                           <div className="bg-white w-full lg:px-12 py-6 gap-12 flex flex-col">
                              <div className="text-darkone text-head-3">Sales Amount</div>
                              <div className="bg-gradient-to-r from-themeone to-themetwo w-fit px-16 py-4 text-head-1 font-medium mx-auto rounded-lg text-white">AED 123</div>
                           </div>
                        </div>
                     )}
                     {activeTabTwo == 'products' && (
                        <></>
                     )}
                     
                     {activeTabTwo == 'coupons' && (
                        <></>
                     )}
                  </>
               )}

               {activeTab == 'web' && (
                  <></>
               )}
               
               {activeTab == 'merchant' && (
                  <>
                     {activeTabTwo == 'games' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 mt-12 lg:mt-16 w-full gap-16 mx-auto">
                           <div className="bg-light-background-three backdrop-blur-64 w-full lg:px-12 py-6">
                              <div className="font-bold text-white text-head-3">Total Sales</div>
                              <div>
                                 <IBarChart dataset={dataset}
                                    xAxisDataKey="day"
                                    yAxisLabel=""
                                    seriesDataKey="sales"
                                    height={300}
                                 />
                              </div>
                           </div>
                           <div className="bg-light-background-three backdrop-blur-64 w-full lg:px-12 py-6">
                              <div className="font-bold text-white text-head-3">Total Orders</div>
                              <IBarChart dataset={dataset}
                                 xAxisDataKey="day"
                                 yAxisLabel=""
                                 seriesDataKey="sales"
                                 height={300}
                              />
                           </div>
                           <div className="bg-white w-full lg:px-12 py-6 gap-12 flex flex-col">
                              <div className="text-darkone text-head-3">Total Merchants</div>
                              <div className="bg-gradient-to-r from-themeone to-themetwo w-fit px-16 py-4 text-head-1 font-medium mx-auto rounded-lg text-white">123</div>
                           </div>
                           <div className="bg-white w-full lg:px-12 py-6 gap-12 flex flex-col">
                              <div className="text-darkone text-head-3">Sales Amount</div>
                              <div className="bg-gradient-to-r from-themeone to-themetwo w-fit px-16 py-4 text-head-1 font-medium mx-auto rounded-lg text-white">AED 123</div>
                           </div>
                           <div className="flex flex-col gap-3">
                              <div className="text-white font-bold text-size-4">Locate Machines</div>
                              <GoogleMap lat={40.6700} lon={-73.9400} zoom={11} height="350px" />
                           </div>
                        </div>
                     )}
                     {activeTabTwo == 'products' && (
                        <></>
                     )}
                     
                     {activeTabTwo == 'coupons' && (
                        <></>
                     )}
                  </>
               )}
            </div>
         </div>
      </section>
   )
}