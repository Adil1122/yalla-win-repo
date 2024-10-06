'use client'

import React, { useRef, useState } from 'react'
import { faChevronLeft, faChevronRight, faCommentAlt, faEye, faImage, faPencil, faPlus, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'

type Tab = 'app-web' | 'merchant'
type TabTwo = 'games' | 'products'

export default function AdminUpDrawsManagement() {

   const [activeTab, setActiveTab] = useState<Tab>('app-web')
   const [activeTabTwo, setActiveTabTwo] = useState<TabTwo>('games')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   const [modalThreeIsOpen, setModalThreeIsOpen] = useState<boolean>(false)
   const [toggled, setToggled] = useState(false)
   const [productDetails, setProductDetails] = useState([{ size: '', image: '' }])

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }

   const handleTabTwoChange = (tab: TabTwo) => {
      setActiveTabTwo(tab)
   }

   const handleToggle = () => {
      setToggled(!toggled)
   }

   const handleGameActionClick = (action: 'add' | 'edit') => {

      {/* manipulate modal as per the action */}
      setModalIsOpen(true)
   }
   
   const handleDelete = (id: string | number) => {
      setModalTwoIsOpen(true)
   }

   const handleAddDetails = () => {
      setProductDetails([...productDetails, { size: '', image: '' }])
   }

   const handleDeleteRow = (ind: number) => {
      setProductDetails((prevRows) => prevRows.filter((_, index) => index !== ind))
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col w-full h-full">
            <div className="flex flex-col gap-4 lg:flex-row w-full">
               <div className="flex items-center w-full lg:w-1/2 max-w-xl border-[2px] border-white text-white font-bold text-size-4">
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'app-web' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('app-web')}>App & Web</div>
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'merchant' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('merchant')}>Merchant</div>
               </div>
               <button type="button" onClick={() => handleGameActionClick('add')} className="flex items-center border gap-3 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                  <FontAwesomeIcon size="lg" icon={faPlus} />
                  <div className="capitalize font-medium text-size-2">Add New</div>
               </button>
            </div>
            <div className="flex items-center w-full gap-12 text-white font-bold text-size-4 mt-12">
               <div className={`cursor-pointer ${activeTabTwo === 'games' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('games')}>Upcoming Raffle Games</div>
               <div className={`cursor-pointer ${activeTabTwo === 'products' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('products')}>Upcoming Raffle Products</div>
            </div>
            <div className="flex flex-col mt-6">

               {activeTabTwo == 'games' && (
                  <></>
               )}

               {activeTabTwo == 'products' && (
                  <></>
               )}

               <table className="w-full">
                  <thead>
                     <tr className="bg-white">
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-bl rounded-tl">Game Name</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th> 
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Time</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                     <tr>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">yala 6</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">24 Aug, 2024</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12:30 am</td>
                        <td>
                           <div className="flex items-center justify-center gap-2">
                              <button type="button" onClick={() => handleGameActionClick('edit')} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                 <FontAwesomeIcon size="lg" icon={faPencil} />
                              </button>
                              <button type="button" onClick={() => handleDelete(123)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                 <FontAwesomeIcon size="lg" icon={faTrashAlt} />
                              </button>
                           </div>
                        </td>
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
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Add New</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Game Name</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="Yalla 3" />
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Date and Time</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="datetime-local" />
                     </div>
                  </div>
                  <div className="flex items-center ml-auto gap-6">
                     <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Save</button>
                  </div>
               </div>
            </div>
         </Modal>
         
         <Modal open={modalTwoIsOpen} onClose={() => setModalTwoIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
               <div className="text-darkone font-medium text-head-3">Delete</div>
               <div className="text-darkone text-size-4">Are you sure you want to delete this record?</div>
               <div className="flex items-center gap-6 mt-3">
                  <button onClick={() => setModalTwoIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded">Cancel</button>
                  <button className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Delete</button>
               </div>
            </div>
         </Modal>
      </section>
   )
}
