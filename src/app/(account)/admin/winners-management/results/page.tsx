'use client'

import React, { useEffect, useState } from 'react'
import { faChevronLeft, faChevronRight, faCloudUpload, faPlay, faShare, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import { formatDate, formatDateOnly, formatISODate } from '@/libs/common'
import { useRouter } from 'next/navigation'
import SocialShare from '@/components/SocialShare'
import usePagination from '@/hooks/usePagination'
import { icon } from '@fortawesome/fontawesome-svg-core'

type Tab = 'results' | 'images' | 'videos'
type TabTwo = 'app' | 'shop' | 'web'

export default function AdminWinnerResults() {

   const itemsPerPage = 10
   const [activeTabTwo, setActiveTabTwo] = useState<Tab>('results')
   const [gameWinners, setGameWinners] = useState<any>([])
   const [ticketNumber, setTicketNumber] = useState<any>()
   const [videoWinner, setVideoWinner] = useState<any>()
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [productWinners, setProductWinners] = useState<any>([])
   const [winnerImages, setWinnerImages] = useState<any>([])
   const [toggleApp, setToggledApp] = useState<boolean>(false)
   const [toggleShop, setToggledShop] = useState<boolean>(false)
   const [toggleWeb, setToggledWeb] = useState<boolean>(false)
   const router = useRouter()
   const {currentPage, totalPages, currentRecords, setPagination } = usePagination({ items: gameWinners, itemsPerPage: itemsPerPage });
   
   const handleTabTwoChange = (tab: Tab) => {
      setPagination(1)
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

   const handleCreateAnimation = (winner: any) => {
      setVideoWinner(winner)
      setModalIsOpen(true)
   }

   const handleCreateVideoSubmit = () => {

      if (videoWinner && ticketNumber) {
         if (videoWinner.GameDetails.name == 'Yalla 3' && ticketNumber.length != 3) {
            alert('For Yalla 3 the ticket number must contain exactly 3 digits between 1 and 8')
            return
         } else if (videoWinner.GameDetails.name == 'Yalla 4' && ticketNumber.length != 4) {
            alert('For Yalla 3 the ticket number must contain exactly 4 digits between 1 and 8')
            return
         } else if (videoWinner.GameDetails.name == 'Yalla 6' && ticketNumber.length != 12) {
            alert('For Yalla 6 the ticket number must contain exactly 12 digits between 1 and 25')
            return  
         }

         router.push(`/admin/winners-management/results/animation/${ticketNumber}/${videoWinner._id}`)
      } else {
         alert('Make sure the ticket number is valid')
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
                  <div className={`cursor-pointer ${activeTabTwo === 'videos' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('videos')}>Videos</div>
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
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Announced Date</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                        {currentRecords.map((winner: any, index: number) => (
                           <tr key={index}>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                              {winner.GameDetails.name}
                           </td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                              {`${winner.UserDetails.first_name} ${winner.UserDetails.last_name}`}
                           </td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                              {winner.TicketDetails.ticket_number}
                           </td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                              {formatDate(winner.winning_date)}
                           </td>
                           </tr>
                        ))}
                        </tbody>
                     </table>
                     <div className="font-poppins-medium mt-6 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">
                        <div className={`px-4 py-2 flex items-center justify-center cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => currentPage > 1 && setPagination(currentPage - 1)}>
                           <FontAwesomeIcon size="1x" icon={faChevronLeft} />
                        </div>

                        <div className={`px-4 py-2 flex items-center justify-center cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => currentPage < totalPages && setPagination(currentPage + 1)}>
                           <FontAwesomeIcon size="1x" icon={faChevronRight} />
                        </div>
                     </div>
                     <table className="w-full mt-12">
                        <thead>
                           <tr className="bg-white">
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Prize Name</th>
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">User Name</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">QR Code</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Announced Date</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           {productWinners.map((winner: any, index: number) => (
                           <tr key={index}>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.PrizeDetails.name}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{`${winner.UserDetails.first_name} ${winner.UserDetails.last_name}`}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.InvoiceDetails.invoice_number}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{formatDate(winner.winning_date)}</td>
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
               
               {activeTabTwo == 'videos' && (
                  <div className="flex flex-col mt-1 px-12">
                     <>
                        <table className="w-full">
                           <thead>
                              <tr className="bg-white">
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game Name</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Ticket Number</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winning Amount</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winning Date</th>
                                 <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Video</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                              {currentRecords.map((winner: any, index: number) => (
                              <tr key={index}>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.GameDetails.name}</td>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.TicketDetails.ticket_number}</td>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.prize_amount}</td>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{formatISODate(new Date(winner.createdAt)).fomattedDate}</td>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                                    {winner.animation_video && (
                                       <SocialShare url={`https://drive.google.com/file/d/${winner.animation_video}/preview`} title="Share video" />
                                    )}
                                    {!winner.animation_video && (
                                       <button onClick={() => {handleCreateAnimation(winner)}} className="bg-themeone text-white rounded px-4 py-2 mx-auto flex gap-2 items-center">
                                          <FontAwesomeIcon size="lg" icon={faCloudUpload} />
                                          <div className="text-white">Create Video</div>
                                       </button>
                                    )}
                                 </td>
                              </tr>
                              ))}
                           </tbody>
                        </table>
                        <div className="font-poppins-medium mt-6 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">
                           <div className={`px-4 py-2 flex items-center justify-center cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => currentPage > 1 && setPagination(currentPage - 1)}>
                              <FontAwesomeIcon size="1x" icon={faChevronLeft} />
                           </div>

                           <div className={`px-4 py-2 flex items-center justify-center cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => currentPage < totalPages && setPagination(currentPage + 1)}>
                              <FontAwesomeIcon size="1x" icon={faChevronRight} />
                           </div>
                        </div>
                     </>
                  </div>
               )}
            </div>
         </div>

         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Create / Upload Winner Video</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-3 flex-grow">
                  <div className="flex flex-row items-center gap-4">
                     <div className="text-darkone text-size-4">Game Name: </div>
                     <div className="text-darkone text-size-4">{videoWinner?.GameDetails.name}</div>
                  </div>
                  <div className="flex flex-row gap-4">
                     <div className="text-darkone text-size-4">Announcement Date: </div>
                     <div className="text-darkone text-size-4">{formatDateOnly(videoWinner?.createdAt)}</div>
                  </div>
                  <div className="flex flex-row gap-4">
                     <div className="text-darkone text-size-4">Winning Amount: </div>
                     <div className="text-darkone text-size-4">{videoWinner?.prize_amount}</div>
                  </div>
                  <div className="flex flex-col gap-4 my-6">
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="Enter Your Ticket Number" onChange={(e) => setTicketNumber(e.target.value)} />
                     </div>
                  </div>
                  <div className="flex items-center ml-auto gap-6">
                     <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button onClick={handleCreateVideoSubmit} className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Create</button>
                  </div>
               </div>
            </div>
         </Modal>
      </section>
   )
}
