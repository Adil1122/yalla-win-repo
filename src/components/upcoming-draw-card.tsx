import React, { useEffect, useRef, useState } from "react"
import Swiper from "swiper"
import { Pagination } from "swiper/modules"
import "swiper/css"
import getDaysHoursMinsSecs, {formatISODate, getTimeZone} from '@/libs/common'

interface UpcomingDrawProps {
   game_draws: any;
   prize_draws: any;
}

const UpcomingDraw: React.FC<UpcomingDrawProps> = ({ game_draws, prize_draws }) => {  
   const swiperDrawRef = useRef(null)

   const [game_Draws, setGameDraws] = useState([]);
   const [game_timers, setGameTimers] = useState<any>([]);

   const [prize_Draws, setPrizeDraws] = useState([]);
   const [prize_timers, setPrizeTimers] = useState<any>([]);

   const setTimings = (gameDraws: any, prizeDraws: any) => {
      var current_date = new Date(new Date().toLocaleString("en-US", {timeZone: getTimeZone()}));

      var temp_game_timers: any = [];
      for(var i = 0; i < gameDraws.length; i++) {
         var draw_date = new Date(gameDraws[i].date_only + ' '+gameDraws[i].time_only);
         var draw_times = getDaysHoursMinsSecs(current_date, draw_date);
         temp_game_timers[gameDraws[i]._id] = draw_times;
      }
      setGameTimers(temp_game_timers);
      setGameDraws(gameDraws);

      // prize working
      var temp_prize_timers: any = [];
      for(var i = 0; i < prizeDraws.length; i++) {
         var prize_draw_date = new Date(prizeDraws[i].draw_date);
         var prize_draw_times = getDaysHoursMinsSecs(current_date, prize_draw_date);
         temp_prize_timers[prizeDraws[i]._id] = prize_draw_times;
      }
      setPrizeTimers(temp_prize_timers);
      setPrizeDraws(prizeDraws)

   }

   useEffect(() => {
      
      if (swiperDrawRef.current) {
         new Swiper(swiperDrawRef.current, {
            modules: [Pagination],
            spaceBetween: 10,
            pagination: {
               el: ".swiper-pagination-draw",
               clickable: true,
               bulletClass: 'swiper-pagination-bullet bg-pale-white',
               bulletActiveClass: 'swiper-pagination-bullet-active bg-white',
               renderBullet: (index, className) => {
                  return `<div class="${className} h-[10px] w-[10px] rounded-full cursor-pointer"></div>`
               },
            },
         })
      }

      getDraws();
      
   }, [])

   function getDraws() {
      //console.log('start: ', game_draws)
      const interval = setInterval(() => setTimings(game_draws, prize_draws), 1000)
      return () => {
         clearInterval(interval);
      }
   }

   return (
      <>
         <div className="flex flex-grow h-full flex-col lg:rounded-standard lg:border lg:border-white lg:gap-6 px-10 py-10 bg-themeone">
            <div ref={swiperDrawRef} className="swiper-custom flex w-full">
               <div className="swiper-wrapper">
                  <div className="swiper-slide">
                     <h2 className="text-white text-center uppercase font-noto-sans-bold text-head-6 lg:text-head-9 lg:mb-12">Upcoming Game Draw</h2>
                     <div className="flex flex-col gap-3 lg:gap-12 mt-6">


                     { 
                        game_Draws.map((draw: any, index: any) => (
                        <div key={draw._id} className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-4 justify-between w-full">
                           <div className="text-white text-head-1 lg:text-head-9 font-semibold ">{draw.game_name}</div>
                           <div className="flex flex-row gap-4">
                              <div className="flex flex-col gap-1 items-center">
                                 <div className="font-luckiest-guy bg-white w-[50px] h-[43px] flex items-center justify-center rounded text-themetwo text-head-9 pt-2">{game_timers[draw._id].days}</div>
                                 <div className="text-white font-bold">Day</div>
                              </div>
                              <div className="flex flex-col gap-1 items-center">
                                 <div className="bg-white w-[50px] h-[43px] flex items-center justify-center rounded text-themetwo text-head-9 font-luckiest-guy pt-2">{game_timers[draw._id].hours}</div>
                                 <div className="text-white font-bold">Hour</div>
                              </div>
                              <div className="flex flex-col gap-1 items-center">
                                 <div className="bg-white w-[50px] h-[43px] flex items-center justify-center rounded text-themetwo text-head-9 font-luckiest-guy pt-2">{game_timers[draw._id].minutes}</div>
                                 <div className="text-white font-bold">Mins</div>
                              </div>
                              <div className="flex flex-col gap-1 items-center">
                                 <div className="bg-white w-[50px] h-[43px] flex items-center justify-center rounded text-themetwo text-head-9 font-luckiest-guy pt-2">{game_timers[draw._id].seconds}</div>
                                 <div className="text-white font-bold">Sec</div>
                              </div>
                           </div>
                        </div>
                        ))
                     }
                     </div>
                  </div>
                  <div className="swiper-slide">
                     <h2 className="text-white text-center uppercase font-noto-sans-bold text-head-9 lg:mb-12">Upcoming Mega Prize</h2>
                     <div className="flex flex-col gap-3 lg:gap-7 mt-6">

                     { 
                        prize_Draws.map((draw: any) => (
                           draw.productInDraw.length > 0 && (
                           <div key={draw._id} className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-4 justify-between w-full">
                              <div className="text-white text-head-3 lg:text-head-9 font-semibold ">{draw.productInDraw[0].name}</div>
                              <div className="flex flex-row gap-4">
                                 <div className="flex flex-col gap-1 items-center">
                                    <div className="font-luckiest-guy bg-white w-[50px] h-[43px] flex items-center justify-center rounded text-themetwo text-head-9 pt-2">{prize_timers[draw._id].days}</div>
                                    <div className="text-white font-bold">Day</div>
                                 </div>
                                 <div className="flex flex-col gap-1 items-center">
                                    <div className="bg-white w-[50px] h-[43px] flex items-center justify-center rounded text-themetwo text-head-9 font-luckiest-guy pt-2">{prize_timers[draw._id].hours}</div>
                                    <div className="text-white font-bold">Hour</div>
                                 </div>
                                 <div className="flex flex-col gap-1 items-center">
                                    <div className="bg-white w-[50px] h-[43px] flex items-center justify-center rounded text-themetwo text-head-9 font-luckiest-guy pt-2">{prize_timers[draw._id].minutes}</div>
                                    <div className="text-white font-bold">Mins</div>
                                 </div>
                                 <div className="flex flex-col gap-1 items-center">
                                    <div className="bg-white w-[50px] h-[43px] flex items-center justify-center rounded text-themetwo text-head-9 font-luckiest-guy pt-2">{prize_timers[draw._id].seconds}</div>
                                    <div className="text-white font-bold">Sec</div>
                                 </div>
                              </div>
                           </div>
                        )))
                     }
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="flex gap-2 mx-auto swiper-pagination-draw"></div>
      </>
   )
}

export default UpcomingDraw;