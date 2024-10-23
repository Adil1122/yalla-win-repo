'use client'

import React, { useEffect, useState } from 'react'
import { faArrowLeft, faChevronLeft, faChevronRight, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Modal from '@/components/modal'

export default function AdminWinnersSearchResult() {
   
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   const [searchResults, setSearchResults] = useState<any>([])
   const queryParams = new URLSearchParams(window.location.search)
   const [amount, game, product, peoplePercent, country, city, area] = [
      queryParams.get('amount') || '',
      queryParams.get('game_id') || '',
      queryParams.get('product_id') || '',
      queryParams.get('people_percent') || '',
      queryParams.get('country') || '',
      queryParams.get('city') || '',
      queryParams.get('area') || '',
   ]
   const router = useRouter()
   const [pages, setPages] = useState<any>([])
   const [showPages, setShowPages] = useState<any>([])
   const [recordsPerPage, setRecordsPerPages] = useState(5)
   const [currentPage, setCurrentPage] = useState(1)
   const [resultsCount, setResultsCount] = useState(0)
   const [isLoading, setIsLoading] = useState<boolean>(false)

   let skip : number = 0

   const handleSelectRandom = () => {
      setModalIsOpen(true)
   }
   
   const handleEnterTicketNumber = () => {
      setModalTwoIsOpen(true)
   }

   const initSearch = async (amount: string, game: string, product: string, peoplePercent: string, country: string, city: string, area: string) => {
      try {
         
         setIsLoading(true)
         
         let item = ''

         if (game && game !== '') {
            item = `game_id=${game}`
         } else if (product && product !== '') {
            item = `product_id=${product}`
         }

         let response = await fetch(`/api/admin/winners-management/search-results?${item}&amount=${amount}&user_country=${country}&user_city=${city}&user_area=${area}&skip=${skip}&limit=${recordsPerPage}&people_percent=${peoplePercent}`, {
            method: 'GET',
         })
         const content = await response.json()

         if(!response.ok) {
            console.log('There is some error fetching data from api')
         } else {
            
            setSearchResults(content.tickets)
            console.log(content.tickets)
         }
      } catch (error) {
         console.log(error)
      }

      setIsLoading(false)
   }

   const setPagination = (current_page: number) => {

      let pagess : any = []
      let showPagess : any = []
      let totPages = resultsCount
  
      if(current_page > pages.length) {
         current_page = pages.length
      }

      if(current_page < 1) {
         current_page = 1
      }

      skip = recordsPerPage * (current_page - 1)

      initSearch(amount, game, product, peoplePercent, country, city, area)
      setCurrentPage(current_page)
      
      for(var i = 1; i <= Math.ceil(totPages / recordsPerPage); i++) {
         pagess.push(i)
         if(i === current_page || i === (current_page + 1) || i === (current_page - 1) || i === (current_page + 2) || i === (current_page - 2)) {
            showPagess.push(i)
         }
      }
      
      setPages(pagess)
      setShowPages(showPagess)
   }

   const getTotalRecords = async() => {

      let item = ''

      if (game && game !== '') {
         item = `game_id=${game}`
      } else if (product && product !== '') {
         item = `product_id=${product}`
      }

      try {
         let response = await fetch(`/api/admin/winners-management/search-results?${item}&amount=${amount}&user_country=${country}&user_city=${city}&user_area=${area}&people_percent=${peoplePercent}`, {
            method: 'OPTIONS',
         })

         var content = await response.json()

         if(!response.ok) {

         } else {
            setResultsCount(content.count)
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {

      getTotalRecords()
   }, [])

   useEffect(() => {
      
      setPagination(1)
   }, [resultsCount])

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">
            <div onClick={() => {router.back()}} className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
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
                        {game !== '' && (
                           <div className="capitalize font-medium text-size-2 whitespace-nowrap">Enter Ticket Number</div>
                        )}
                        {product !== '' && (
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
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">{game !== '' ? 'Game Name' : 'Product Name'}</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">{game !== '' ? 'Ticket No' : 'QR Code'}</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Country</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">City</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Area</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                     {searchResults.map((result: any, index: number) => (
                        <tr key={index}>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{result.UserDetails ? `${result.UserDetails[0].first_name} ${result.UserDetails[0].last_name}` : ''}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{result.InvoiceDetails._id}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{game !== '' ? result.GameDetails.name : result.ProductDetails.name}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{game !== '' ? result.ticket_number : result.invoice_number}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{result.UserDetails ? result.UserDetails[0].country : ''}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{result.UserDetails ? result.UserDetails[0].city : ''}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{result.UserDetails ? result.UserDetails[0].area : ''}</td>
                        </tr>
                     ))}
                     {searchResults.length == 0 && !isLoading && (
                        <tr>
                           <td colSpan={7} className="text-center py-4 text-darkone font-medium">No results found</td>
                        </tr>
                     )}
                     {searchResults.length == 0 && isLoading && (
                        <tr>
                           <td colSpan={7} className="text-center py-4 text-darkone font-medium">Loading data. Please wait...</td>
                        </tr>
                     )}
                  </tbody>
               </table>
               <div className="font-poppins-medium mt-6 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">
                  {pages.length > 0 && (
                     <div className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(currentPage - 1)}>
                        <FontAwesomeIcon size="1x" icon={faChevronLeft} />
                     </div>
                  )}
                  {pages.map((page: any) => (
                     showPages.includes(page) && (
                        page === currentPage ?
                        <div key={page} className="px-4 py-2 text-black bg-white flex items-center justify-center cursor-pointer" onClick={() => setPagination(page)}>{page}</div>
                        :
                        <div key={page} className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(page)}>{page}</div>
                     ) 
                  ))}
                  {pages.length > 0 && (
                     <div className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(currentPage + 1)}>
                        <FontAwesomeIcon size="1x" icon={faChevronRight} />
                     </div>
                  )}
               </div>
            </div>
         </div>
         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
               <div className="text-darkone text-size-4">Are you sure you want to select random number</div>
               <div className="flex items-center gap-6 mt-3">
                  <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded">Cancel</button>
                  <button onClick={() => {router.push(`/admin/winners-management/select-random-number/${game !== '' ? 'games' : 'products'}`)}} className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Yes</button>
               </div>
            </div>
         </Modal>
         <Modal open={modalTwoIsOpen} onClose={() => setModalTwoIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Enter {game !== '' ? 'Ticket Number' : 'QR Code'}</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  {game !== '' && (
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

                  {product !== '' && (
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
                     <div className="text-darkone text-size-4">{game !== '' ? 'Ticket No' : 'QR Code'}</div>
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
                     <button onClick={() => {router.push(`/admin/winners-management/enter-ticket-number/${game !== '' ? 'games' : 'products'}`)}} className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Search</button>
                  </div>
               </div>
            </div>
         </Modal>
      </section>
   )
}
