'use client'

import React, { useState } from 'react'
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default function UserAccountDeliver({ params } : {params: { id: string; }}) {

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow gap-6 lg:gap-12 lg:px-12 py-12 lg:py-20 flex flex-col">
         <button type="button" className="flex flex-row items-center gap-3 text-white w-fit px-6">
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
            <div className="font-bold text-head-2 lg:text-head-4">Winning/Withdraw</div>
         </button>

         <div className="flex flex-col gap-8 px-6 lg:w-[60%]">
            <div className="flex flex-col text-white gap-2">
               <h2 className="font-bold text-head-2 lg:text-head-4">Enter Shipping Details</h2>
               <div className="">To proceed please note that delivery chanrges will apply base don your location and delivery method</div>
            </div>
            <div className="flex flex-col gap-4 text-white w-full">
               <div className="font-bold text-head-1 lg:text-head-2">Name</div>
               <div className="w-full">
                  <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="" />
               </div>
            </div>
            <div className="flex flex-col gap-4 text-white w-full">
               <div className="font-bold text-head-1 lg:text-head-2">Phone Number</div>
               <div className="w-full">
                  <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="" />
               </div>
            </div>
            <div className="flex flex-col gap-4 text-white w-full">
               <div className="font-bold text-head-1 lg:text-head-2">Email Address</div>
               <div className="w-full">
                  <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="" />
               </div>
            </div>
            <div className="flex flex-col gap-4 text-white w-full">
               <div className="font-bold text-head-1 lg:text-head-2">Shipping Address</div>
               <div className="w-full">
                  <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="" />
               </div>
            </div>
            <div className="flex flex-col gap-4 text-white w-full">
               <div className="font-bold text-head-1 lg:text-head-2">Shipment Charges</div>
               <div className="w-full">
                  <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="" />
               </div>
            </div>
            <button className="bg-white rounded-lg lg:ml-auto text-size-2 lg:text-size-4 text-themetwo font-medium py-3 lg:py-4 px-16 lg:w-fit mt-6">Withdraw Now</button>
         </div>
      </section>
   )
}
