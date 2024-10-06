'use client'

import React from 'react'
import GoogleMap from '@/components/GoogleMap'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function AdminMachineMap({ params } : {params: { id: string; }}) {

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow gap-12">
            <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
               <div className="cursor-pointer">
                  <FontAwesomeIcon size="xl" icon={faArrowLeft} />
               </div>
               <div className="cursor-pointer text-head-3 font-medium">View on Map</div>
            </div>
            <div className="px-12">
               <GoogleMap lat={40.6700} lon={-73.9400} zoom={11} height="600px" />
            </div>
         </div>
      </section>
   )
}
