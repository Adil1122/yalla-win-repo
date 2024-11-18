'use client'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import getDaysHoursMinsSecs, {formatISODate} from '@/libs/common'
import { faChevronLeft, faChevronRight, faCommentAlt, faDeleteLeft, faEye, faImage, faPaperPlane, faPencil, faPlus, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default function UpcomingRaflleGames() {
   const [draws, setDraws] = useState([]);
   const [timers, setTimers] = useState<any>([]);
   var [time_interval, setTimeInterval] = useState(0)

   useEffect(() => { 
      //getDraws();
      getDrawCount()
   }, []);

   const setTimings = (draws: any) => {
      var temp = draws;
      var temp_timers: any = [];
      var current_date = new Date();
      for(var i = 0; i < draws.length; i++) {
         var draw_date = new Date(draws[i].draw_date);
         var draw_times = getDaysHoursMinsSecs(current_date, draw_date);
         var formatted_date_obj = formatISODate(draw_date);
         temp[i].draw_date = formatted_date_obj.fomattedDate;
         temp_timers[draws[i]._id] = draw_times;
      }
      setDraws(temp);
      setTimers(temp_timers);
   }

   var skip = 0
   var [draw_count, setDrawCount] = useState(0);

   const getDrawCount = async() => {
      try {
         let response = await fetch("/api/user/upcoming-game-draws", {
            method: "OPTIONS",
         });
         const content = await response.json();
         //console.log(content)

         if(!response.ok) {

         } else {
            setDrawCount(content.draw_count)
            getDraws()
         }
      } catch (error) {
         
      }
   }

   const getDraws = async() => {
      try {
         let response = await fetch("/api/user/upcoming-game-draws?skip=" + skip + "&limit=" + recordsPerPage + "&platform_type=web", {
            method: "GET",
         });
         const content = await response.json();
         console.log(content)

         var temp = content.draws;
         for(var i = 0; i < temp.length; i++) {
            var s_no = (i + 1) < 10 ? '0' + (i + 1) : i + 1;
            temp[i]['s_no'] = s_no;
         }

         if(!response.ok) {

         } else {
            if(time_interval !== 0) {
               clearInterval(time_interval)
            }
            const interval: any = setInterval(() => setTimings(temp), 1000)
            setTimeInterval(interval)
            return () => {
               clearInterval(interval);
            }
            
         }
      } catch (error) {
         
      }
   }

   var totalPages = 0;
   var [currentPage, setCurrentPage] = useState(1);
   var [recordsPerPage, setRecordsPerPages] = useState(5);
   totalPages = draw_count;
   var pages = [];
   var show_pages: any = [];
   for(var i = 1; i <= Math.ceil(totalPages / recordsPerPage); i++) {
      pages.push(i);
      if(i === currentPage || i === (currentPage + 1) || i === (currentPage - 1) || i === (currentPage + 2) || i === (currentPage - 2)) {
         show_pages.push(i);
      }
   }
   console.log('pages: ', pages)

   function setPagination(current_page: any) {
      if(current_page < 1) {
         current_page = 1;
      }

      if(current_page > pages.length) {
         current_page = pages.length
      }
      skip = recordsPerPage * (current_page - 1);
      getDraws()
      setCurrentPage(current_page);
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow py-20 flex flex-col">
         <button type="button" className="flex flex-row items-center gap-3 text-white px-6 lg:px-12 w-fit">
            {/*<FontAwesomeIcon size="xl" icon={faArrowLeft} />*/}
            <div className="font-bold text-head-2 lg:text-head-4">Raffle Game</div>
         </button>
         <div className="w-screen w-full lg:w-auto overflow-x-auto px-6 lg:px-12 mt-8 lg:mt-12">
            <table className="w-full">
               <thead>
                  <tr className="bg-white">
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-left text-darkone rounded-tl rounded-bl">Draw #</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game Title</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Name</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Image</th> 
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Draw Date</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Timer</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-lightthree">
               { 
                  draws.map((draw: any) => (
                     draw.productInDraw.length > 0 && (
                     <tr key={draw._id}>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">{draw.s_no}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{draw.game_name}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{draw.productInDraw[0].name}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1">
                           <img className="w-[70px] mx-auto" src={draw.productInDraw[0].image} alt="" />
                        </td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{draw.draw_date}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                           <div className="flex flex-row gap-4 mx-auto w-fit py-4 lg:py-0">
                              <div className="flex flex-col gap-1 items-center">
                                 <div className="font-luckiest-guy bg-white w-[40px] h-[33px] flex items-center justify-center rounded text-themetwo text-head-4 pt-2">{timers[draw._id].days}</div>
                                 <div className="text-white">Day</div>
                              </div>
                              <div className="flex flex-col gap-1 items-center">
                                 <div className="font-luckiest-guy bg-white w-[40px] h-[33px] flex items-center justify-center rounded text-themetwo text-head-4 pt-2">{timers[draw._id].hours}</div>  
                                 <div className="text-white">Hour</div>
                              </div>
                              <div className="flex flex-col gap-1 items-center">
                                 <div className="font-luckiest-guy bg-white w-[40px] h-[33px] flex items-center justify-center rounded text-themetwo text-head-4 pt-2">{timers[draw._id].minutes}</div>
                                 <div className="text-white">Mins</div>
                              </div>
                              <div className="flex flex-col gap-1 items-center">
                                 <div className="font-luckiest-guy bg-white w-[40px] h-[33px] flex items-center justify-center rounded text-themetwo text-head-4 pt-2">{timers[draw._id].seconds}</div>
                                 <div className="text-white">Sec</div>
                              </div>
                           </div>
                        </td>
                        <td className="relative py-5 px-8">
                           <div className="text-themeone font-medium px-4 py-1 lg:py-3 cursor-pointer lg:px-8 text-sm lg:text-size-1 bg-white rounded mx-auto w-fit">Details</div>
                        </td>
                     </tr>
                     )))
                  }
               </tbody>
            </table>
         </div>

         <div className="font-poppins-medium mt-12 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">

            {
               pages.length > 0 &&
               <div className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(currentPage - 1)}>
                  <FontAwesomeIcon size="1x" icon={faChevronLeft} />
               </div>
            }

            {
               pages.map((page: any) => (
                  show_pages.includes(page) && (
                     page === currentPage ?
                     <div key={page} className="px-4 py-2 text-black bg-white flex items-center justify-center cursor-pointer" onClick={() => setPagination(page)}>{page}</div>
                     :
                     <div key={page} className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(page)}>{page}</div>
                  ) 
            ))}

            {
               pages.length > 0 &&
               <div className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(currentPage + 1)}>
                  <FontAwesomeIcon size="1x" icon={faChevronRight} />
               </div>
            }

         </div>

      </section>
   )
}
