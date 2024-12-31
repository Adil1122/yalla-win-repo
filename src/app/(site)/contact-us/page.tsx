'use client'

import React from 'react'
//import {APIProvider, Map} from '@vis.gl/react-google-maps'
import Link from 'next/link'
import GoogleMap from '@/components/GoogleMap'

export default function ContactPage() {
   
   return (
      <section className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo">
         <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo px-8 lg:px-12 py-12 lg:py-36 font-inter-regular">
            <div className="flex flex-col lg:flex-row gap-12">
               <div className="relative flex flex-col w-full lg:w-[55%] lg:gap-6 gap-3 lg:text-size-4 text-size-2">
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="first-name" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">First Name</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                           <input id="first_name" name="first_name" className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0" type="text" placeholder="First Name" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="last_name" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">Last Name</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                           <input id="first_name" name="first_name" className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0" type="text" placeholder="First Name" />
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="first-name" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">Email</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                           <input id="first_name" name="first_name" className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0" type="text" placeholder="First Name" />
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="first-name" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">Topic</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                           <select id="country_code" name="country_code" className="w-full focus:ring-0 border-none bg-transparent text-size-3 outline-none focus:outline-none cursor-pointer">
                              <option value="971">General Inquiry</option>
                           </select>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="lg:w-[45%] lg:h-auto flex rounded-standard flex-col gap-8 w-0 h-0">
                  {/*<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}>
                     <Map
                        style={{width: '100%', height: '350px', borderRadius: '10px'}}
                        defaultCenter={{lat: 48.8575, lng: 2.3514}}
                        defaultZoom={3}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                     />
                  </APIProvider>*/}
                  <GoogleMap lat={25.276987} lon={55.296249} center_name='Yalla Win' zoom={11} height="400px" coords={[]} />
               </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:gap-12 mt-2">
               <div className="flex flex-col gap-4 lg:w-[55%] lg:gap-8 gap-3 lg:text-size-4 text-size-2">
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="first-name" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">Message</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 lg:py-6 py-4 shadow-custom-1 relative flex">
                           <textarea className="w-full h-[250px] focus:ring-0 focus:outline-none border-none bg-transparent resize-none"></textarea>
                        </div>
                     </div>
                  </div>
                  <button className="text-center text-themeone font-medium py-3 bg-white rounded-standard">Submit</button>
               </div>
               <div className="flex lg:hidden rounded-standard flex-col gap-8 mt-10">
                  {/*<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}>
                     <Map
                        style={{width: '100%', height: '350px', borderRadius: '10px'}}
                        defaultCenter={{lat: 48.8575, lng: 2.3514}}
                        defaultZoom={3}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                     />
                  </APIProvider>*/}
                  <GoogleMap lat={25.276987} lon={55.296249} center_name='Yalla Win' zoom={11} height="400px" coords={[]} />
                  
               </div>
               <div className="flex flex-col gap-4 w-full w-full lg:w-[45%] lg:text-size-4 text-size-2">
                  <div className="flex flex-col gap-3">
                     <label htmlFor="first-name" className="text-theme-topo-1 flex items-end gap-2 ml-2 opacity-0">
                        <span className="font-medium text-white">Message</span>
                     </label>
                     <div className="flex flex-col lg:gap-8 gap-3">
                        <div className="w-full py-6 bg-white rounded-lg px-5 py-4 flex flex-col">
                           <div className="h-[250px] flex flex-col justify-between">
                              <h4 className="text-head-4 font-bold mt-4">Yalla Draw Headquarters</h4>
                              <div className="flex flex-col gap-1 text-size-2">
                                 <div>Full</div>
                                 <div>Address</div>
                                 <div>Here</div>
                              </div>
                              <div className="flex flex-row mb-4">
                                 <div className="flex flex-col flex-1">
                                    <div className="font-bold text-head-2">Call us now</div>
                                    <div className="text-size-2">Phone number here</div>
                                 </div>
                                 <div className="flex flex-col flex-1">
                                    <div className="font-bold text-head-2">Write us an email</div>
                                    <Link className="text-size-2" href="mailto:support@yalladraw.com">support@yalladraw.com</Link>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center bg-white py-2 justify-center gap-16 rounded-standard">
                           <div className="font-bold text-size-4">Live chat with us</div>
                           <img className="max-h-[30px]" src="/assets/images/online-chat.svg" alt="" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
