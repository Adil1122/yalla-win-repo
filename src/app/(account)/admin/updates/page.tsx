'use client'

import { faChevronRight, faChevronLeft, faImage, faPlay, faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState, ChangeEvent, useEffect } from 'react'
import Modal from '@/components/modal'
import Link from 'next/link'

interface Item {
   id: string;
   imageUrl: string;
}

interface VideoItem { 
   id: string;
   imageUrl: string;
   data: string;
}

const itemsPerPage = 2

export default function AdminUpdatesSection() {

   const fileInputRef = useRef<HTMLInputElement | null>(null)
   const fileInputVidRef = useRef<HTMLInputElement | null>(null)

   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   const [addItemType, setAddItemType] = useState<string>('')
   
   const [hbCurrentPage, setHbCurrentPage] = useState(0)
   const [mhbCurrentPage, setMhbCurrentPage] = useState(0)
   const [homeBanners, setHomeBanners] = useState<Item[]>([])
   const currentHomebanners = homeBanners.slice(hbCurrentPage * itemsPerPage, (hbCurrentPage + 1) * itemsPerPage)
   
   const [mobileomeBanners, setMobileHomeBanners] = useState<Item[]>([])
   const currentMobileHomeBanners = mobileomeBanners.slice(mhbCurrentPage * itemsPerPage, (mhbCurrentPage + 1) * itemsPerPage)

   const [wvCurrentPage, setWvCurrentPage] = useState(0)
   const [winnersVideos, setWinnersVideos] = useState<VideoItem[]>([])
   const currentWinnersVideos = winnersVideos.slice(wvCurrentPage * itemsPerPage, (wvCurrentPage + 1) * itemsPerPage)
   const [products, setProducts] = useState([])

   const handleHomeBannersNext = () => {
      if ((hbCurrentPage + 1) * itemsPerPage < homeBanners.length) {
         setHbCurrentPage((prevPage) => prevPage + 1)
      }
   }

   const handleHomeBannersPrev = () => {
      if (hbCurrentPage > 0) {
         setHbCurrentPage((prevPage) => prevPage - 1);
      }
   }
   
   const handleMobileHomeBannersNext = () => {
      if ((mhbCurrentPage + 1) * itemsPerPage < mobileomeBanners.length) {
         setMhbCurrentPage((prevPage) => prevPage + 1)
      }
   }
   
   const handleMobileHomeBannersPrev = () => {
      if (mhbCurrentPage > 0) {
         setHbCurrentPage((prevPage) => prevPage - 1);
      }
   }
   
   const handleWinnersVideosPrev = () => {
      if (wvCurrentPage > 0) {
         setHbCurrentPage((prevPage) => prevPage - 1);
      }
   }
   
   const handleWinnersVideosNext = () => {
      if ((wvCurrentPage + 1) * itemsPerPage < winnersVideos.length) {
         setWvCurrentPage((prevPage) => prevPage + 1)
      }
   }

   const handleButtonClick = (type: string) => {
      setAddItemType(type)
      fileInputRef.current?.click()
   }
   
   const handleButtonVideoClick = (type: string) => {
      setAddItemType(type)
      fileInputVidRef.current?.click()
   }

   const handleFileChange = (event: any) => {
      const file = event.target.files?.[0]
      if (file) {
         if (file.type.startsWith('video/')) {
            const videoElement = document.createElement('video')
            const videoURL = URL.createObjectURL(file)
            videoElement.src = videoURL
   
            videoElement.addEventListener('loadeddata', () => {
               videoElement.currentTime = 1 
            })
      
            videoElement.addEventListener('seeked', () => {
               const canvas = document.createElement('canvas')
               canvas.width = 120
               canvas.height = 90 
               const context = canvas.getContext('2d')
               if (context) {
                     context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
                     const thumbnailUrl = canvas.toDataURL('image/png')
                     onSubmit(file, 'winner-videos', thumbnailUrl as string)
               }
            })
         
            videoElement.load()
         } else {

            const reader = new FileReader()
            reader.onloadend = () => {
               if (addItemType == 'desktop-banners') {
                } else if (addItemType == 'mobile-banners') {
                }
                onSubmit(file, addItemType, '')
            }
            reader.readAsDataURL(file)
         }
      }
   }

   async function onSubmit(file:any, type: any, thumbnail: any) {
      console.log('thumbnail: ', thumbnail)
      try {
         let formData = new FormData();
         formData.append("type", type);
         formData.append("file", file);
         formData.append("thumbnail", thumbnail);

         let response = await fetch('/api/admin/updates', {
            method: 'POST',
            body: formData,
          });

          getAllRecords()
      } catch(error) {

      }
   }

   useEffect(() => {
      getAllRecords()
   }, [])

   async function getAllRecords() {
      try {
         let response = await fetch('/api/admin/updates', {
            method: 'GET',
          });

          var content = await response.json();

          if(!response.ok) {

          } else {

            var records: any = content.records;
            var desktop_banners = [];
            var mobile_banners = [];
            var winner_videos = [];

            for(var i = 0; i < records.length; i++) {

               if(records[i].type === 'desktop-banners') {
                  var banner = { id: records[i]._id, imageUrl: records[i].file_url };
                  desktop_banners.push(banner)
               } else if(records[i].type === 'mobile-banners') {
                  var banner = { id: records[i]._id, imageUrl: records[i].file_url };
                  mobile_banners.push(banner)
               } else if(records[i].type === 'winner-videos') { 
                  var video = { id: records[i]._id, imageUrl: records[i].thumbnail, data: records[i].file_url };
                  winner_videos.push(video)
               }

            }
            setHomeBanners(desktop_banners)
            setMobileHomeBanners(mobile_banners)
            setWinnersVideos(winner_videos)
            setProducts(content.products)

          }
      } catch (error) {
         
      }
   }

   const handleClick = () => {
      setModalIsOpen(true)
   }

   var [deleteId, setDeleteId] = useState('')
   const handleRemove = (id: string) => {
      setDeleteId(id)
      setModalTwoIsOpen(true)
   }

   async function deleteRecord() {
      try {
         let response = await fetch('/api/admin/updates?id=' + deleteId, {
            method: 'DELETE',
          });
          setModalTwoIsOpen(false)
          getAllRecords()
      } catch (error) {
         
      }
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
                  <button onClick={() => handleButtonClick('desktop-banners')} type="button" className="flex flex-col items-center justify-center gap-3 bg-white py-12 h-[200px]">
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
                  <button onClick={handleHomeBannersPrev} type="button" className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-transparent border-[3px] border-white p-2 flex items-center justify-center rounded-full">
                     <FontAwesomeIcon icon={faChevronLeft} size="lg" className="text-white" /> 
                  </button>
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
                  <button onClick={() => handleButtonClick('mobile-banners')} type="button" className="flex flex-col items-center justify-center gap-3 bg-white py-12 h-[200px]">
                     <div className="flex items-center justify-center border-[3px] border-themetwo rounded-full w-[35px] h-[35px]">
                        <FontAwesomeIcon className="text-themetwo" icon={faPlus} size="lg" /> 
                     </div>
                     <div className="text-darkone text-head-2">Add More</div>
                  </button>
                  <input type="file" className="opacity-0 absolute top-0 left-0 w-0 h-0" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
                  <input type="file" className="opacity-0 absolute top-0 left-0 w-0 h-0" accept="video/*" ref={fileInputVidRef} onChange={handleFileChange} />
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
                  <button onClick={handleMobileHomeBannersPrev} type="button" className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-transparent border-[3px] border-white p-2 flex items-center justify-center rounded-full">
                     <FontAwesomeIcon icon={faChevronLeft} size="lg" className="text-white" /> 
                  </button>
                  <button onClick={handleMobileHomeBannersNext} type="button" className="absolute -right-24 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-transparent border-[3px] border-white p-2 flex items-center justify-center rounded-full">
                     <FontAwesomeIcon icon={faChevronRight} size="lg" className="text-white" /> 
                  </button>
               </div>
            </div>
            
            <div className="flex flex-col gap-8">
               <h3 className="text-head-4 text-white">Winners Videos</h3>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                  <button onClick={() => handleButtonVideoClick('winner-videos')} type="button" className="flex flex-col items-center justify-center gap-3 bg-white py-12 h-[200px]">
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
                  <button onClick={handleWinnersVideosPrev} type="button" className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-transparent border-[3px] border-white p-2 flex items-center justify-center rounded-full">
                     <FontAwesomeIcon icon={faChevronLeft} size="lg" className="text-white" /> 
                  </button>
                  <button onClick={handleWinnersVideosNext} type="button" className="absolute -right-24 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-transparent border-[3px] border-white p-2 flex items-center justify-center rounded-full">
                     <FontAwesomeIcon icon={faChevronRight} size="lg" className="text-white" /> 
                  </button>
               </div>
            </div>

            <div className="flex flex-col gap-8">
               <h3 className="text-head-4 text-white">Rules & Pricing</h3>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
               {products.map((product: any) => (
                  <div key={product._id} className="flex flex-col items-center justify-center">
                     <div className="flex flex-col w-full h-[200px] relative">
                        <div className={`bg-[url("/assets/images/home.svg")] bg-center bg-cover bg-no-repeat w-full h-full border border-white`}></div>
                        <Link href={"updates/view/" + product._id} className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-12 rounded-standard text-themeone text-size-4 whitespace-nowrap">View Details</Link>
                     </div>
                     <div className="flex w-full bg-white items-center justify-between px-5 py-3">
                        <div className="text-darkone text-head-2">{product.name}</div>
                        <div className="text-theme-gradient text-head-2">AED {product.price}</div>
                     </div>
                  </div>
               ))}

                  {/*<div className="flex flex-col items-center justify-center">
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
                  </div>*/}
                  
               </div>
            </div>
         </div>

         <Modal open={modalTwoIsOpen} onClose={() => setModalTwoIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
               <div className="text-darkone font-medium text-head-3">Delete</div>
               <div className="text-darkone text-size-4">Are you sure you want to delete this record?</div>
               <div className="flex items-center gap-6 mt-3">
                  <button onClick={() => setModalTwoIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded">Cancel</button>
                  <button className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={deleteRecord}>Delete</button>
               </div>
            </div>
         </Modal>
      </section>
   )
}
