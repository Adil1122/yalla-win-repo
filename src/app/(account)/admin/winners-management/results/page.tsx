'use client'

import React, { useEffect, useState } from 'react'
import { faArrowLeft, faChevronDown, faChevronLeft, faChevronRight, faPencil, faSearch, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { SwitchComponent } from '@/components/SwitchComponent'
import { get } from 'http'

type Tab = 'results' | 'images'
type TabTwo = 'app' | 'shop' | 'web'

export default function AdminWinnerResults() {

   const [activeTabTwo, setActiveTabTwo] = useState<Tab>('results')
   const [gameWinners, setGameWinners] = useState<any>([])
   const [productWinners, setProductWinners] = useState<any>([])
   const [winnerImages, setWinnerImages] = useState<any>([])
   const [toggleApp, setToggledApp] = useState<boolean>(false)
   const [toggleShop, setToggledShop] = useState<boolean>(false)
   const [toggleWeb, setToggledWeb] = useState<boolean>(false)
   
   const handleTabTwoChange = (tab: Tab) => {
      setActiveTabTwo(tab)
   }

   const handleToggle = (type: TabTwo) => {
      if (type == 'app') {

         const value = !toggleApp
         setToggledApp(value)
         saveSetting('app')
      } else if (type == 'shop') {
         
         const value = !toggleShop
         setToggledShop(value)
         saveSetting('shop')
      } else if (type == 'web') {

         const value = !toggleWeb
         setToggledWeb(value)
         saveSetting('web')
      }
   }

   const getTotalRecords = async() => {
      try {
         let response = await fetch('/api/admin/winners-management/results', {
            method: 'GET',
         })

         var content = await response.json()

         if(!response.ok) {

         } else {
            setGameWinners(content.game_winners)
            setProductWinners(content.product_winners)
            setWinnerImages(content.images)

            setToggledApp(content.settings.show_winners_app == '1')
            setToggledShop(content.settings.show_winners_shop == '1')
            setToggledWeb(content.settings.show_winners_web == '1')
         }
      } catch (error) {
         console.log(error)
      }
   }
   
   const saveSetting = async(type: TabTwo) => {

      let settingName = ''
      let settingValue = ''

      if (type == 'app') {
         settingName = 'show_winners_app'
         settingValue = toggleApp ? '0' : '1'
      } else if (type == 'shop') {
         settingName = 'show_winners_shop'
         settingValue = toggleShop ? '0' : '1'
      } else if (type == 'web') {
         settingName = 'show_winners_web'
         settingValue = toggleWeb ? '0' : '1'
      }

      try {
         let response = await fetch('/api/admin/winners-management/results', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               settingName: settingName,
               settingValue: settingValue
            })
         })
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {

      getTotalRecords()
   }, [])

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">

            <div className="flex items-center mt-12 px-12">
               <div className="flex items-center w-full gap-12 text-white text-size-4">
                  <div className={`cursor-pointer ${activeTabTwo === 'results' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('results')}>Results</div>
                  <div className={`cursor-pointer ${activeTabTwo === 'images' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('images')}>Images</div>
               </div>
               <div className="flex items-center gap-12">
                  <div className="flex items-center gap-2 ml-auto">
                     <div className="text-white whitespace-nowrap font-medium text-size-4">Hide Results on App</div>
                     <div className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer" onClick={() => handleToggle('app')}>
                        <div className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${toggleApp ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                     <div className="text-white whitespace-nowrap font-medium text-size-4">Hide Results on Shop</div>
                     <div className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer" onClick={() => handleToggle('shop')}>
                        <div className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${toggleShop ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                     <div className="text-white whitespace-nowrap font-medium text-size-4">Hide Results on Web</div>
                     <div className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer" onClick={() => handleToggle('web')}>
                        <div className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${toggleWeb ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                     </div>
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
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">User Name</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Ticket Number</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           {gameWinners.map((winner: any, index: number) => (
                           <tr key={index}>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.GameDetails.name}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{`${winner.UserDetails.first_name} ${winner.UserDetails.last_name}`}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.TicketDetails.ticket_number}</td>
                           </tr>
                           ))}
                        </tbody>
                     </table>
                     <table className="w-full mt-12">
                        <thead>
                           <tr className="bg-white">
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Prize Name</th>
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">User Name</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">QR Code</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           {productWinners.map((winner: any, index: number) => (
                           <tr key={index}>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.PrizeDetails.name}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{`${winner.UserDetails.first_name} ${winner.UserDetails.last_name}`}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.InvoiceDetails.invoice_number}</td>
                           </tr>
                           ))}
                        </tbody>
                     </table>
                     
                  </>
               )}
               
               {activeTabTwo == 'images' && (
                  <div className="grid grid-cols-3 gap-6">
                     {winnerImages.map((image: any, index: number) => (
                     <div className="" key={index}>
                        <img src={image} alt="" />
                     </div>
                     ))}
                  </div>
               )}
               
            </div>
         </div>
      </section>
   )
}
