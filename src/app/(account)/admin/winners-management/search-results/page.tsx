'use client'

import React, { useState } from 'react'
import { faArrowLeft, faChevronLeft, faChevronRight, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Modal from '@/components/modal'

export default function AdminWinnersSearchResult() {
   
   const searchParams = useSearchParams()
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   const [amount, game, product, peoplePercent, country, city, area] = [
      searchParams.get('amount'),
      searchParams.get('game'),
      searchParams.get('product'),
      searchParams.get('people-percent'),
      searchParams.get('country'),
      searchParams.get('city'),
      searchParams.get('area'),
   ]
   const router = useRouter()

   const handleSelectRandom = () => {
      setModalIsOpen(true)
   }
   
   const handleEnterTicketNumber = () => {
      setModalTwoIsOpen(true)
   }

   console.log(amount, game, product, peoplePercent, country, city, area)

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">
            <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
               <div className="cursor-pointer">
                  <FontAwesomeIcon size="xl" icon={faArrowLeft} />
               </div>
               <div className="cursor-pointer text-head-3 font-medium">Search Results</div>
            </div>
            <div className="px-12 mt-12 w-full">
               <div className="flex flex-row items-center gap-3 w-full">
                  <div className="flex items-center w-full gap-3 bg-white rounded-lg py-3 px-6 w-full lg:w-1/3">
                     <div>
                        <FontAwesomeIcon size="lg" icon={faSearch} />
                     </div>
                     <div className="w-full">
                        <input type="text" className="h-[40px] w-full bg-transparent ml-2 border-none focus:outline-none focus:ring-0 -mt-1" placeholder={game != null ? 'Search by ticket no' : 'Search by QR code'} />
                     </div>
                  </div>
                  <div className="w-full flex gap-3 lg:ml-auto lg:w-fit">
                     <Link href={`/admin/winners-management/verify-results/${game !== null ? 'games' : 'products'}`} className="flex items-center border gap-3 lg:border-[3px] white-space-nowrap border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                        Verify Results
                     </Link>
                     <button type="button" onClick={handleSelectRandom} className="flex items-center border gap-3 lg:border-[3px] white-space-nowrap border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                        Select Random Number
                     </button>
                     <button type="button" onClick={handleEnterTicketNumber}  className="flex items-center border gap-3 lg:border-[3px] white-space-nowrap border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                        {game !== null && (
                           <div className="capitalize font-medium text-size-2 whitespace-nowrap">Enter Ticket Number</div>
                        )}
                        {product !== null && (
                           <div className="capitalize font-medium text-size-2 whitespace-nowrap">Enter QR ID</div>
                        )}
                     </button>
                  </div>
               </div>
            </div>

            <div className="flex flex-col mt-12 px-12">
               <table className="w-full">
                  <thead>
                     <tr className="bg-white">
                     <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">User name</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Registeration No</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">{game !== null ? 'Game Name' : 'Product Name'}</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">{game !== null ? 'Ticket No' : 'QR Code'}</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Country</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">City</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Area</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                     <tr>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">891829182</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 3</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">283283928392</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">United Arab Emirates</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Dubai</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Marina</td>
                     </tr>
                     <tr>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">891829182</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 3</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">283283928392</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">United Arab Emirates</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Dubai</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Marina</td>
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
         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
               <div className="text-darkone text-size-4">Are you sure you want to select random number</div>
               <div className="flex items-center gap-6 mt-3">
                  <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded">Cancel</button>
                  <button onClick={() => {router.push(`/admin/winners-management/select-random-number/${game !== null ? 'games' : 'products'}`)}} className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Yes</button>
               </div>
            </div>
         </Modal>
         <Modal open={modalTwoIsOpen} onClose={() => setModalTwoIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Enter {game !== null ? 'Ticket Number' : 'QR Code'}</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  {game !== null && (
                     <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Choose Game</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full">
                           <option value="1">Game one</option>
                           <option value="0">Game two</option>
                        </select>
                     </div>
                  </div>
                  )}

                  {product !== null && (
                     <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Choose Product</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full">
                           <option value="1">Product one</option>
                           <option value="0">Product two</option>
                        </select>
                     </div>
                  </div>
                  )}

                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">{game !== null ? 'Ticket No' : 'QR Code'}</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" />
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Announcement Date</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" />
                     </div>
                  </div>

                  <div className="flex items-center ml-auto gap-6">
                     <button onClick={() => setModalTwoIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button onClick={() => {router.push(`/admin/winners-management/enter-ticket-number/${game !== null ? 'games' : 'products'}`)}} className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Search</button>
                  </div>
               </div>
            </div>
         </Modal>
      </section>
   )
}
