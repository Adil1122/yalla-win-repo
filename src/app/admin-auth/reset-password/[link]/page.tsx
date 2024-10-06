'use client'

import Link from 'next/link'
import React, { useRef, useState } from 'react'

export default function AdminResetPassword({ params } : {params: { link: string; }}) {

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col">
            <Link href="/" className="mx-auto">
               <img src="/assets/images/logo.svg" alt="" />
            </Link>
            <div className="text-white text-head-8 font-medium mt-4 mx-auto">Reset admin password</div>
            <div className="flex flex-col mx-auto gap-2 mt-12">
               <div className="text-white text-size-4">New Password</div>
               <div className="border border-lighttwo w-full w-[430px] rounded">
                  <input type="text" className="w-full h-[45px] text-white ml-1 border-none bg-transparent focus:ring-0 focus:outline-none" />
               </div>
            </div>
            <div className="flex flex-col mx-auto gap-2 mt-8">
               <div className="text-white text-size-4">Confirm Password</div>
               <div className="border border-lighttwo w-full w-[430px] rounded">
                  <input type="password" className="w-full h-[45px] text-white ml-1 border-none bg-transparent focus:ring-0 focus:outline-none" />
               </div>
               <button type="button" className="bg-white rounded text-darkone px-4 py-4 mt-12">Reset Password</button>
            </div>
         </div>
      </section>
   )
}
