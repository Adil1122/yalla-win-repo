"use client"

import VideoCard from "@/components/VideoCard"
import WinnerCard from "@/components/winner-card"
import React, { useEffect, useRef, useState } from "react"
import Swiper from "swiper"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css";
import MultiRangeSlider from "@/components/multi-range-slider"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"

type Tab = 'game' | 'prize' | 'app'
type TabTwo = 'daily' | 'weekly' | 'monthly'

export default function WinnersPage() {

   const [activeTab, setActiveTab] = useState<Tab>('game')
   const [activeTabTwo, setActiveTabTwo] = useState<TabTwo>('daily')
   const swiperMainRef = useRef(null)

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }
   
   const handleTabTwoChange = (tab: TabTwo) => {
      setActiveTabTwo(tab)
      setSchedule(tab);
   }

   var [game_winners, setGameWinners] = useState([]);
   var [product_winners, setProductWinners] = useState([]);

   // game winners variables for pagination
   var [currentGamePage, setCurrentGamePage] = useState(1);
   var [gameRecordsPerPage, setGameRecordsPerPage] = useState(9);
   var lastGameIndex = currentGamePage * gameRecordsPerPage;
   var firstGameIndex = lastGameIndex - gameRecordsPerPage;
   var currentGameRecords = game_winners.slice(firstGameIndex, lastGameIndex);
   var totalGamePages = game_winners.length;

   var gamePages = [];
   for(var i = 1; i <= Math.ceil(totalGamePages / gameRecordsPerPage); i++) {
      gamePages.push(i);
   }
   
   var [currentProductPage, setCurrentProductPage] = useState(1);
   var [productRecordsPerPage, setProductRecordsPerPage] = useState(9);
   var lastProductIndex = currentProductPage * productRecordsPerPage;
   var firstProductIndex = lastProductIndex - productRecordsPerPage;
   var currentProductRecords = product_winners.slice(firstProductIndex, lastProductIndex);
   var totalProductPages = product_winners.length;

   var productPages = [];
   for(var i = 1; i <= Math.ceil(totalProductPages / productRecordsPerPage); i++) {
      productPages.push(i);
   }

   const [start, setStart] = useState(0)
   const [winner_videos, setWinnerVideos] = useState([])

   useEffect(() => {

      if (swiperMainRef.current) {
         new Swiper(swiperMainRef.current, {
            modules: [Pagination],
            spaceBetween: 40,
            slidesPerView: 3,
            pagination: {
               el: ".swiper-pagination",
               clickable: true,
               bulletClass: 'swiper-pagination-bullet bg-pale-white',
               bulletActiveClass: 'swiper-pagination-bullet-active bg-white',
               renderBullet: (index, className) => {
                  return `<div class="${className} h-[10px] w-[10px] rounded-full cursor-pointer"></div>`
               },
            },
            breakpoints: {
               320: {
                  slidesPerView: 1,
                  spaceBetween: 20
               },
               400: {
                  slidesPerView: 2,
                  spaceBetween: 20
               },
               640: {
                  slidesPerView: 3,
                  spaceBetween: 40
               }
            }
         })
      }

      if(start === 0) {
         setStart(1)
         getWinners();
      }
   }, [winner_videos])

   var min = 0;
   var max = 500;
   var schedule = 'daily';

   function setMinMax(Min: any, Max: any) {
      min = Min;
      max = Max;
   }

   function setSchedule(Schedule: any) {
      schedule = Schedule;
      getWinners();
   }

   function applyFilters() {
      getWinners();
   }

   const getWinners = async() => { 
      try {

         let response = await fetch("api/website/winners?min_price=" + min + '&max_price=' + max + '&schedule=' + schedule, {
            method: "GET",
            });
            const content = await response.json();
            console.log(content)

            if(!response.ok) {
            } else {
               var gameWinners: any = Array.from(content.game_winners);
               var productWinners: any = Array.from(content.product_winners);
               var winner_videos: any = Array.from(content.winner_videos);
               setGameWinners(gameWinners);
               setProductWinners(productWinners);
               setWinnerVideos(winner_videos)
            }
         
      } catch (error) {
         
      }
   }
   

   return (
      <section className="flex flex-col bg-gradient-to-r from-themeone to-themetwo flex-grow h-full w-full">
         <section className="flex flex-col items-center w-full pt-8 lg:pt-24 gap-12">
            <h1 className="text-white font-noto-sans-bold text-big-one lg:text-large-head uppercase">Latest Winners</h1>
            <div className="flex flex-row items-center lg:gap-8 bg-white rounded-full px-2 py-2 lg:py-4 lg:px-4 extra-small:mx-2 small:mx-4">
               <div className={`text-center lg:text-left p-2 lg:py-4 lg:px-6 cursor-pointer font-medium text-sm lg:text-size-1 ${activeTab === 'game' ? 'bg-themeone text-white rounded-full' : ''}`} onClick={() => handleTabChange('game')}>Raffle Games Winner</div>
               <div className={`text-center lg:text-left p-2 lg:py-4 lg:px-6 cursor-pointer font-medium text-sm lg:text-size-1 ${activeTab === 'prize' ? 'bg-themeone text-white rounded-full' : ''}`} onClick={() => handleTabChange('prize')}>Raffle Mega Prize Winner</div>
               <div className={`text-center lg:text-left p-2 lg:py-4 lg:px-6 cursor-pointer font-medium text-sm lg:text-size-1 ${activeTab === 'app' ? 'bg-themeone text-white rounded-full' : ''}`} onClick={() => handleTabChange('app')}>App Winner</div>
            </div>
            <div className="font-noto-sans-black text-big-one lg:text-large-head text-white uppercase mb-3 lg:mb-12">
               {activeTab == 'game' && 'Raffle game winners'}
               {activeTab == 'prize' && 'Raffle mega prize winners'}
               {activeTab == 'app' && 'Raffle App winners'}
            </div>
         </section>
         <section className="flex flex-col gap-2 lg:bg-light-background lg:backdrop-blur-64 py-8 lg:pt-20 lg:pb-12 px-8 lg:px-36 gap-8 lg:gap-12">
            <div className="flex flex-col md:flex-row items-end gap-16 md:gap-0 md:items-center md:justify-between my-4">
               <div className="flex flex-row gap-8 items-center">
                  <div className="flex flex-row items-center gap-8 text-white">
                     <div className="hidden md:block font-medium">Price: </div>
                     <div>
                        <MultiRangeSlider min={0} max={500} onChange={({ min, max }) => setMinMax(min, max)} />
                     </div>
                  </div>
                  <button type="button" className="mt-1 text-center text-themeone bg-white font-semibold shadow-custom-1 rounded-full py-2 px-12" onClick={applyFilters}>Apply</button>
               </div>
               <div className="flex flex-row items-center gap-3">
                  <div className={`cursor-pointer px-4 py-3 ${activeTabTwo === 'daily' ? 'bg-white text-themeone font-medium rounded' : 'bg-transparent text-darkone'}`} onClick={() => handleTabTwoChange('daily')}>Daily</div>
                  <div className={`cursor-pointer px-4 py-3 ${activeTabTwo === 'weekly' ? 'bg-white text-themeone font-medium rounded' : 'bg-transparent text-darkone'}`} onClick={() => handleTabTwoChange('weekly')}>Weekly</div>
                  <div className={`cursor-pointer px-4 py-3 ${activeTabTwo === 'monthly' ? 'bg-white text-themeone font-medium rounded' : 'bg-transparent text-darkone'}`} onClick={() => handleTabTwoChange('monthly')}>Monthly</div>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               { 
                  activeTab === 'game' &&
                     currentGameRecords.map((winner: any, i: any) => (
                        (winner.winnersWithUsers.length > 0 && winner.winnersWithProducts.length > 0 && winner.winnersWithTickets.length) && (
                           <WinnerCard key={winner._id + '-' + winner.winnersWithUsers[0]._id} name={winner.winnersWithUsers[0].first_name + ' ' + winner.winnersWithUsers[0].last_name} prizeAmount={winner.prize_amount} ticketNumber={winner.winnersWithTickets[0].ticket_number} date={winner.winning_date} href="" prizeName="" type="game_winner" winnerImage={winner.winnersWithProducts[0].image} />
                        )
                     ))
               }

               {
                  activeTab === 'prize' &&
                     currentProductRecords.map((winner: any, i: any) => (
                        (winner.winnersWithUsers.length > 0 && winner.winnersWithProducts.length > 0 && winner.winnersWithPrizes.length) && (
                           <WinnerCard key={winner._id} name={winner.winnersWithUsers[0].first_name + ' ' + winner.winnersWithUsers[0].last_name} prizeAmount={winner.prize_amount} ticketNumber="" date={winner.winning_date} href="" prizeName={winner.winnersWithPrizes[0].name} type="product_winner" winnerImage={winner.winnersWithProducts[0].image} />
                        )
                     ))
               }


               {/*<WinnerCard name="Mr. abcd" prizeAmount="$2000" ticketNumber="DC-00154-019963331" date="4:45 PM 19 July, 2024" href="" prizeName="Prize 1" type="game_winner" winnerImage="/uploads/users/winner-img.svg" />
               <WinnerCard name="Mr. abcd" prizeAmount="$2000" ticketNumber="DC-00154-019963331" date="4:45 PM 19 July, 2024" href="" prizeName="Prize 1" type="game_winner" winnerImage="/uploads/users/winner-img.svg" />
               <WinnerCard name="Mr. abcd" prizeAmount="$2000" ticketNumber="DC-00154-019963331" date="4:45 PM 19 July, 2024" href="" prizeName="Prize 1" type="game_winner" winnerImage="/uploads/users/winner-img.svg" />
               <WinnerCard name="Mr. abcd" prizeAmount="$2000" ticketNumber="DC-00154-019963331" date="4:45 PM 19 July, 2024" href="" prizeName="Prize 1" type="game_winner" winnerImage="/uploads/users/winner-img.svg" />
               <WinnerCard name="Mr. abcd" prizeAmount="$2000" ticketNumber="DC-00154-019963331" date="4:45 PM 19 July, 2024" href="" prizeName="Prize 1" type="game_winner" winnerImage="/uploads/users/winner-img.svg" />
               <WinnerCard name="Mr. abcd" prizeAmount="$2000" ticketNumber="DC-00154-019963331" date="4:45 PM 19 July, 2024" href="" prizeName="Prize 1" type="game_winner" winnerImage="/uploads/users/winner-img.svg" />
               <WinnerCard name="Mr. abcd" prizeAmount="$2000" ticketNumber="DC-00154-019963331" date="4:45 PM 19 July, 2024" href="" prizeName="Prize 1" type="game_winner" winnerImage="/uploads/users/winner-img.svg" />*/}
            </div>
            <div className="flex flex-row items-center gap-3 mx-auto">   
               { 
                  activeTab === 'game' &&
                     gamePages.map((page, index) => (
                        <div key={index} className={`rounded-full font-medium text-head-1 ring-2 ring-white w-[35px] h-[35px] flex items-center justify-center ${page === currentGamePage ? 'text-white bg-themeone' : 'text-black bg-white'}`} onClick={() => setCurrentGamePage(page)} style={{ 'cursor' : 'pointer' }}>{page}</div>
                     ))
               }

               { 
                  activeTab === 'prize' &&
                     productPages.map((page, index) => (
                        <div key={index} className={`rounded-full font-medium text-head-1 ring-2 ring-white w-[35px] h-[35px] flex items-center justify-center ${page === currentProductPage ? 'text-white bg-themeone' : 'text-black bg-white'}`} onClick={() => setCurrentProductPage(page)} style={{ 'cursor' : 'pointer' }}>{page}</div>
                     ))
               }


               {/*<div className="rounded-full font-medium text-head-1 cursor-pointer ring-2 ring-white w-[35px] h-[35px] flex items-center justify-center text-black bg-white">2</div>
               <div className="rounded-full font-medium text-head-1 cursor-pointer ring-2 ring-white w-[35px] h-[35px] flex items-center justify-center text-black bg-white">3</div>
               <div className="rounded-full font-medium text-head-1 cursor-pointer ring-2 ring-white w-[35px] h-[35px] flex items-center justify-center text-black bg-white">4</div>
               <div className="rounded-full font-medium text-head-1 cursor-pointer ring-2 ring-white w-[35px] h-[35px] flex items-center justify-center text-black bg-white">5</div>*/}
            </div>  
         </section>
         <section className="flex flex-col items-center w-full px-8 py-8 lg:px-20 lg:py-16">
            <div className="font-noto-sans-black text-big-one lg:text-large-head text-white uppercase mb-12 text-center lg:text-left">Listen from our dreamers</div>
            <div className="flex flex-col gap-12 w-full">
               <div className="flex flex-col gap-6 lg:gap-12">
                  <div className="relative w-full">
                     <div ref={swiperMainRef} className="swiper-custom">
                        <div className="swiper-wrapper">
                        { 
                           winner_videos.map((video: any) => (
                           <div key={video._id} className="swiper-slide">
                              <VideoCard video={video} />
                           </div>
                           ))
                        }
                           {/*<div className="swiper-slide">
                              <VideoCard /> 
                           </div>
                           <div className="swiper-slide">
                              <VideoCard />
                           </div>
                           <div className="swiper-slide">
                              <VideoCard />
                           </div>
                           <div className="swiper-slide">
                              <VideoCard /> 
                           </div>
                           <div className="swiper-slide">
                              <VideoCard />
                           </div>*/}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex gap-2 mx-auto swiper-pagination"></div>
            </div>
         </section>
      </section>
   )
}
