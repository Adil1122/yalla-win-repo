'use client'

import React, { useState } from 'react'
import { faArrowLeft, faChevronLeft, faChevronRight, faEye, faPaperPlane, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'

type Tab = 'games' | 'products' | 'transaction' | 'communication'
type InvoiceTab = 'invoice' | 'ticket'

export default function AdminUserProfile({ params } : {params: { id: string; }}) {

   const [activeTab, setActiveTab] = useState<Tab>('games')
   const [activeInvoiceTab, setInvoiceActiveTab] = useState<InvoiceTab>('invoice')
   const [showInvoice, setShowInvoice] = useState<boolean>(false)
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [messageReply, setMessageReply] = useState<boolean>(false)
   

   const handleMessageActionClick = (action: 'view' | 'send') => {

      {/* manipulate modal as per the action */}
      setModalIsOpen(true)
   }
   
   const handleInvoiceTabChange = (tab: InvoiceTab) => {
      setInvoiceActiveTab(tab)
   }

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }

   const handleShowInvoice = (input: string) => {
      setShowInvoice(true)
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         {!showInvoice && (
            <div className="flex flex-col flex-grow">
               <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
                  <div className="cursor-pointer">
                     <FontAwesomeIcon size="xl" icon={faArrowLeft} />
                  </div>
                  <div className="cursor-pointer text-head-3 font-medium">Customer Profile</div>
               </div>
               <div className="flex items-center justify-between px-16 py-12 gap-12">
                  <div className="border border-white flex items-center justify-center rounded-full h-[100px] w-[100px]">
                     <img className="rounded-full" src="/assets/dashboard/profile-pic.svg" alt="" />
                  </div>
                  <div className="flex items-start flex-grow gap-24">
                     <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 font-medium text-head-1">
                           <div className="text-white w-[80px]">ID:</div>
                           <div className="text-lighttwo">123</div>
                        </div>
                        <div className="flex items-center gap-2 font-medium text-head-1">
                           <div className="text-white w-[80px]">Name:</div>
                           <div className="text-lighttwo">Customer Name</div>
                        </div>
                        <div className="flex items-center gap-2 font-medium text-head-1">
                           <div className="text-white w-[80px]">Email:</div>
                           <div className="text-lighttwo">customer@gmail.com</div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-6 font-medium text-head-1">
                           <div className="text-white min-w-[80px]">No. of Orders:</div>
                           <div className="text-lighttwo">10</div>
                        </div>
                        <div className="flex items-center gap-6 font-medium text-head-1">
                           <div className="text-white min-w-[80px]">Amount Spent:</div>
                           <div className="text-lighttwo">AED 122</div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="px-12">
                  <div className="flex flex-row items-center py-3 px-6 gap-3 w-full bg-white rounded-lg lg:w-1/2">
                     <div>
                        <FontAwesomeIcon size="lg" icon={faSearch} />
                     </div>
                     <div className="w-full">
                        <input type="text" className="h-[40px] w-full bg-transparent ml-2 border-none focus:outline-none focus:ring-0 -mt-1" placeholder="Search By QR Id" />
                     </div>
                  </div>
               </div>
               <div className="mt-12 px-12 flex items-center w-full gap-12 text-white text-size-4">
                  <div className={`cursor-pointer ${activeTab === 'games' ? 'underline' : ''}`} onClick={() => handleTabChange('games')}>Raffle Games</div>
                  <div className={`cursor-pointer ${activeTab === 'products' ? 'underline' : ''}`} onClick={() => handleTabChange('products')}>Raffle Products</div>
                  <div className={`cursor-pointer ${activeTab === 'transaction' ? 'underline' : ''}`} onClick={() => handleTabChange('transaction')}>Trasanction History</div>
                  <div className={`cursor-pointer ${activeTab === 'communication' ? 'underline' : ''}`} onClick={() => handleTabChange('communication')}>Communication Log</div>
               </div>

               <div className="flex flex-col mt-12 px-12">
                  {activeTab == 'games' && (
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">QR ID</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product</th> 
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Image</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Category</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Type</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Price</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">PEN123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Product name</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                                 <img className="max-w-[60px] mx-auto" src="/assets/images/cap.svg" alt="" />
                              </td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 3</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Straight</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Awaiting</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => handleShowInvoice('12')} type="button" className="flex items-center justify-center px-3 border-[2px] bg-white text-themeone font-bold border-themeone rounded py-2">
                                       Invoice
                                    </button>
                                 </div>
                              </td>
                           </tr>
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">PEN123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Product name</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                                 <img className="max-w-[60px] mx-auto" src="/assets/images/cap.svg" alt="" />
                              </td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Yalla 3</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Straight</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Awaiting</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => handleShowInvoice('12')} type="button" className="flex items-center justify-center px-3 border-[2px] bg-white text-themeone font-bold border-themeone rounded py-2">
                                       Invoice
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  )}

                  {activeTab == 'products' && (
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">QR ID</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product</th> 
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Image</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Prize Name</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Type</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Price</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">PEN123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Product name</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                                 <img className="max-w-[60px] mx-auto" src="/assets/images/cap.svg" alt="" />
                              </td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">iPhone</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Straight</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Awaiting</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => handleShowInvoice('12')} type="button" className="flex items-center justify-center px-3 border-[2px] bg-white text-themeone font-bold border-themeone rounded py-2">
                                       Invoice
                                    </button>
                                 </div>
                              </td>
                           </tr>
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">PEN123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Product name</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                                 <img className="max-w-[60px] mx-auto" src="/assets/images/cap.svg" alt="" />
                              </td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">iPhone</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Straight</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Awaiting</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => handleShowInvoice('12')} type="button" className="flex items-center justify-center px-3 border-[2px] bg-white text-themeone font-bold border-themeone rounded py-2">
                                       Invoice
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  )}
                  
                  {activeTab == 'transaction' && (
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Trasnaction #</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Order #</th> 
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Payment</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Via</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Card No</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Amount</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Note</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Deposit</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">card</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234567891234567</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Amount Deposited against order 123</td>
                           </tr>
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Deposit</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">card</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234567891234567</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Amount Deposited against order 123</td>
                           </tr>
                        </tbody>
                     </table>
                  )}
                  
                  {activeTab == 'communication' && (
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Message ID</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Title</th> 
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date Sent</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">This is the message</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => handleMessageActionClick('view')} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faEye} />
                                    </button>
                                    <button type="button" onClick={() => handleMessageActionClick('send')} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faPaperPlane} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">This is the message</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => handleMessageActionClick('view')} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faEye} />
                                    </button>
                                    <button type="button" onClick={() => handleMessageActionClick('send')} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faPaperPlane} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  )}

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
         )}

         {showInvoice && (
            <div className="flex flex-col flex-grow gap-12">
               <div className="flex flex-col flex-grow">
                  <div onClick={() => setShowInvoice(false)} className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
                     <div className="cursor-pointer">
                        <FontAwesomeIcon size="xl" icon={faArrowLeft} />
                     </div>
                     <div className="cursor-pointer text-head-3 font-medium">Customer Invoice</div>
                  </div>
               </div>
               <div className="flex flex-col gap-2 lg:gap-4 w-full">
                  <div className="flex flex-row gap-4 text-white text-size-3 lg:text-size-4 mx-auto text-center">
                     <div className={`cursor-pointer ${activeInvoiceTab === 'invoice' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('invoice')}>Invoice</div>
                     <div className={`cursor-pointer ${activeInvoiceTab === 'ticket' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('ticket')}>Ticket</div>
                  </div>
                  <div className="bg-white w-full lg:w-1/2 mx-auto mt-4 py-4 lg:py-8">
                     {activeInvoiceTab == 'invoice' && (
                        <>
                           <div className="mx-auto w-fit">
                              <img src="/assets/images/logo.svg" alt="" />
                           </div>
                           <div className="bg-custom-purple text-darkone font-noto-sans-black text-head-3 lg:text-big-four uppercase text-center py-2 lg:py-4 mt-4">Invoice</div>
                           <div className="flex flex-col px-8 lg:px-12 font-light text-sm lg:text-size-2 text-black my-4 lg:my-8 gap-2 lg:gap-4">
                              <div className="flex justify-between">
                                 <div>Game Name</div>
                                 <div>Yalla 3</div>
                              </div>
                              
                              <div className="flex justify-between">
                                 <div>Order Number</div>
                                 <div>378378728723</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>VAT %</div>
                                 <div>12</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Total Amount</div>
                                 <div>133 AED</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Order Date</div>
                                 <div>28 July, 2024 8:22 PM*</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Order Status</div>
                                 <div className="text-success">In Progress</div>
                              </div>
                           </div>
                           <div className="flex flex-col items-center gap-2 mt-4">
                              <img src="/assets/images/barcode.svg" alt="" />
                              <div className="font-light text-sm lg:text-size-2">728188278172981</div>
                           </div>
                        </>
                     )}
                     
                     {activeInvoiceTab == 'ticket' && (
                        <>
                           <div className="mx-auto w-fit">
                              <img src="/assets/images/logo.svg" alt="" />
                           </div>
                           <div className="bg-custom-purple text-darkone font-noto-sans-black text-head-3 lg:text-big-four uppercase text-center py-2 lg:py-4 mt-4">Yalla 4</div>
                           <div className="flex flex-col px-8 lg:px-12 font-light text-sm lg:text-size-2 text-black my-4 lg:my-8 gap-6">
                              <div className="w-fit mx-auto">
                                 <img className="max-h-[100px] lg:max-h-[200px]" src="/assets/images/keychain.svg" alt="" />
                              </div>
                              <div className="flex flex-col gap-2 lg:gap-4">
                                 <div className="flex justify-between">
                                    <div>Order Number</div>
                                    <div>37319082192</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>Game Name</div>
                                    <div>Yalla 3</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>VAT %</div>
                                    <div>12</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>Total Amount</div>
                                    <div>123 AED</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>Order Date</div>
                                    <div>28 July, 2024 8:22 PM</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>Order Status</div>
                                    <div className="text-success">Active</div>
                                 </div>
                              </div>
                              
                              <div className="grid grid-cols-4 lg:grid-cols-4 mt-4 lg:text-size-1 text-xs">
                                 <div className="flex flex-col gap-2 items-center">
                                    <div className="font-medium lg:font-bold uppercase">Numbers</div>
                                    <div className="font-light">7498</div>
                                 </div>
                                 <div className="flex flex-col gap-2 items-center">
                                    <div className="font-medium lg:font-bold uppercase">Straight</div>
                                    <div className="font-light">1</div>
                                 </div>
                                 <div className="flex flex-col gap-2 items-center">
                                    <div className="font-medium lg:font-bold uppercase">Rumble</div>
                                    <div className="font-light">1</div>
                                 </div>
                                 <div className="flex flex-col gap-2 items-center">
                                    <div className="font-medium lg:font-bold uppercase">Chance</div>
                                    <div className="font-light">1</div>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col items-center gap-2 mt-4">
                              <img src="/assets/images/barcode.svg" alt="" />
                              <div className="font-light text-sm lg:text-size-2">73817298172891</div>
                           </div>
                        </>
                     )}
                  </div>
                  <button className="text-center text-themeone bg-white mx-auto mt-8 font-medium shadow-custom-1 rounded-full py-3 px-16 w-fit">Print</button>
               </div>
            </div>
         )}

         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">View Message</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col lg:flex-row lg:justify-between">
                        <div className="text-darkone text-size-4">Message</div>
                        <div className="text-lightone text-size-4">10 sep 2024, 12:30 am</div>
                     </div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                     <textarea className="w-full h-[150px] focus:ring-0 focus:outline-none border-none bg-transparent resize-none" placeholder="Message title"></textarea>
                     </div>
                  </div>
                  {messageReply && (
                     <>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="Type your reply" />
                           </div>
                        </div>
                        <div className="flex items-center ml-auto gap-6">
                           <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                           <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Save</button>
                        </div>
                     </>
                  )}
                  {!messageReply && (
                     <button onClick={() => setMessageReply(true)} className="text-white text-head-1 ml-auto font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Reply</button>
                  )}
               </div>
            </div>
         </Modal>
      </section>
   )
}