'use client'

import Image from "next/image"
import signUpImg from '@/../public/assets/images/signup.svg'
import checkIcon from '@/../public/assets/images/check.svg'
import { ChatBubbleLeftEllipsisIcon, XCircleIcon } from '@heroicons/react/24/solid'
import Link from "next/link"
import Notification from "@/components/notificationWidget";
import { useGeolocated } from "react-geolocated";

export default function SignUpPage() {
   const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

        //console.log(getMAC())

   return (
      <div className="flex flex-row flex-grow h-full w-full bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo px-12 py-20 gap-6 font-inter-regular">






{
   coords ?
   <div>{coords.longitude} / {coords.latitude}</div>
   :
   <div>No coords</div>
}









         <div className="relative flex flex-col w-[55%] gap-6">
            <div className="flex flex-row gap-6">
               <div className="flex flex-col bg-white rounded-lg p-3 pb-5 flex-1 shadow-custom-1">
                  <label htmlFor="first-name" className="text-theme-topo-1 text-size-4">First Name</label>
                  <input id="first-name" className="w-full border-none bg-transparent text-size-4 text-theme-topo-1 font-semibold outline-none focus:outline-none" type="text" placeholder="" />
               </div>
               <div className="flex flex-col bg-white rounded-lg p-3 pb-5 flex-1 shadow-custom-1">
                  <label htmlFor="last-name" className="text-theme-topo-1 text-size-4">Last Name</label>
                  <input id="last-name" className="w-full border-none bg-transparent text-size-4 text-size-2 text-theme-topo-1 font-semibold outline-none focus:outline-none" type="text" placeholder="" />
               </div>
            </div>
            <div className="flex flex-row gap-6">
               <div className="flex flex-col bg-white rounded-lg p-3 pb-5 flex-1 shadow-custom-1">
                  <label htmlFor="email-address" className="text-theme-topo-1 text-size43">Email</label>
                  <input id="email-address" className="w-full border-none bg-transparent text-size-4 text-theme-topo-1 font-semibold outline-none focus:outline-none" type="text" placeholder="" />
               </div>
            </div>
            <div className="flex flex-row gap-6">
               <div className="flex flex-col bg-white rounded-lg p-3 pb-5 flex-1 shadow-custom-1">
                  <label htmlFor="create-password" className="text-theme-topo-1 text-size-4">Create Password</label>
                  <input id="create-password" className="w-full border-none bg-transparent text-size-4 text-theme-topo-1 font-semibold outline-none focus:outline-none" type="text" placeholder="" />
               </div>
               <div className="flex flex-col bg-white rounded-lg p-3 pb-5 flex-1 shadow-custom-1">
                  <label htmlFor="confirm-password" className="text-theme-topo-1 text-size-4">Confirm Password</label>
                  <input id="confirm-password" className="w-full border-none bg-transparent text-size-4 text-size-2 text-theme-topo-1 font-semibold outline-none focus:outline-none" type="text" placeholder="" />
               </div>
            </div>
            <div className="flex flex-row gap-6">
               <div className="flex flex-col bg-white rounded-lg p-3 pb-5 flex-1 shadow-custom-1">
                  <label htmlFor="couontry-code" className="text-theme-topo-1 text-size-4">Country Code</label>
                  <select id="country-code" className="w-full border-none bg-transparent text-size-3 outline-none focus:outline-none cursor-pointer">
                     <option value="971">971</option>
                     <option value="966">966</option>
                     <option value="973">973</option>
                  </select>
               </div>
               <div className="flex flex-col bg-white rounded-lg p-3 pb-5 flex-2 shadow-custom-1">
                  <label htmlFor="confirm-password" className="text-theme-topo-1 text-size-4">Mobile Number</label>
                  <input id="confirm-password" className="w-full border-none bg-transparent text-size-4 text-size-2 text-theme-topo-1 font-semibold outline-none focus:outline-none" type="text" placeholder="" />
               </div>
            </div>
            <div className="flex flex-col mt-auto">
               <div className="flex flex-row gap-6 justify-between items-end">
                  <div className="flex flex-col flex-1 text-white font-semibold text-head-4">
                     <div className="flex flex-col">Select OTP </div>
                     <div>Verification method</div>
                  </div>
                  <div className="flex flex-row flex-1 justify-between">
                     <div className="flex flex-col bg-white rounded-lg px-10 py-4 w-36 items-center cursor-pointer">
                        <ChatBubbleLeftEllipsisIcon className="size-10 text-black" />
                        <div>SMS</div>
                     </div>
                     <div className="flex flex-col bg-white rounded-lg px-10 py-4 w-36 items-center cursor-pointer">
                        <ChatBubbleLeftEllipsisIcon className="size-10 text-black" />
                        <div>Email</div>
                     </div>
                     <div className="flex flex-col bg-white rounded-lg px-10 py-4 w-36 items-center cursor-pointer">
                        <ChatBubbleLeftEllipsisIcon className="size-10 text-black" />
                        <div>WhatsApp</div>
                     </div>
                  </div>
               </div>
               <div className="flex flex-row gap-6 mt-12 items-center">
                  <div className="bg-white rounded w-8 h-8 cursor-pointer">
                     <Image alt="" width={35} src={checkIcon} />
                  </div>
                  <div className="flex flex-row text-white text-size-4">
                     <div>I agree to the&nbsp;</div>
                     <Link href="/" className="font-semibold">User agreement</Link>
                     <div>&nbsp;and&nbsp;</div>
                     <Link href="/" className="font-semibold">Privacy Policy</Link>
                  </div>
               </div>   
               <div className="text-center cursor-pointer text-themeone text-size-3 rounded-full shadow-custom-1 py-4 bg-white mt-12 font-semibold">Sign Up</div>
            </div>
         </div>
         <div className="w-[45%]">
            <Image width={700} className="ml-auto" alt="user signup" src={signUpImg}></Image>
         </div>
         <Notification message="Server Error" description="This email already exists" type='error' close={() => {}} />
      </div>
   )
}