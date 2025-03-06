'use client'

import React, { useEffect, useState } from 'react'
import GoogleMap from '@/components/GoogleMap'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

export default function AdminMachineMap({ params } : {params: { id: string; }}) {

   var [map_data, setMapData] = useState<any>(null) 

   useEffect(() => {
      getData()
   }, [])

   async function getData() {
      try {

         let response = await fetch('/api/admin/machine-management/map?machine_id=' + params.id, {
            method: 'GET',
         });
         var content = await response.json()

         if(!response.ok) {
         } else {
            if(content.merchant) {
               setMapData({
                  lat: content.merchant.initial_coords ? content.merchant.initial_coords.lat : 0,
                  lon: content.merchant.initial_coords ? content.merchant.initial_coords.long : 0,
                  name: content.merchant.name
               })
            }
         }

      } catch (error) {
         
      }
   }
   const router = useRouter()

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow gap-12">
            <div onClick={() => {router.back()}} className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
               <div className="cursor-pointer">
                  <FontAwesomeIcon size="xl" icon={faArrowLeft} />
               </div>
               <div className="cursor-pointer text-head-3 font-medium">View on Map</div>
            </div>
            <div className="px-12">
               {
                  map_data &&
                  <GoogleMap lat={map_data.lat} lon={map_data.lon} center_name={map_data.name} zoom={11} height="600px" coords={[]} />
               }
            </div>
         </div>
      </section>
   )
}
