'use client'

import Modal from '@/components/modal'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { XCircleIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { formatISODate } from '@/libs/common'

export default function UserAccountWinningWithdrawPrizes() {

   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

   const openModal = () => setModalIsOpen(true)
   const closeModal = () => setModalIsOpen(false)
   const handlePickup = () => {
      setModalIsOpen(true)
   }

   const [winners, setWinners] = useState([]);
   useEffect(() => {
      getWinners();
   }, []);

   const getWinners = async() => {
      try {
         var user = localStorage.getItem('yalla_logged_in_user') !== null ? JSON.parse(localStorage.getItem('yalla_logged_in_user') + '') : '';
         let response = await fetch("/api/user/account/winning-withdraw/raffle-prizes?user_id=" + user._id , {
         //let response = await fetch("/api/user/account/winning-withdraw/raffle-games?user_id=66c2fe4b6d0491b639435fa0" , {   
            method: "GET",
         });
         const content = await response.json();
         if(!response.ok) {

         } else {
            var temp = content.winners;
            
            for(var i = 0; i < temp.length; i++) { 
               if(temp[i].drawInWinner.length > 0) { 
                  var date = formatISODate(new Date(temp[i].drawInWinner[0].draw_date));
                  temp[i].drawInWinner[0].draw_date = date.fomattedDate;
                  var s_no = (i + 1) < 10 ? '0' + (i + 1) : i + 1;
                  temp[i]['s_no'] = s_no;
               }
            }
            setWinners(temp);
         }
      } catch (error) {
         
      }
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
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Name</th> 
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Draw Date</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winning Product</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Image</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-lightthree">
               { 
                  winners.map((winner: any) => (
                     (winner.drawInWinner.length > 0 && winner.productInWinner.length > 0 && winner.prizeInWinner.length > 0) && ( 
                     <tr key={winner._id}>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">{winner.s_no}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm text-white lg:text-size-1">{winner.s_no}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.productInWinner[0].name}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.drawInWinner[0].draw_date}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{winner.prizeInWinner[0].name}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                           <img className="w-[70px] mx-auto" src={winner.prizeInWinner[0].image} alt="" />
                        </td>
                        <td className="relative py-5 px-8 flex gap-2">
                           <button onClick={handlePickup} className="text-themetwo font-medium px-4 py-1 lg:py-3 cursor-pointer lg:px-8 text-sm lg:text-size-1 bg-white rounded mx-auto w-fit">Pickup</button>
                           <Link href={"raffle-prizes/deliver/" + winner._id} className="text-themetwo font-medium px-4 py-1 lg:py-3 cursor-pointer lg:px-8 text-sm lg:text-size-1 bg-white rounded mx-auto w-fit">Deliver</Link>
                           <Link href={"raffle-prizes/redeem/" + winner._id} className="text-themetwo font-medium px-4 py-1 lg:py-3 cursor-pointer lg:px-8 text-sm lg:text-size-1 bg-white rounded mx-auto w-fit">Redeem</Link>
                        </td>
                     </tr>
                  )))
               }

               </tbody>
            </table>
         </div>
         <Modal open={modalIsOpen} onClose={closeModal}>
            <div className="flex flex-col items-center justify-center gap-3 px-12 py-6">
               <div onClick={closeModal} className="ml-auto cursor-pointer">
                  <XCircleIcon className="size-8 text-gray-700" />
               </div>
               <div className="text-themeone text-big-two text-shadow-custom font-bold">Visit Our Store</div>
               <div className="text-center text-size-4">
                  <div>Ready to pick up your prize?</div>
                  <div>Head over to our store to collect your prize in person</div>
               </div>
               <div className="text-center text-size-4 flex flex-col items-center gap-1">
                  <div className="flex gap-1">
                     <div className="font-semibold">Hours: </div>
                     <div className="text-darkone">[Time]</div>
                  </div>
                  <div className="flex gap-1">
                     <div className="font-semibold">Location: </div>
                     <div className="text-darkone">[Store Address]</div>
                  </div>
               </div>
            </div>
         </Modal>
      </section>
   )
}
