import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import WinnerCard from './winner-card'

import Swiper from "swiper"
import { Navigation } from "swiper/modules"
import "swiper/css"

interface ResultsSectionProps {
   game_winners: any;
   product_winners: any;
   yalla_3_top_winner: any;
   yalla_4_top_winner: any;
   yalla_6_top_winner: any
 }

 const ResultsSection: React.FC<ResultsSectionProps> = ({ yalla_3_top_winner, yalla_4_top_winner, yalla_6_top_winner, game_winners, product_winners }) => {

   const swiperRef = useRef(null)

   useEffect(() => {

      if(game_winners.length > 0 || product_winners.length > 0) {

         if (swiperRef.current) {
            new Swiper(swiperRef.current, {
               direction: 'vertical',
               spaceBetween: 10,
               modules: [Navigation],
               navigation: {
                  nextEl: '.swiper-button-next-vertical',
                  prevEl: '.swiper-button-prev-vertical',
               },
            })
         }

      }

   }, [game_winners, product_winners])

   return (
      <>
         <section className="flex flex-col lg:flex-row gap-20 lg:gap-12 py-8 lg:py-16 px-8 lg:px-16">
         { (yalla_6_top_winner.length > 0 || yalla_4_top_winner.length > 0 || yalla_6_top_winner.length > 0
            || game_winners.length > 0 || product_winners.length > 0)  &&
         <aside className="flex flex-col gap-3 lg:gap-6 lg:w-[65%] px-4 lg:px-28 py-6 bg-white rounded-standard">
               <h2 className="font-noto-sans text-center uppercase text-themeone text-big-one lg:text-extra-large-head font-semibold">Results</h2>
               <div className="flex flex-row justify-between gap-4">
                  <div className="flex flex-col items-start justify-between font-medium gap-4 mt-1"> 
                     { yalla_6_top_winner.length > 0 &&
                        <div className="text-black text-size-2 lg:text-head-4 font-semibold">Yalla 6</div>
                     }

                     { yalla_4_top_winner.length > 0 &&
                        <div className="text-black text-size-2 lg:text-head-4 font-semibold">Yalla 4</div>
                     }

                     { yalla_3_top_winner.length > 0 &&
                        <div className="text-black text-size-2 lg:text-head-4 font-semibold">Yalla 3</div>
                     }

                     <div className="text-black text-size-2 lg:text-head-4 font-semibold">{product_winners.length > 0 && (typeof product_winners[0] !== 'undefined') ? product_winners[0].winnersWithPrizes[0].name : ''}</div>
                     <div className="text-black text-size-2 lg:text-head-4 font-semibold">{product_winners.length > 0 && (typeof product_winners[1] !== 'undefined') ? product_winners[1].winnersWithPrizes[0].name : ''}</div>
                     <div className="text-black text-size-2 lg:text-head-4 font-semibold">{product_winners.length > 0 && (typeof product_winners[2] !== 'undefined') ? product_winners[2].winnersWithPrizes[0].name : ''}</div>
                     <div className="text-black text-size-2 lg:text-head-4 font-semibold">{product_winners.length > 0 && (typeof product_winners[3] !== 'undefined') ? product_winners[3].winnersWithPrizes[0].name : ''}</div>


                  </div>
                  <div className="flex flex-col items-start justify-between font-medium gap-4">   
                  { yalla_6_top_winner.length > 0 &&
                     <div className="flex flex-row gap-2 lg:gap-3 ">
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_6_top_winner.length > 0 ? yalla_6_top_winner[0].winnersWithTickets[0].ticket_splitted[0] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_6_top_winner.length > 0 ? yalla_6_top_winner[0].winnersWithTickets[0].ticket_splitted[1] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_6_top_winner.length > 0 ? yalla_6_top_winner[0].winnersWithTickets[0].ticket_splitted[2] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_6_top_winner.length > 0 ? yalla_6_top_winner[0].winnersWithTickets[0].ticket_splitted[3] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_6_top_winner.length > 0 ? yalla_6_top_winner[0].winnersWithTickets[0].ticket_splitted[4] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_6_top_winner.length > 0 ? yalla_6_top_winner[0].winnersWithTickets[0].ticket_splitted[5] : ''}</div>
                     </div>
                  }

                  { yalla_4_top_winner.length > 0 &&
                     <div className="flex flex-row gap-2 lg:gap-3 ">
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_4_top_winner.length > 0 ? yalla_4_top_winner[0].winnersWithTickets[0].ticket_splitted[0] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_4_top_winner.length > 0 ? yalla_4_top_winner[0].winnersWithTickets[0].ticket_splitted[1] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_4_top_winner.length > 0 ? yalla_4_top_winner[0].winnersWithTickets[0].ticket_splitted[2] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_4_top_winner.length > 0 ? yalla_4_top_winner[0].winnersWithTickets[0].ticket_splitted[3] : ''}</div>
                     </div>
                  }

                  { yalla_3_top_winner.length > 0 &&
                     <div className="flex flex-row gap-2 lg:gap-3 ">
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_3_top_winner.length > 0 ? yalla_3_top_winner[0].winnersWithTickets[0].ticket_splitted[0] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_3_top_winner.length > 0 ? yalla_3_top_winner[0].winnersWithTickets[0].ticket_splitted[1] : ''}</div>
                        <div className="rounded-full border border-themetwo h-[30px] w-[30px] lg:h-[45px] lg:w-[45px] text-size-4 lg:text-head-3 text-black flex items-center justify-center">{yalla_3_top_winner.length > 0 ? yalla_3_top_winner[0].winnersWithTickets[0].ticket_splitted[2] : ''}</div>
                     </div>
                  }

                     <div className="text-head-2">{product_winners.length > 0 && (typeof product_winners[0] !== 'undefined') ? product_winners[0].winnersWithUsers[0].first_name + ' ' +  product_winners[0].winnersWithUsers[0].last_name: ''}</div>
                     <div className="text-head-2">{product_winners.length > 0 && (typeof product_winners[1] !== 'undefined') ? product_winners[1].winnersWithUsers[0].first_name + ' ' +  product_winners[1].winnersWithUsers[0].last_name: ''}</div>
                     <div className="text-head-2">{product_winners.length > 0 && (typeof product_winners[2] !== 'undefined') ? product_winners[2].winnersWithUsers[0].first_name + ' ' +  product_winners[2].winnersWithUsers[0].last_name: ''}</div>
                     <div className="text-head-2">{product_winners.length > 0 && (typeof product_winners[3] !== 'undefined') ? product_winners[3].winnersWithUsers[0].first_name + ' ' +  product_winners[3].winnersWithUsers[0].last_name: ''}</div>

                  </div>
               </div>
            </aside>
            }

            {(game_winners.length > 0 || game_winners.length > 0) && (
               <aside className="lg:w-[35%] relative my-6">
                  <div ref={swiperRef} className="swiper-custom h-[440px] lg:h-[525px]">
                     <div className="swiper-wrapper">


                        { 
                           game_winners.length > 0 &&
                           game_winners.map((winner: any) => (
                              winner.winnersWithUsers.length > 0 && winner.winnersWithGames.length > 0 && winner.winnersWithTickets.length > 0 && (
                                 <div className="swiper-slide" key={winner._id}>
                                    <WinnerCard key={winner._id} name={winner.winnersWithUsers[0].first_name + ' ' + winner.winnersWithUsers[0].last_name} prizeAmount={winner.prize_amount} ticketNumber={winner.winnersWithTickets[0].ticket_number} date={winner.winning_date} href="" type="game_winner" prizeName="" winnerImage={winner.winnersWithUsers[0].image} />
                                 </div>
                                 )
                              ))
                        }

                        { 
                           game_winners.length > 0 &&
                           product_winners.map((winner: any) => (
                              winner.winnersWithUsers.length > 0 && winner.winnersWithPrizes.length > 0 && (
                                 <div className="swiper-slide" key={winner._id}>
                                    <WinnerCard key={winner._id} name={winner.winnersWithUsers[0].first_name + ' ' + winner.winnersWithUsers[0].last_name} prizeAmount={winner.prize_amount} ticketNumber="" date={winner.winning_date} href="" type="product_winner" prizeName={winner.winnersWithPrizes[0].name} winnerImage={winner.winnersWithUsers[0].image} />
                                 </div>
                                 )
                              ))
                        }



                        {/*<div className="swiper-slide">
                           <WinnerCard name="Mr. abcd" prizeAmount="$2000" ticketNumber="DC-00154-019963331" date="4:45 PM 19 July, 2024" href="" type="game_winner" prizeName="" winnerImage={'/uploads/users/winner-img.svg'} />
                        </div>
                        <div className="swiper-slide">
                           <WinnerCard name="Mr. abcd" prizeAmount="$2000" ticketNumber="DC-00154-019963331" date="4:45 PM 19 July, 2024" href="" type="game_winner" prizeName="" winnerImage={'/uploads/users/winner-img.svg'} />
                        </div>*/}
                     </div>
                  </div>
                  <div className="absolute left-1/2 -top-[10%] transform -translate-x-1/2 h-[120%] flex flex-col justify-between px-4">
                     <div className="flex items-center justify-center rounded-full h-[35px] w-[35px] cursor-pointer swiper-button-prev-vertical">
                        <img src="/assets/images/up-icon-white.svg" />
                     </div>   
                     <div className="flex items-center justify-center rounded-full h-[35px] w-[35px] cursor-pointer swiper-button-next-vertical">
                        <img src="/assets/images/down-icon-white.svg" />
                     </div> 
                  </div>
               </aside>
            )}
         </section>
      </>
   )
}

export default ResultsSection;