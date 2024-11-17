'use client'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { formatISODate } from '@/libs/common'
import { faChevronLeft, faChevronRight, faCommentAlt, faDeleteLeft, faEye, faImage, faPaperPlane, faPencil, faPlus, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default function UserAccountWinningWithdrawGames() {
   const [winners, setWinners] = useState([]);
   useEffect(() => {
      //getWinners();
      getWinnerCount()
   }, []);

   var skip = 0
   var [winner_count, setWinnerCount] = useState(0);

   const getWinnerCount = async() => {
      try {
         var user = localStorage.getItem('yalla_logged_in_user') !== null ? JSON.parse(localStorage.getItem('yalla_logged_in_user') + '') : '';
         let response = await fetch("/api/user/account/winning-withdraw/raffle-games?user_id=" + user._id, {
            method: "OPTIONS",
         });
         const content = await response.json();
         //console.log(content)

         if(!response.ok) {

         } else {
            setWinnerCount(content.winner_count)
            console.log('content.winner_count: ', content.winner_count)
            getWinners()
         }
      } catch (error) {
         
      }
   }

   const getWinners = async() => {
      try {
         var user = localStorage.getItem('yalla_logged_in_user') !== null ? JSON.parse(localStorage.getItem('yalla_logged_in_user') + '') : '';
         let response = await fetch("/api/user/account/winning-withdraw/raffle-games?user_id=" + user._id + "&skip=" + skip + "&limit=" + recordsPerPage, {
         //let response = await fetch("/api/user/account/winning-withdraw/raffle-games?user_id=66c2fe4b6d0491b639435fa0" , {   
            method: "GET",
         });
         const content = await response.json();
         if(!response.ok) {

         } else {
            var temp = content.winners;
            
            for(var i = 0; i < temp.length; i++) { 
               if(temp[i].drawInWinner.length > 0) { 
                  var date: any = temp[i].drawInWinner.length > 0 ? formatISODate(new Date(temp[i].drawInWinner[0].draw_date)) : 'None';
                  temp[i].drawInWinner[0].draw_date = temp[i].drawInWinner.length > 0 ? date.fomattedDate : 'None';
               }
               var s_no = (i + 1) < 10 ? '0' + (i + 1) : i + 1;
               temp[i]['s_no'] = s_no;
            }
            console.log('temp: ', temp)
            setWinners(temp);
         }
      } catch (error) {
         
      }
   }

   var totalPages = 0;
   var [currentPage, setCurrentPage] = useState(1);
   var [recordsPerPage, setRecordsPerPages] = useState(5);
   totalPages = winner_count;
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
      getWinners()
      setCurrentPage(current_page);
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow py-20 flex flex-col">
         <button type="button" className="flex flex-row items-center gap-3 text-white px-6 lg:px-12 w-fit">
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
            <div className="font-bold text-head-2 lg:text-head-4">Winning/Withdraw</div>
         </button>
         <div className="w-screen w-full lg:w-auto overflow-x-auto px-6 lg:px-12 mt-8 lg:mt-12">
            <table className="w-full">
               <thead>
                  <tr className="bg-white">
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-left text-darkone rounded-tl rounded-bl">Order #</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Draw #</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game Title</th> 
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Draw Date</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Name</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winning Amount</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-lightthree">
               { 
                  winners.map((winner: any) => (
                     //(winner.drawInWinner.length > 0 && winner.productInWinner.length > 0) && ( 
                     <tr key={winner._id}>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">{winner.s_no}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm text-white lg:text-size-1">{winner.s_no}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.game_name ? winner.game_name : 'None'}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.drawInWinner.length > 0 ? winner.drawInWinner[0].draw_date : 'None'}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.productInWinner.length > 0 ? winner.productInWinner[0].name : 'None'}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED {winner.prize_amount}</td>
                        <td className="relative py-5 px-8 flex gap-2">
                           <Link href={"raffle-games/withdraw/" + winner._id} className="text-themeone font-medium px-4 py-1 lg:py-3 cursor-pointer lg:px-8 text-sm lg:text-size-1 bg-white rounded mx-auto w-fit">Withdraw</Link>
                           <Link href={"raffle-games/details/" + winner._id} className="text-themeone font-medium px-4 py-1 lg:py-3 cursor-pointer lg:px-8 text-sm lg:text-size-1 bg-white rounded mx-auto w-fit" style={{display: 'none'}}>Details</Link>
                        </td>
                     </tr>
                  //)
               ))
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
