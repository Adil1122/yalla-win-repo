'use client'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { formatISODate } from '@/libs/common'

export default function UserfavDrawNumbers() { 
   const [favourites, setFavourites] = useState([]);

   useEffect(() => {
      getFavourites();
   }, []);

   const getFavourites = async() => {
      try {
         let response = await fetch("/api/user/favourite-draw-numbers", {
            method: "GET",
         });
         const content = await response.json();
         console.log(content)

         if(!response.ok) {

         } else {
            var temp = content.favourites;
            for(var i = 0; i < temp.length; i++) {
               var date = formatISODate(new Date(temp[i].createdAt));
               temp[i].createdAt = date.fomattedDate;
               var s_no = (i + 1) < 10 ? '0' + (i + 1) : i + 1;
               temp[i]['s_no'] = s_no;
            }
            setFavourites(temp);
         }
      } catch (error) {
         
      }
   }

   const capitalizeFirstLetter = (string: any) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
   }
   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow py-20 flex flex-col">
         <button type="button" className="flex flex-row items-center gap-3 text-white px-6 lg:px-12 w-fit">
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
            <div className="font-bold text-head-2 lg:text-head-4">Favourite Draw Numbers</div>
         </button>
         <div className="flex flex-col flex-grow w-screen w-full lg:w-auto overflow-x-auto px-6 lg:px-12 mt-8 lg:mt-12">
            <table className="w-full">
               <thead>
                  <tr className="bg-white">
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-left text-darkone rounded-tl rounded-bl">Draw #</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Darw Type</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Number</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Addition Time</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-lightthree">
               { 
                  favourites.map((favourite: any) => (
                     (favourite.userInFavourite.length > 0 && favourite.drawInFavourite.length > 0) && (
                     <tr key={favourite._id}>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">{favourite.s_no}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{capitalizeFirstLetter(favourite.drawInFavourite[0].draw_type)}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{favourite.number}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{favourite.createdAt}</td>
                     </tr>
                  )))
               }
               </tbody>
            </table>
            <div className="text-white text-center text-size-4 m-auto lg:max-w-[600px]">
               Your winning number has a streak! Its now automatically added to your favourite draw numbers for future games
            </div>
         </div>
      </section>
   )
}