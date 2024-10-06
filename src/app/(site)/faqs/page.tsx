import Link from 'next/link'
import React from 'react'

export default function FaqsPage() {
   return (
      <section className="flex flex-col items-center flex-grow px-8 lg:px-16 py-8 lg:py-16 gap-4 lg:gap-8 h-full w-full bg-gradient-to-r from-themeone to-themetwo">
         <h1 className="text-white text-big-two lg:text-large-head font-bold">FAQs</h1>
         <div className="flex flex-col gap-4 lg:gap-8 w-full">
            <div className="bg-white rounded-lg p-3 lg:p-4 text-theme-topo-1 shadow-custom-1 flex flex-col lg:gap-5">
               <div className="uppercase font-semibold lg:font-bold text-sm lg:text-head-2 tracking-tight">What is the customer service number?</div>
               <div className="text-sm lg:text-size-4">For any inquiries call the UAE number +971 4 397 4070</div>
            </div>
            <div className="bg-white rounded-lg p-3 lg:p-4 text-theme-topo-1 shadow-custom-1 flex flex-col lg:gap-5">
               <div className="uppercase font-semibold lg:font-bold text-sm lg:text-head-2 tracking-tight">What are the servicing hours?</div>
               <div className="text-sm lg:text-size-4">Our customer service centers are available 24 hours, 7 days a week</div>
            </div>
            <div className="bg-white rounded-lg p-3 lg:p-4 text-theme-topo-1 shadow-custom-1 flex flex-col lg:gap-5">
               <div className="uppercase font-semibold lg:font-bold text-sm lg:text-head-2 tracking-tight">What is the customer service email?</div>
               <div className="text-sm lg:text-size-4 flex flex-col lg:flex-row lg:gap-2">
                  <span>You can contact our customer service center by sending an email to</span>
                  <Link href="mailto:someone@example.com" className="underline">customer-support@dreamdraw.ae</Link>
               </div>
            </div>
            <div className="bg-white rounded-lg p-3 lg:p-4 text-theme-topo-1 shadow-custom-1 flex flex-col lg:gap-5">
               <div className="uppercase font-semibold lg:font-bold text-sm lg:text-head-2 tracking-tight">Why do i need to purchase a product?</div>
               <div className="text-sm lg:text-size-4">By purchasing our product you will also get a Free Raffle Ticket to enter in our raffle draws and to win cash prizes</div>
            </div>
            <button className="text-themeone bg-white rounded-full text-center w-fit px-12 py-2 lg:py-3 shadow-custom-1 font-medium text-sm lg:text-size-4 mx-auto mt-6">View All</button>
         </div>
      </section>
   )
}
