'use client'

import React, { useState } from 'react'
import { faArrowLeft, faChevronLeft, faChevronRight, faEye, faPaperPlane, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import Link from 'next/link'

type Tab = 'details' | 'communication'

export default function AdminViewMerchantDetails({ params } : {params: { name: string; }}) {

   const [activeTab, setActiveTab] = useState<Tab>('details')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [messageReply, setMessageReply] = useState<boolean>(false)
   

   const handleMessageActionClick = (action: 'view' | 'send') => {

      {/* manipulate modal as per the action */}
      setModalIsOpen(true)
   }

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">
            <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
               <div className="cursor-pointer">
                  <FontAwesomeIcon size="xl" icon={faArrowLeft} />
               </div>
               <Link href="/admin/updates" className="cursor-pointer text-head-3 font-medium">View Details</Link>
            </div>
            
            <div className="flex flex-col px-12 mt-12 gap-12">
               <div className="flex flex-col w-fit gap-4">
                  <div className="text-white text-head-4">Yalla 3</div>
                  <div className="flex flex-col">
                     <div className="flex flex-col relative border border-white">
                        <img className="max-w-[270px]" src="/assets/images/home.svg" alt="" />
                     </div>
                     <div className="flex w-full bg-white items-center justify-between px-5 py-3">
                        <div className="text-darkone text-size-2">Img</div>
                        <div className="text-theme-gradient text-size-2 cursor-pointer">Edit</div>
                     </div>
                  </div>
               </div>
               
               <div className="flex flex-col w-fit gap-4 w-full">
                  <div className="text-white text-head-4">Product Description</div>
                  <div className="flex flex-col bg-white px-12 py-12 gap-8">
                     <div className="flex lg:w-1/2 gap-6">
                        <div className="flex flex-col gap-2 flex-1">
                           <div className="text-darkone font-semibold text-size-4">Product Name</div>
                           <div className="text-darkone border border-lighttwo text-size-3 rounded">
                              <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="Yalla 3" />
                           </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                           <div className="text-darkone font-semibold text-size-4">Product Price</div>
                           <div className="text-darkone border border-lighttwo text-size-3 rounded">
                              <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="AED 5" />
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-darkone font-semibold text-size-4">Introduction</div>
                        <textarea className="text-darkone border border-lighttwo text-size-3 px-6 py-3 pb-16 rounded focus:outline-none focus:ring-0 resize-none">
                           A numerical game where participants select three numbers from 0 to 9 and predict the outcome of a draw. Three play options: 
                           OPTION STRAIGHT, OPTION RUMBLE, and OPTION CHANCE.
                        </textarea>
                     </div>
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-darkone font-semibold text-size-4">How to participate</div>
                        <div className="text-darkone border border-lighttwo text-size-3 rounded">
                           <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="Purchase the product (e.g., pencil) to get a free ticket." />
                        </div>
                     </div>
                     <div className="flex flex-col lg:flex-row w-full gap-4">
                        <div className="flex flex-col gap-6 w-full">
                           <div className="text-darkone font-semibold text-size-4">Options & Prizes</div>
                           <div className="flex flex-col gap-6">
                              <div className="flex gap-6 justify-between lg:w-[60%]">
                                 <div className="flex flex-col gap-2 lg:w-[50%]">
                                    <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">Option Straight</div>
                                    <div className="text-darkone border border-lighttwo text-size-3 rounded">
                                       <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="Exact order win, prize:" />
                                    </div>
                                 </div>
                                 <div className="flex items-start text-darkone">
                                    <div className="flex flex-col gap-2 justify-center items-center">
                                       <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                       <div className="border border-lighttwo text-size-3 rounded">
                                          <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="5" />
                                       </div>
                                    </div>
                                    <div className="mx-4 text-head-7">*</div>
                                    <div className="flex flex-col gap-2 items-center">
                                       <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                       <div className="border border-lighttwo text-size-3 rounded">
                                          <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="750" />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-6 justify-between lg:w-[60%]">
                                 <div className="flex flex-col gap-2 lg:w-[50%]">
                                    <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">Option Rumble</div>
                                    <div className="text-darkone border border-lighttwo text-size-3 rounded">
                                       <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="Any order win, prize:" />
                                    </div>
                                 </div>
                                 <div className="flex items-start text-darkone">
                                    <div className="flex flex-col gap-2 justify-center items-center">
                                       <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                       <div className="border border-lighttwo text-size-3 rounded">
                                          <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="5" />
                                       </div>
                                    </div>
                                    <div className="mx-4 text-head-7">*</div>
                                    <div className="flex flex-col gap-2 items-center">
                                       <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                       <div className="border border-lighttwo text-size-3 rounded">
                                          <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="750" />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col gap-6">
                                 <div className="flex flex-col gap-2">
                                    <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">Option Chance</div>
                                    <div className="text-darkone border border-lighttwo text-size-3 rounded">
                                       <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="Exact order from right to left win with partial matches" />
                                    </div>
                                 </div>
                                 <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                    <div className="flex flex-col gap-2 w-fit">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">3 Correct Numbers</div>
                                       <div className="flex items-start text-darkone">
                                          <div className="flex flex-col gap-2 justify-center items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="5" />
                                             </div>
                                          </div>
                                          <div className="mx-4 text-head-7">*</div>
                                          <div className="flex flex-col gap-2 items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="750" />
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-fit">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">2 Correct Numbers</div>
                                       <div className="flex items-start text-darkone">
                                          <div className="flex flex-col gap-2 justify-center items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="5" />
                                             </div>
                                          </div>
                                          <div className="mx-4 text-head-7">*</div>
                                          <div className="flex flex-col gap-2 items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="750" />
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-fit">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">1 Correct Number</div>
                                       <div className="flex items-start text-darkone">
                                          <div className="flex flex-col gap-2 justify-center items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="5" />
                                             </div>
                                          </div>
                                          <div className="mx-4 text-head-7">*</div>
                                          <div className="flex flex-col gap-2 items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" value="750" />
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    {/* for yall 4 and yalla 6 add another box below */}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

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
