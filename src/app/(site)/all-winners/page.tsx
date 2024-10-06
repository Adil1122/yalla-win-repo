import React from 'react'

export default function AllWinnersPage() {
   return (
      <section className="flex flex-col items-center flex-grow px-8 lg:px-24 py-8 lg:py-16 gap-4 lg:gap-8 h-full w-full bg-gradient-to-r from-themeone to-themetwo">
         <h1 className="text-white text-big-one lg:text-large-head font-bold uppercase mb-6">All winners</h1>
         <div className="flex flex-col w-full gap-12">
            <div className="flex flex-col xl:flex-row items-center rounded-standard bg-white py-8 xl:py-16 px-4 xl:px-12 gap-8 xl:gap-12 w-full shadow-custom-1">
               <div className="flex flex-col items-center lg:gap-2 lg:w-1/2">
                  <div className="text-head-4 lg:text-big-one font-bold text-theme-gradient">31st July, 2024</div>
                  <div className="text-size-2">Draw Time 11PM Everyday</div>
               </div>
               <div className="flex flex-row gap-4 lg:gap-6 lg:w-1/2">
                  <div className="flex flex-col items-start justify-between font-medium gap-4">   
                     <div className="text-black text-size-2 lg:text-head-4 font-semibold mt-1">Yalla 6</div>
                     <div className="text-black text-size-2 lg:text-head-4 font-semibold">Yalla 4</div>
                     <div className="text-black text-size-2 lg:text-head-4 font-semibold mb-1">Yalla 3</div>
                  </div>
                  <div className="flex flex-col items-start justify-between font-medium gap-4">   
                     <div className="flex flex-row gap-2 lg:gap-3 ">
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">01</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">02</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">03</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">04</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">05</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">06</div>
                     </div>
                     <div className="flex flex-row gap-2 lg:gap-3 ">
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">01</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">02</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">03</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">04</div>
                     </div>
                     <div className="flex flex-row gap-2 lg:gap-3 ">
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">01</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">02</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-2 lg:text-head-3 text-black flex items-center justify-center">03</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
