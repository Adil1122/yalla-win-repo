'use client'
import React, { useEffect, useState } from 'react'
import getDaysHoursMinsSecs, {formatISODate} from '@/libs/common';

export default function UserDashboard() {

   var [yalla_3_timings, setYalla3Timings] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
   });

   var [yalla_4_timings, setYalla4Timings] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
   });

   var [yalla_6_timings, setYalla6Timings] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
   });

   var [formattedDates, setFormattedDates] = useState({
      yalla_3_formatted_date: "",
      yalla_4_formatted_date: "",
      yalla_6_formatted_date: "",
   })

   var [prize_draw_timings, setPrizeDrawTimings] = useState([]);

   const setTimings = (yalla_3_date: any, yalla_4_date: any, yalla_6_date: any, prize_draws: any) => {

      var current_date = new Date();
      var yalla_3_times = getDaysHoursMinsSecs(current_date, yalla_3_date);
      var yalla_4_times = getDaysHoursMinsSecs(current_date, yalla_4_date);
      var yalla_6_times = getDaysHoursMinsSecs(current_date, yalla_6_date);

      var temp: any = [];
      for(var i = 0; i < prize_draws.length; i++) {
         var draw_date = new Date(prize_draws[i].draw_date);
         var draw_times = getDaysHoursMinsSecs(current_date, draw_date);
         var formatted_date_obj = formatISODate(draw_date);
         temp.push({
            name: prize_draws[i].prizeInDraw.length > 0 ? prize_draws[i].prizeInDraw[0].name : 'No Prize',
            formatted_date: formatted_date_obj.fomattedDate,
            timings: draw_times
         })
      }

      var yalla_3_formatted_obj = formatISODate(yalla_3_date); 
      var yalla_4_formatted_obj = formatISODate(yalla_4_date);
      var yalla_6_formatted_obj = formatISODate(yalla_6_date);

      // setting all the timings
      setYalla3Timings(yalla_3_times);
      setYalla4Timings(yalla_4_times);
      setYalla6Timings(yalla_6_times);
      setFormattedDates({
         yalla_3_formatted_date: yalla_3_formatted_obj.fomattedDate, 
         yalla_4_formatted_date: yalla_4_formatted_obj.fomattedDate, 
         yalla_6_formatted_date: yalla_6_formatted_obj.fomattedDate, 
      })
      setPrizeDrawTimings(temp);
   }

   var [wallet, setWallet] = useState({
      amount: 0,
      last_updated: ''
   });

   useEffect(() => {
      getDrawDetails()
   }, []);

   const getDrawDetails = async() => {
      try {
         var user = localStorage.getItem('yalla_logged_in_user') !== null ? JSON.parse(localStorage.getItem('yalla_logged_in_user') + '') : null;
         var user_id = user ? user._id : '';
         let response = await fetch("/api/user/dashboard?user_id=" + user_id, {
            method: "GET",
         });
         const content = await response.json();
         console.log(content)
         if(!response.ok) {
         } else {
            console.log(content.wallet)

            if(content.wallet !== null) {

               var updatedAt = formatISODate(new Date(content.wallet.updatedAt));
               setWallet({
                  amount: content.wallet.amount,
                  last_updated: updatedAt.fomattedDate
               })
            }
            
            if(content.yalla_3_draw.length > 0 || content.yalla_4_draw.length > 0 || content.yalla_6_draw.length > 0 || content.prize_draws.length > 0) {

               var yalla_3_date = content.yalla_3_draw.length > 0 ? new Date(content.yalla_3_draw[0].draw_date) : new Date();
               var yalla_4_date = content.yalla_4_draw.length > 0 ? new Date(content.yalla_4_draw[0].draw_date) : new Date();
               var yalla_6_date = content.yalla_6_draw.length > 0 ? new Date(content.yalla_6_draw[0].draw_date) : new Date();

               setTimings(yalla_3_date, yalla_4_date, yalla_6_date, content.prize_draws.length > 0 ? content.prize_draws : [])
               const interval = setInterval(() => setTimings(yalla_3_date, yalla_4_date, yalla_6_date, content.prize_draws.length > 0 ? content.prize_draws : []), 1000)
               return () => {
                  clearInterval(interval);
               }

            } 
         }

      } catch (error) {
         
      }
   }
   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20">
         <div className="flex flex-col gap-10 lg:gap-16 w-full h-full">
            <div className="bg-white rounded-lg flex flex-col items-center justify-center py-12 px-6">
               <div className="flex items-center gap-2">
                  <div className="text-darkone text-head-3 lg:text-head-5 whitespace-nowrap">Current Balance:</div>
                  <div className="font-semibold text-darkone text-head-3 lg:text-head-8 text-themeone whitespace-nowrap">AED {parseFloat(wallet.amount + '').toFixed(2)}</div>
               </div>
               <div className="flex items-center font-light text-darkone extra-small:text-size-2 extra-small:whitespace-nowrap text-size-3 gap-2">
                  <div>Last Update:</div>
                  <div>{wallet.last_updated}</div>
               </div>
            </div>
            <div className="flex flex-col gap-3 lg:gap-6">
               <h2 className="text-white font-bold text-head-4 lg:text-head-6">Free Raffle Games</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  <div className="flex flex-col gap-1 bg-white rounded-lg items-center justify-center py-6 text-darkone">
                     <div className="text-head-3 uppercase mt-8">Yalla 3</div>
                     <div className="opacity-70">{formattedDates.yalla_3_formatted_date}</div>
                     <div className="flex flex-row gap-2 mt-5">
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_3_timings.days}</div>
                           <div className="text-xs opacity-70">Days</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_3_timings.hours}</div>
                           <div className="text-xs opacity-70">Hours</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_3_timings.minutes}</div>
                           <div className="text-xs opacity-70">Mins</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_3_timings.seconds}</div>
                           <div className="text-xs opacity-70">Secs</div>
                        </div>
                     </div>
                     <button type="button" className="text-white font-medium py-2 mt-6 px-8 bg-gradient-to-r from-themeone to-themetwo rounded-full">View Game</button>
                  </div>
                  <div className="flex flex-col gap-1 bg-white rounded-lg items-center justify-center py-6 text-darkone">
                     <div className="text-head-3 uppercase mt-8">Yalla 4</div>
                     <div className="opacity-70">{formattedDates.yalla_4_formatted_date}</div>
                     <div className="flex flex-row gap-2 mt-5">
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_4_timings.days}</div>
                           <div className="text-xs opacity-70">Days</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_4_timings.hours}</div>
                           <div className="text-xs opacity-70">Hours</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_4_timings.minutes}</div>
                           <div className="text-xs opacity-70">Mins</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_4_timings.seconds}</div>
                           <div className="text-xs opacity-70">Secs</div>
                        </div>
                     </div>
                     <button type="button" className="text-white font-medium py-2 mt-6 px-8 bg-gradient-to-r from-themeone to-themetwo rounded-full">View Game</button>
                  </div>
                  <div className="flex flex-col gap-1 bg-white rounded-lg items-center justify-center py-6 text-darkone">
                     <div className="text-head-3 uppercase mt-8">Yalla 6</div>
                     <div className="opacity-70">{formattedDates.yalla_6_formatted_date}</div>
                     <div className="flex flex-row gap-2 mt-5">
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_6_timings.days}</div>
                           <div className="text-xs opacity-70">Days</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_6_timings.hours}</div>
                           <div className="text-xs opacity-70">Hours</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_6_timings.minutes}</div>
                           <div className="text-xs opacity-70">Mins</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                           <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{yalla_6_timings.seconds}</div>
                           <div className="text-xs opacity-70">Secs</div>
                        </div>
                     </div>
                     <button type="button" className="text-white font-medium py-2 mt-6 px-8 bg-gradient-to-r from-themeone to-themetwo rounded-full">View Game</button>
                  </div>
                  
               </div>
            </div>


            <div className="flex flex-col gap-3 lg:gap-6">
               <h2 className="text-white font-bold text-head-4 lg:text-head-6">Free Raffle Mega Prizes</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {
                     prize_draw_timings.map((prize_draw_timing: any) => (
                     <div key={prize_draw_timing._id} className="flex flex-col gap-1 bg-white rounded-lg items-center justify-center py-6 text-darkone">
                        <div className="text-head-3 capitalize mt-8">Raffle Draw</div>
                        <div className="text-head-3 text-themeone">Win {prize_draw_timing.name}</div>
                        <div className="opacity-70">{prize_draw_timing.formatted_date}</div>
                        <div className="flex flex-row gap-2 mt-5">
                           <div className="flex flex-col gap-2 items-center justify-center">
                              <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{prize_draw_timing.timings.days}</div>
                              <div className="text-xs opacity-70">Days</div>
                           </div>
                           <div className="flex flex-col gap-2 items-center justify-center">
                              <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{prize_draw_timing.timings.hours}</div>
                              <div className="text-xs opacity-70">Hours</div>
                           </div>
                           <div className="flex flex-col gap-2 items-center justify-center">
                              <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{prize_draw_timing.timings.minutes}</div>
                              <div className="text-xs opacity-70">Mins</div>
                           </div>
                           <div className="flex flex-col gap-2 items-center justify-center">
                              <div className="border border-themeone extra-small:px-4 py-2 px-6 rounded-lg items-center justify-center flex text-head-2">{prize_draw_timing.timings.seconds}</div>
                              <div className="text-xs opacity-70">Secs</div>
                           </div>
                        </div>
                        <button type="button" className="text-white font-medium py-2 mt-6 px-8 bg-gradient-to-r from-themeone to-themetwo rounded-full">Buy Product</button>
                     </div>
                  ))}

               </div>
            </div>
         </div>
      </section>
   )
}
