'use client'

import { faChevronRight, faImage, faPlay, faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import Modal from '@/components/modal'
import Link from 'next/link'

interface Item {
   id: number;
   imageUrl: string;
}

const itemsPerPage = 2

export default function AdminUpdatesSection() {

   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   
   const [hbCurrentPage, setHbCurrentPage] = useState(0)
   const [mhbCurrentPage, setMhbCurrentPage] = useState(0)
   const [homeBanners, setHomeBanners] = useState<Item[]>([
      { id: 1, imageUrl: '/assets/images/home.svg' },
      { id: 2, imageUrl: '/assets/home-slider/image.svg' },
      { id: 3, imageUrl: '/assets/images/winner-img.svg' },
      { id: 4, imageUrl: '/assets/home-slider/slider-img.svg' }
   ])
   const currentHomebanners = homeBanners.slice(hbCurrentPage * itemsPerPage, (hbCurrentPage + 1) * itemsPerPage)
   
   const [mobileomeBanners, setMobileHomeBanners] = useState<Item[]>([
      { id: 1, imageUrl: '/assets/images/home.svg' },
      { id: 2, imageUrl: '/assets/home-slider/image.svg' },
      { id: 3, imageUrl: '/assets/images/winner-img.svg' },
      { id: 4, imageUrl: '/assets/home-slider/slider-img.svg' }
   ])
   const currentMobileHomeBanners = mobileomeBanners.slice(mhbCurrentPage * itemsPerPage, (mhbCurrentPage + 1) * itemsPerPage)

   const [wvCurrentPage, setWvCurrentPage] = useState(0)
   const [winnersVideos, setWinnersVideos] = useState<Item[]>([
      { id: 1, imageUrl: '/assets/images/home.svg' },
      { id: 2, imageUrl: '/assets/home-slider/image.svg' },
      { id: 3, imageUrl: '/assets/images/winner-img.svg' },
      { id: 4, imageUrl: '/assets/home-slider/slider-img.svg' }
   ])
   const currentWinnersVideos = winnersVideos.slice(wvCurrentPage * itemsPerPage, (wvCurrentPage + 1) * itemsPerPage)

   const handleHomeBannersNext = () => {
      if ((hbCurrentPage + 1) * itemsPerPage < homeBanners.length) {
         setHbCurrentPage((prevPage) => prevPage + 1)
      }
   }
   
   const handleMobileHomeBannersNext = () => {
      if ((mhbCurrentPage + 1) * itemsPerPage < mobileomeBanners.length) {
         setMhbCurrentPage((prevPage) => prevPage + 1)
      }
   }
   
   const handleWinnersVideosNext = () => {
      if ((wvCurrentPage + 1) * itemsPerPage < winnersVideos.length) {
         setWvCurrentPage((prevPage) => prevPage + 1)
      }
   }

   const handleClick = () => {
      setModalIsOpen(true)
   }

   const handleRemove = (id: number) => {
      setModalTwoIsOpen(true)
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col gap-12 w-[92%] h-full">
            <div className="flex flex-col gap-8">
               <div className="flex flex-col items-center lg:justify-between lg:flex-row">
                  <h3 className="text-head-4 text-white">Desktop Home Banners</h3>
                  <button type="button" className="font-bold text-white text-size-4">View all</button>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                  <button type="button" className="flex flex-col items-center justify-center gap-3 bg-white py-12 h-[200px]">
                     <div className="flex items-center justify-center border-[3px] border-themetwo rounded-full w-[35px] h-[35px]">
                        <FontAwesomeIcon className="text-themetwo" icon={faPlus} size="lg" /> 
                     </div>
                     <div className="text-darkone text-head-2">Add More</div>
                  </button>
                  {currentHomebanners.map((item) => (
                     <div key={item.id} className="flex flex-col items-center justify-center gap-3 bg-white h-[200px] relative">
                        <div style={{backgroundImage: `url(${item.imageUrl})`}} className={`bg-center bg-cover bg-no-repeat w-full h-full border border-white`}></div>
                        <button onClick={() => handleRemove(item.id)} type="button" className="absolute top-6 right-6">
                           <FontAwesomeIcon icon={faTrashAlt} className="text-white" size="2xl" />
                        </button>
                        <button onClick={() => handleRemove(item.id)} type="button" className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-6 rounded-standard text-themeone text-size-4">
                           Remove
                        </button>
                     </div>
                  ))}
                  <button onClick={handleHomeBannersNext} type="button" className="absolute -right-24 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-transparent border-[3px] border-white p-2 flex items-center justify-center rounded-full">
                     <FontAwesomeIcon icon={faChevronRight} size="lg" className="text-white" /> 
                  </button>
               </div>
            </div>
            
            <div className="flex flex-col gap-8">
               <div className="flex flex-col items-center lg:justify-between lg:flex-row">
                  <h3 className="text-head-4 text-white">Mobile Home Banners</h3>
                  <button type="button" className="font-bold text-white text-size-4">View all</button>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                  <button type="button" className="flex flex-col items-center justify-center gap-3 bg-white py-12 h-[200px]">
                     <div className="flex items-center justify-center border-[3px] border-themetwo rounded-full w-[35px] h-[35px]">
                        <FontAwesomeIcon className="text-themetwo" icon={faPlus} size="lg" /> 
                     </div>
                     <div className="text-darkone text-head-2">Add More</div>
                  </button>
                  {currentMobileHomeBanners.map((item) => (
                     <div key={item.id} className="flex flex-col items-center justify-center gap-3 bg-white h-[200px] relative">
                        <div style={{backgroundImage: `url(${item.imageUrl})`}} className={`bg-center bg-cover bg-no-repeat w-full h-full border border-white`}></div>
                        <button onClick={() => handleRemove(item.id)} type="button" className="absolute top-6 right-6">
                           <FontAwesomeIcon icon={faTrashAlt} className="text-white" size="2xl" />
                        </button>
                        <button onClick={() => handleRemove(item.id)} type="button" className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-6 rounded-standard text-themeone text-size-4">
                           Remove
                        </button>
                     </div>
                  ))}
                  <button onClick={handleMobileHomeBannersNext} type="button" className="absolute -right-24 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-transparent border-[3px] border-white p-2 flex items-center justify-center rounded-full">
                     <FontAwesomeIcon icon={faChevronRight} size="lg" className="text-white" /> 
                  </button>
               </div>
            </div>
            
            <div className="flex flex-col gap-8">
               <h3 className="text-head-4 text-white">Winners Videos</h3>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                  <button type="button" className="flex flex-col items-center justify-center gap-3 bg-white py-12 h-[200px]">
                     <div className="flex items-center justify-center border-[3px] border-themetwo rounded-full w-[35px] h-[35px]">
                        <FontAwesomeIcon className="text-themetwo" icon={faPlus} size="lg" /> 
                     </div>
                     <div className="text-darkone text-head-2">Add More</div>
                  </button>
                  {currentWinnersVideos.map((item) => (
                     <div key={item.id} className="flex flex-col items-center justify-center gap-3 bg-white h-[200px] relative">
                        <div style={{backgroundImage: `url(${item.imageUrl})`}} className={`bg-center bg-cover bg-no-repeat w-full h-full border border-white`}></div>
                        <button onClick={() => handleRemove(item.id)} type="button" className="absolute top-6 right-6">
                           <FontAwesomeIcon icon={faTrashAlt} className="text-white" size="2xl" />
                        </button>
                        <button type="button" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[40px] h-[40px] rounded-standard text-themeone text-size-4">
                           <FontAwesomeIcon icon={faPlay} className="text-darkone ml-1" size="lg" />
                        </button>
                        <button onClick={() => handleRemove(item.id)} type="button" className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-6 rounded-standard text-themeone text-size-4">Remove</button>
                     </div>
                  ))}
                  <button onClick={handleWinnersVideosNext} type="button" className="absolute -right-24 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-transparent border-[3px] border-white p-2 flex items-center justify-center rounded-full">
                     <FontAwesomeIcon icon={faChevronRight} size="lg" className="text-white" /> 
                  </button>
               </div>
            </div>

            <div className="flex flex-col gap-8">
               <h3 className="text-head-4 text-white">Rules & Pricing</h3>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                  <div className="flex flex-col items-center justify-center">
                     <div className="flex flex-col w-full h-[200px] relative">
                        <div className={`bg-[url("/assets/images/home.svg")] bg-center bg-cover bg-no-repeat w-full h-full border border-white`}></div>
                        <Link href="updates/view/yalla-3" className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-12 rounded-standard text-themeone text-size-4 whitespace-nowrap">View Details</Link>
                     </div>
                     <div className="flex w-full bg-white items-center justify-between px-5 py-3">
                        <div className="text-darkone text-head-2">Yalla 3</div>
                        <div className="text-theme-gradient text-head-2">AED 12</div>
                     </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <div className="flex flex-col w-full h-[200px] relative">
                        <div className={`bg-[url("/assets/images/home.svg")] bg-center bg-cover bg-no-repeat w-full h-full border border-white`}></div>
                        <Link href="" className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-12 rounded-standard text-themeone text-size-4 whitespace-nowrap">View Details</Link>
                     </div>
                     <div className="flex w-full bg-white items-center justify-between px-5 py-3">
                        <div className="text-darkone text-head-2">Yalla 4</div>
                        <div className="text-theme-gradient text-head-2">AED 12</div>
                     </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <div className="flex flex-col w-full h-[200px] relative">
                        <div className={`bg-[url("/assets/images/home.svg")] bg-center bg-cover bg-no-repeat w-full h-full border border-white`}></div>
                        <Link href="" className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-12 rounded-standard text-themeone text-size-4 whitespace-nowrap">View Details</Link>
                     </div>
                     <div className="flex w-full bg-white items-center justify-between px-5 py-3">
                        <div className="text-darkone text-head-2">Yalla 6</div>
                        <div className="text-theme-gradient text-head-2">AED 12</div>
                     </div>
                  </div>
                  
               </div>
            </div>
         </div>

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
