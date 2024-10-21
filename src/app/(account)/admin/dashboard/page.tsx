'use client'

import React, { useEffect, useState } from 'react'
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import IBarChart from '@/components/dashboard/IBarChart'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import GoogleMap from '@/components/GoogleMap'
import { CountryCitySearch } from '@/components/CountryCitySearch'

type Tab = 'app' | 'web' | 'merchant'
type TabTwo = 'game' | 'prize' | 'coupon'

export default function AdminDashboard() {

   const [activeTab, setActiveTab] = useState<Tab>('app')
   const [activeTabTwo, setActiveTabTwo] = useState<TabTwo>('game')
   const [selectedItem, setSelectedItem] = useState<{ id: number; name: string } | null>(null)
   const [searchType, setSearchType] = useState<'cities' | 'countries'>('cities')
   var invoice_type = 'prize'
   var platform = 'app'
   var schedule = 'weekly'

   const handleTabChange = (tab: Tab) => {
      invoice_type = activeTabTwo
      platform = tab
      setActiveTab(tab)
      getGraphData()
   }
   
   const handleTabTwoChange = (tab: TabTwo) => {
      invoice_type = tab
      platform = activeTab
      setActiveTabTwo(tab)
      getGraphData()
   }

   const [dataset, setDataSet] = useState([])
   const [orders_dataset, setOrdersDataSet] = useState([])
   const [total_user, setTotalUsers] = useState(0)
   const [total_sales, setTotalSales] = useState(0)

   useEffect(() => {
      getGraphData()
   }, [selectedItem])

   async function getGraphData() {
      try {
         var selected_name = selectedItem !== null ? selectedItem.name : ''
         let response = await fetch('/api/admin/dashboard?invoice_type=' + invoice_type + '&schedule=' + schedule + '&platform=' + platform + '&search_by=' + searchType + '&search=' + selected_name, {
            method: 'GET',
         });
         var content = await response.json()

         if(!response.ok) {

         } else {
            //console.log('content: ', content)
            var data = content.graph_result.data
            var orders_data = content.graph_result.orders_data
            var total_sales = content.graph_result.total_sales
            var total_users = content.graph_result.total_users
            setDataSet(data)
            setOrdersDataSet(orders_data)
            setTotalSales(total_sales)
            setTotalUsers(total_users)

         }

      } catch (error) {
         
      }
   }

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
                     <div className={`cursor-pointer ${activeTabTwo === 'game' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('game')}>Games</div>
                     <div className={`cursor-pointer ${activeTabTwo === 'prize' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('prize')}>Products</div>
                     <div className={`cursor-pointer ${activeTabTwo === 'coupon' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('coupon')}>Coupons</div>
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
               {
               //activeTab == 'app' && (
                  <>
                     {
                     //activeTabTwo == 'game' && (
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
                              <IBarChart dataset={orders_dataset}
                                 xAxisDataKey="day"
                                 yAxisLabel=""
                                 seriesDataKey="sales"
                                 height={300}
                              />
                           </div>
                           <div className="bg-white w-full lg:px-12 py-6 gap-12 flex flex-col">
                              <div className="text-darkone text-head-3">Total Users</div>
                              <div className="bg-gradient-to-r from-themeone to-themetwo w-fit px-16 py-4 text-head-1 font-medium mx-auto rounded-lg text-white">{total_user}</div>
                           </div>
                           <div className="bg-white w-full lg:px-12 py-6 gap-12 flex flex-col">
                              <div className="text-darkone text-head-3">Sales Amount</div>
                              <div className="bg-gradient-to-r from-themeone to-themetwo w-fit px-16 py-4 text-head-1 font-medium mx-auto rounded-lg text-white">AED {total_sales}</div>
                           </div>

                           <div className="flex flex-col gap-3">
                              <div className="text-white font-bold text-size-4">Locate Machines</div>
                              <GoogleMap lat={40.6700} lon={-73.9400} zoom={11} height="350px" />
                           </div>

                        </div>
                     //)
                     }
                     {activeTabTwo == 'prize' && (
                        <></>
                     )}
                     
                     {activeTabTwo == 'coupon' && (
                        <></>
                     )}
                  </>
               //)
               }

               {activeTab == 'web' && (
                  <></>
               )}
               
               {
               /*activeTab == 'merchant' && (
                  <>
                     {activeTabTwo == 'game' && (
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
                     {activeTabTwo == 'prize' && (
                        <></>
                     )}
                     
                     {activeTabTwo == 'coupon' && (
                        <></>
                     )}
                  </>
               )*/
               }
            </div>
         </div>
      </section>
   )
}
