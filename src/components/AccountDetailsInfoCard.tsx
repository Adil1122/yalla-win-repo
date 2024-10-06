import React from 'react'

export default function AccountDetailsInfoCard({ number, title, description } : {number: string, title: string, description: string}) {
   return (
      <>
         <div className="lg:w-[23%] md:w-[48%] relative bg-white rounded-standard flex flex-col gap-2 lg:gap-6 lg:px-4 lg:pt-4 pb-6 lg:pb-12 text-center my-8 lg:my-10">
            <div className="absolute bg-gradient-to-r from-themeone to-themetwo w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] rounded-full flex items-center justify-center font-noto-sans-bold text-big-one lg:text-large-head text-white left-1/2 -top-10 tranform -translate-x-1/2">{number}</div>
            <div className="mt-12 lg:mt-16 capitalize text-theme-gradient font-bold text-head-1 lg:text-big-one">{title}</div>
            <div className="text-sm lg:text-size-2 mx-6 lg:mx-12 leading-wide">{description}</div>
         </div>
         <div className="hidden md:flex w-[2%]"></div>
      </>
   )
}
