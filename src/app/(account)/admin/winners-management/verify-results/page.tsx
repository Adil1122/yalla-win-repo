'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { faArrowLeft, faChevronDown, faChevronLeft, faChevronRight, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Modal from '@/components/modal'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { formatDate } from '@/libs/common'

type Tab = 'all' | 'app' | 'web' | 'shop'
type GameType = '' | 'straight' | 'rumble' | 'chance'

function AdminWinnersVerifyResult() {
   
   const [activeTab, setActiveTab] = useState<Tab>('all')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   const [search, setSearch] = useState<string>('')
   const [totalWinningAmount, setTotalWinningAmount] = useState<number>(0)
   const [searchResults, setSearchResults] = useState<any>([])
   const queryParams = useSearchParams()
   const [amount, game, product, startDate, endDate, peoplePercent, country, city, area] = [
      queryParams.get('amount') || '',
      queryParams.get('game_id') || '',
      queryParams.get('product_id') || '',
      queryParams.get('start_date') || '',
      queryParams.get('end_date') || '',
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
   const [isBusy, setIsBusy] = useState<boolean>(false)
   const [gameType, setGameType] = useState<GameType>('')
   const [ticketNumber, setTicketNumber] = useState<string>('')
   const [announceDate, setAnnounceDate] = useState<string>('')

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }

   const handleGameTypeChange = (type: GameType) => {
      setGameType(type)
   }

   let skip : number = 0

   const handleSelectRandom = () => {
      setModalIsOpen(true)
   }
   
   const handleEnterTicketNumber = () => {
      setModalTwoIsOpen(true)
   }

   const initSearch = async () => {
      try {
         
         setIsLoading(true)

         let response = await fetch(`/api/admin/winners-management/verify-results?ticket_number=${search}&game_id=${game}&max_amount=${amount}&start_date=${startDate}&end_date=${endDate}`, {
            method: 'GET',
         })
         const content = await response.json()

         if(!response.ok) {
            console.log('There is some error fetching data from api')
         } else {
            
            setSearchResults(content.items)
            setResultsCount(content.total_count)
            setTotalWinningAmount(content.total_sum)
         }
      } catch (error) {
         console.log(error)
      }

      setIsLoading(false)
   }

   const handleWinnerSubmit = async () => {

      if (ticketNumber != '' && announceDate != '' && !isBusy) {

         setIsBusy(true)
         const itemType = game != '' && game != 'null' ? 'game' : 'product'
         const itemId = game != '' && game != 'null' ? game : product

         try {
            let response = await fetch(`/api/admin/winners-management/announce-winner`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  inputType: itemType,
                  inputValue: itemId,
                  inputData: ticketNumber,
                  maxWinAmount: amount,
                  dateAnnounced: announceDate,
               })
            })
   
            var content = await response.json()
   
            if(!response.ok) {
               console.log('error in winner announcement api')
            } else {

               if (content.data && content.data.length) {
                  router.push('/admin/winners-management/game-winners-today')
               } else {
                  alert('No winners found matching your ticket number')
               }
            }
         } catch (error) {
            console.log(error)
         }

         setIsBusy(false)
      }
   }

   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedDate = new Date(e.target.value)
      const formattedDate = selectedDate.toISOString().split("T")[0]
      setAnnounceDate(formattedDate)
   }

   const handleSearch = () => {
      initSearch()
   }

   useEffect(() => {

   }, [])

   const filteredResults = gameType != '' ? searchResults.filter((result: any) => result.ticket_type.toLowerCase() === gameType) : searchResults

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">
            <div onClick={() => {router.back()}} className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
               <div className="cursor-pointer">
                  <FontAwesomeIcon size="xl" icon={faArrowLeft} />
               </div>
               <div className="cursor-pointer text-head-3 font-medium">Verify Results</div>
            </div>
            <div className="px-12 mt-12 w-full">
               <div className="flex flex-row items-center gap-3 w-full">
                  <div className="flex items-center w-full gap-3 bg-white rounded-lg py-3 px-6 w-full lg:w-1/3">
                     <div>
                        <FontAwesomeIcon size="lg" icon={faSearch} />
                     </div>
                     <div className="w-full">
                        <input type="text" onChange={(e) => setSearch(e.target.value)} className="h-[40px] w-full bg-transparent ml-2 border-none focus:outline-none focus:ring-0 -mt-1" placeholder={game != '' && game != null ? 'Search by ticket no' : 'Search by QR code'} />
                     </div>
                     <button type="button" onClick={handleSearch} className="px-4 py-2 bg-themeone text-white rounded-md">Search</button>
                  </div>
                  <div className="w-full flex gap-3 lg:ml-auto lg:w-fit">
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

            <div className="w-full px-12 mt-12 flex items-center">
               <div className="flex items-center gap-4">
                  <Menu>
                     <MenuButton className="w-full">
                        <div className="flex items-center border gap-6 lg:border-[3px] border-white lg:rounded-xl py-4 px-10 text-white">
                           <div className="capitalize font-medium text-size-2">{gameType == '' ? 'All' : gameType}</div>
                           <FontAwesomeIcon size="lg" icon={faChevronDown} />
                        </div>
                     </MenuButton>
                     <MenuItems anchor="bottom" className="w-[110px] bg-white py-2 lg:py-4 rounded-lg mt-[2px] px-4">
                        <MenuItem>
                           <div onClick={() => handleGameTypeChange('')} className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">All</div>
                        </MenuItem>
                        <MenuItem>
                           <div onClick={() => handleGameTypeChange('straight')} className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Straight</div>
                        </MenuItem>
                        <MenuItem>
                           <div onClick={() => handleGameTypeChange('rumble')} className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Rumble</div>
                        </MenuItem>
                        <MenuItem>
                           <div onClick={() => handleGameTypeChange('chance')} className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Chance</div>
                        </MenuItem>
                     </MenuItems>
                  </Menu>
               </div>
               <div className="flex flex-col gap-3 ml-auto text-white text-head-1 font-medium">
                  <div className="flex flex-row items-center gap-1">
                     <div>No of winners: </div>
                     <div>{filteredResults.length}</div>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                     <div>Winning amount: </div>
                     <div>{filteredResults.reduce((sum:any, result:any) => sum + (result.winning_amount || 0), 0)} AED</div>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col mt-12 px-12">
               <table className="w-full table-fixed border-collapse">
                  <thead>
                     <tr className="bg-white">
                        <th scope="col" className="w-[14%] py-5  text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">User name</th>
                        <th scope="col" className="w-[14%] py-5  text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game</th>
                        <th scope="col" className="w-[14%] py-5  text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winning Amount</th>
                        <th scope="col" className="w-[14%] py-5  text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Ticket</th>
                        <th scope="col" className="w-[14%] py-5  text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Purchase Date</th>
                        <th scope="col" className="w-[14%] py-5  text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Country</th>
                        <th scope="col" className="w-[14%] py-5  text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">City</th>
                        <th scope="col" className="w-[14%] py-5  text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Area</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                     {!isLoading && filteredResults.map((result: any, index: number) => (
                        <tr key={index}>
                           <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{result.UserDetails ? `${result.UserDetails.first_name} ${result.UserDetails.last_name}` : ''}</td>
                           <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{result.GameDetails.name}</td>
                           <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{result.winning_amount ? result.winning_amount : ''}</td>
                           <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center"><div>{result.ticket_number}</div> <div>{result.ticket_type}</div></td>
                           <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{formatDate(result.createdAt)}</td>
                           <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{result.UserDetails ? result.UserDetails.country : ''}</td>
                           <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{result.UserDetails ? result.UserDetails.city : ''}</td>
                           <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{result.UserDetails ? result.UserDetails.area : ''}</td>
                        </tr>
                     ))}
                     {filteredResults.length == 0 && !isLoading && (
                        <tr>
                           <td colSpan={8} className="text-center py-4 text-darkone font-medium">No results found</td>
                        </tr>
                     )}
                     {isLoading && (
                        <tr>
                           <td colSpan={8} className="text-center py-4 text-darkone font-medium">Loading data. Please wait...</td>
                        </tr>
                     )}
                  </tbody>
               </table>
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
                  <div className="text-darkone text-head-2">Announce Winner</div>
                  <div onClick={() => setModalTwoIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">{game !== '' ? 'Ticket No' : 'QR Code'}</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value )} className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" />
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Announcement Date</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input value={announceDate} onChange={handleDateChange} className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="date" />
                     </div>
                  </div>

                  <div className="flex items-center ml-auto gap-6">
                     <button onClick={() => setModalTwoIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button disabled={isBusy} onClick={() => {handleWinnerSubmit()}} className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Submit</button>
                  </div>
               </div>
            </div>
         </Modal>
      </section>
   )
}

export default function VerifyResultsPage () {
   return (
      <Suspense>
         <AdminWinnersVerifyResult />
      </Suspense>
   )
}
