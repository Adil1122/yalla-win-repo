'use client'

import React, { useEffect, useState } from 'react'
import { faArrowLeft, faChevronDown, faChevronLeft, faChevronRight, faPencil, faSearch, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { SwitchComponent } from '@/components/SwitchComponent'
import { get } from 'http'
import { formatDate } from '@/libs/common'

type Tab = 'games' | 'products'
type WinnerType = 'shop' | 'app' | 'web'

export default function AdminWinnerHistory() {

   const [activeTab, setActiveTab] = useState<Tab>('games')
   const [activeTabTwo, setActiveTabTwo] = useState<WinnerType>('shop')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [currentWinners, setCurrentWinners] = useState<any>([])
   const [deleteId, setDeleteId] = useState<string>('')
   const [winners, setWinners] = useState<any>([])
   
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(0)
   const itemsPerPage = 5

   useEffect(() => {
      getWinners()
   }, [])
   
   useEffect(() => {
      let filteredWinners = winners.filter((winner: any) => {
         if (activeTab === 'games') {
            return winner.game_id
         } else if (activeTab === 'products') {
            return !winner.game_id
         }
      })
      
      filteredWinners = filteredWinners.filter((winner: any) => {
         if (activeTabTwo === 'shop') {
            return winner.platform_type == 'shop'
         } else if (activeTabTwo === 'app') {
            return winner.platform_type == 'app'
         } else if (activeTabTwo === 'web') {
            return winner.platform_type == 'web'
         }
      })

      const totalPagess = Math.ceil(filteredWinners.length / itemsPerPage)
      const currentWinners = filteredWinners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

      setCurrentPage(currentPage != 1 ? currentPage : 1)
      setCurrentWinners(currentWinners)
      setTotalPages(totalPagess)
   }, [winners, currentPage, activeTabTwo, activeTab])

   const handlePrevious = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1)
   }
   
   const handleNext = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
   }

   const getWinners = async() => {
      try {
         
         let response = await fetch('/api/admin/winners-management/history', {
            method: 'GET',
         })
         const content = await response.json()

         if(!response.ok) {
            console.log('There is some error fetching data from api')
         } else {
            setWinners(content.winners)
         }
      } catch (error) {
         console.log(error)
      }
   }

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
      setCurrentPage(1)
   }
   
   const handleTabTwoChange = (type: WinnerType) => {
      setActiveTabTwo(type)
      setCurrentPage(1)
   }

   const handleDelete = (id: string) => {
      setModalIsOpen(true)
      setCurrentPage(1)
      setDeleteId(id)
   }

   const handleDeleteConfirmed = async () => {
      if (deleteId != '') {
         try {
         
            let response = await fetch(`/api/admin/winners-management/history?id=${deleteId}` , {
               method: 'DELETE',
            })
            const content = await response.json()
   
            if(!response.ok) {
               console.log('There is some error fetching data from api')
            } else {
               getWinners()
            }

            setModalIsOpen(false)
         } catch (error) {
            console.log(error)
         }
      }
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
                        <input type="text" className="h-[40px] w-full bg-transparent ml-2 border-none focus:outline-none focus:ring-0 -mt-1" placeholder="Search By Country, City, QR ID" />
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

            <div className="mx-12 mt-12 flex items-center w-full lg:max-w-[60%] border-[2px] border-white text-white font-bold text-size-4">
               <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTabTwo === 'shop' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabTwoChange('shop')}>Shop Winners</div>
               <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTabTwo === 'app' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabTwoChange('app')}>App Winners</div>
               <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTabTwo === 'web' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabTwoChange('web')}>Website Winners</div>
            </div>

            <div className="mt-12 px-12 flex items-center w-full gap-12 text-white text-size-4">
               <div className={`cursor-pointer ${activeTab === 'games' ? 'underline' : ''}`} onClick={() => handleTabChange('games')}>Game Winners</div>
               <div className={`cursor-pointer ${activeTab === 'products' ? 'underline' : ''}`} onClick={() => handleTabChange('products')}>Mega Prize Winners</div>
            </div>

            <div className="flex flex-col mt-12 px-12">
               {activeTab == 'games' && (
                  <table className="w-full table-fixed border-collapse">
                     <thead>
                        <tr className="bg-white">
                           <th scope="col" className="w-[12%] text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Merchant Name</th>
                           <th scope="col" className="w-[18%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">QR ID</th>
                           <th scope="col" className="w-[18%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Merchant ID</th>
                           <th scope="col" className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game</th>
                           <th scope="col" className="w-[5%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Ticket No</th>
                           <th scope="col" className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Prize</th>
                           <th scope="col" className="w-[10%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Announced Date</th>
                           <th scope="col" className="w-[8%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                        {currentWinners.map((winner: any, index: number) => (
                           <tr key={index}>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.user_name}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.WinnerInvoice[0] ? winner.WinnerInvoice[0]._id : ''}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.WinnerInvoice[0] ? winner.WinnerInvoice[0].user_id : ''}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.game_name}<br />{winner.TicketDetails[0] ? winner.TicketDetails[0].ticket_type : ''}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.TicketDetails[0] ? winner.TicketDetails[0].ticket_number : ''}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.ProductDetails[0] ? winner.ProductDetails[0].name : ''}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{formatDate(winner.winning_date)}</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => {handleDelete(winner._id)}} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faTrashAlt} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
               
               {activeTab == 'products' && (
                  <table className="w-full">
                     <thead>
                        <tr className="bg-white">
                           <th scope="col" className="w-[15%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Merchant Name</th>
                           <th scope="col" className="w-[15%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Merchant ID</th>
                           <th scope="col" className="w-[15%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">QR ID</th>
                           <th scope="col" className="w-[15%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product</th>
                           <th scope="col" className="w-[15%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Prize</th>
                           <th scope="col" className="w-[15%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Announced Date</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                        {currentWinners.map((winner: any, index: number) => (
                           <tr key={index}>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.user_name}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.WinnerInvoice[0] ? winner.WinnerInvoice[0].user_id : ''}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.WinnerInvoice[0] ? winner.WinnerInvoice[0]._id : ''}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.ProductDetails[0] ? winner.ProductDetails[0].name : ''}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.PrizeDetails[0] ? winner.PrizeDetails[0].name : ''}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{formatDate(winner.winning_date)}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}

               <div className="font-poppins-medium mt-6 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">
                  <div className={`px-4 py-2 flex items-center justify-center cursor-pointer ${currentPage === 1 && 'cursor-not-allowed opacity-50'}`}onClick={handlePrevious}>
                     <FontAwesomeIcon size="1x" icon={faChevronLeft} />
                  </div>
                  {[...Array(totalPages)].map((_, index) => (
                     <div key={index} className={`px-4 py-2 flex items-center justify-center cursor-pointer ${currentPage === index + 1 ? 'text-black bg-white' : ''}`} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                     </div>
                  ))}
                  <div className={`px-4 py-2 flex items-center justify-center cursor-pointer ${currentPage === totalPages && 'cursor-not-allowed opacity-50'}`} onClick={handleNext}>
                     <FontAwesomeIcon size="1x" icon={faChevronRight} />
                  </div>
               </div>
            </div>
         </div>
         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
               <div className="text-darkone font-medium text-head-3">Delete</div>
               <div className="text-darkone text-size-4">Are you sure you want to delete this record?</div>
               <div className="flex items-center gap-6 mt-3">
                  <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded">Cancel</button>
                  <button onClick={handleDeleteConfirmed} className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Delete</button>
               </div>
            </div>
         </Modal>
      </section>
   )
}
