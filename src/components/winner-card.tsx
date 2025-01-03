import Link from 'next/link';
import React from 'react'

interface WinnerCardProps {
  name: string;
  prizeAmount: string;
  ticketNumber: string;
  date: string;
  href: string;
  type: String;
  prizeName: String;
  winnerImage: String;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ name, prizeAmount, ticketNumber, date, href, type, prizeName, winnerImage }) => {
   return (
      <>
         <div className="bg-white rounded-standard shadow-custom-1 mx-auto w-[85%] lg:w-full">
            <div className={`w-full h-[180px] lg:h-[220px] bg-center bg-cover bg-no-repeat rounded-standard`} style={{backgroundImage: `url(${winnerImage})`}}></div>
            <div className="flex flex-col justify-center items-center lg:gap-3 xl:gap-5 py-8 px-12 lg:py-12">
               <div className="text-themetwo text-head-5 xl:text-big-five font-bold">Congratulations</div>
               <div className="text-darkone text-size-2 xl:text-head-4 text-center">{name} for winning {prizeAmount} Cash</div>
               <div className="flex flex-col gap-2 mt-2 xl:mt-0 text-darkone text-sm lg:text-size-1">
                  <div className="flex flex-row gap-1 items-center justify-center whitespace-nowrap">
                     {
                        type === 'game_winner' ? (
                        <React.Fragment>
                           <div className="font-medium">Ticket No:</div>
                           <div className="font-light">{ticketNumber}</div>
                        </React.Fragment>
                        ) : (
                           <React.Fragment>
                              <div className="font-medium">Prize Won:</div>
                              <div className="font-light">{prizeName}</div>
                           </React.Fragment>
                        )
                     }
                     
                  </div>
                  <div className="flex flex-row gap-2 whitespace-nowrap">
                     <div className="font-medium">Announced on:</div>
                     <div className="font-light">{date}</div>
                  </div>
               </div>
               <Link href={href} className="text-white shadow-custom-1 rounded-full px-12 py-4 bg-themeone mt-4 lg:mt-0 font-medium whitespace-nowrap">Try Your Luck</Link>
            </div>
         </div>   
      </>
   )
}

export default WinnerCard;