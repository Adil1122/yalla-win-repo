'use client'

import React, { useEffect, useState } from 'react'
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import IBarChart from '@/components/dashboard/IBarChart'
import Modal from '@/components/modal'
import { useRouter } from "next/navigation"

type WinnerType = 'game' | 'prize'

export default function AdminSelectWinners() {

   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [newWInnerType, setNewWinnerType] = useState<WinnerType>('game')
   const [dataset, setDataset] = useState<any>([])
   const [allGames, setAllGames] = useState<any>([])
   const [allProducts, setAllProducts] = useState<any>([])
   const schedule = 'weekly'

   const handleAnnouneWinner = (action: WinnerType) => {
      setNewWinnerType(action)
      setModalIsOpen(true)
   }

   const handleChangeWinnerType = (type: WinnerType) => {
      setNewWinnerType(type)
   }

   useEffect(() => {
      
      getGraphData()
   }, [newWInnerType])

   const getGraphData = async () => {
      try {
         let response = await fetch(`/api/admin/dashboard?invoice_type=${newWInnerType}&schedule=${schedule}`, {
            method: 'GET',
         })
         
         var content = await response.json()

         if(!response.ok) {

         } else {
            var data = content.graph_result
            setDataset(data)
         }
      } catch (error) {
         console.log(error)
      }
   }

   const getAllGamesProducts = async() => {
      try {
         let response = await fetch('/api/admin/winners-management/select-winners', {
            method: 'OPTIONS',
         })

         var content = await response.json()

         if(!response.ok) {

         } else {
            setAllGames(content.allGames)
            setAllProducts(content.allProducts)
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {

      getAllGamesProducts()
   }, [])

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col w-full h-full">
            <div className="flex flex-col gap-4 lg:flex-row">
               <div className="flex flex-col lg:flex-row items-center border lg:border-[3px] border-white">
                  <div onClick={() => handleChangeWinnerType('game')} className={`flex items-center justify-center whitespace-nowrap w-full lg:w-fit px-16 py-4 font-medium text-size-2 h-full ${newWInnerType === 'game' ? 'bg-white text-darkone' : 'bg-none text-white cursor-pointer'}`}>Raffle Games</div>
                  <div onClick={() => handleChangeWinnerType('prize')} className={`flex items-center justify-center whitespace-nowrap w-full lg:w-fit px-16 py-4 font-medium text-size-2 h-full ${newWInnerType === 'prize' ? 'bg-white text-darkone' : 'bg-none text-white cursor-pointer'}`}>Raffle Products</div>
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
                           <div onClick={() => handleAnnouneWinner('game')} className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Raffle Games</div>
                        </MenuItem>
                        <MenuItem>
                           <div onClick={() => handleAnnouneWinner('prize')} className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Raffle Products</div>
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
               <form action="/admin/winners-management/search-results" method="get">
                  <div className="flex flex-col gap-10">
                     <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">Expected Amount</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="20" name="amount" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                           {newWInnerType == 'game' && (
                              <div className="flex flex-col gap-4">
                                 <div className="text-darkone text-size-4">Choose Game</div>
                                 <div className="text-darkone text-size-2 border border-lightone rounded">
                                    <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full" name="game_id">
                                       {allGames.map((game: any, index: number) => (
                                          <option key={index} value={game._id}>
                                             {game.name}
                                          </option>
                                       ))}
                                    </select>
                                 </div>
                              </div>
                           )}
                           {newWInnerType == 'prize' && (
                              <div className="flex flex-col gap-4">
                                 <div className="text-darkone text-size-4">Choose Product</div>
                                 <div className="text-darkone text-size-2 border border-lightone rounded">
                                    <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full" name="product_id">
                                       {allProducts.map((product: any, index: number) => (
                                          <option key={index} value={product._id}>
                                             {product.name}
                                          </option>
                                       ))}
                                    </select>
                                 </div>
                              </div>
                           )}
                           <div className="flex flex-col gap-4">
                              <div className="text-darkone text-size-4">People %</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" name="people_percent" />
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                           <div className="flex flex-col gap-4">
                              <div className="text-darkone text-size-4">Country</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" name="user_country" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <div className="text-darkone text-size-4">City</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" name="user_city" />
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">Area</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" name="user_area" />
                           </div>
                        </div>
                        <div className="flex items-center ml-auto gap-6">
                           <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                           <button type="submit" className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Search</button>
                        </div>
                     </div>
                  </div>
               </form>
            </div>
         </Modal>
      </section>
   )
}
