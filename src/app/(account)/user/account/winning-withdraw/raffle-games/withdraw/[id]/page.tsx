'use client'

import React, { useEffect, useState } from 'react'
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import Notification from "@/components/notificationWidget";

type PaymentMode = 'wallet' | 'bank'

export default function UserAccountWithdraw({ params } : {params: { id: string; }}) {

   const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode>('wallet')
   const paymentModes = [
      {id: 'wallet', name: 'Add To Wallet'},
      {id: 'bank', name: 'Bank Transfer'},
   ]

   const handlePaymentMode = (value: PaymentMode) => {
      setSelectedPaymentMode(value)
   }
   const [amount, setAmount] = useState(0);
   const [prizeAmount, setPrizeAmount] = useState(0);
   const [amountError, setAmountError] = useState('');
   const [amountSuccess, setAmountSuccess] = useState('');

   useEffect(() => {
      getAmount();
   }, []);

   const getAmount = async() => {
      try {
         let response = await fetch("/api/user/account/winning-withdraw/raffle-games/withdraw?id=" + params.id , {  
            method: "PATCH",
         });

         const content = await response.json();
         if(!response.ok) {

         } else {
            setPrizeAmount(content.amount_left)
         }
      } catch (error) {
         
      }
   }

   function validateAmount() {
      var error = false;
      if(amount > prizeAmount) {
         error = true;
         setAmountSuccess('');
         setAmountError('Amount must be less than or equal to prize amount ' + prizeAmount);
         
      }
      return error;
   }

   const withdrawAmount = async () => {
      try {
         if(!validateAmount()) {
            var user = localStorage.getItem('yalla_logged_in_user') !== null ? JSON.parse(localStorage.getItem('yalla_logged_in_user') + '') : '';
            let response = await fetch("/api/user/account/winning-withdraw/raffle-games/withdraw?amount=" + amount + '&user_id=' + user._id + '&id=' + params.id, {  
               method: "GET",
            });

            const content = await response.json();
            if(!response.ok) {

            } else {
               setAmountSuccess('Amount successfully added in wallet.');
               setAmountError('');
               getAmount();
            }
         }
      } catch (error) {
         
      }
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow gap-6 lg:gap-12 lg:px-12 py-12 lg:py-20 flex flex-col">
         <button type="button" className="flex flex-row items-center gap-3 text-white w-fit px-6">
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
            <div className="font-bold text-head-2 lg:text-head-4">Withdraw</div>
         </button>

         {/* options start */}
         <div className="flex flex-col gap-5 bg-light-background-two backdrop-blur-64 lg:bg-transparent lg:py-0 py-6 lg:gap-8 px-6">
            <h2 className="text-white font-bold text-size-4 lg:text-head-4">Choose Payment Method</h2>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-16">
            {paymentModes.map((item, index) => (
               <div key={index} onClick={() => handlePaymentMode(item.id as PaymentMode)} className="flex flex-row items-center gap-4 lg:gap-6 cursor-pointer">
                  <div className="w-[15px] h-[15px] lg:w-[25px] lg:h-[25px] rounded-full ring-[2px] lg:ring-[3px] ring-white flex items-center justify-center">
                     {item.id == selectedPaymentMode && (
                        <div className="w-[11px] h-[11px] lg:w-[20px] lg:h-[20px] rounded-full bg-white"></div>
                     )}
                  </div>
                  <div className="text-white font-medium text-size-3 lg:text-head-1">{item.name}</div>
               </div>
            ))}
            </div>   
         </div>
         {/* options end */}
         {selectedPaymentMode == 'wallet' && (
            <>
               {/* pay via card step 1 starts */}
               <div className="flex flex-col gap-6 lg:gap-12 lg:w-1/2">
                  <div className="flex flex-col gap-5 bg-light-background-two backdrop-blur-64 lg:bg-transparent px-6 lg:py-0 py-6">
                     <h2 className="text-white font-bold text-size-4 lg:text-head-4">Enter Withdrawal Amount</h2>
                     <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3" min="0" type="number" placeholder="Amount in AED" onChange={(e) => setAmount(parseFloat(e.target.value))} />
                     <button className="bg-white rounded-lg text-size-2 lg:text-size-4 text-themetwo font-medium py-3 lg:py-4 px-16 lg:w-fit mt-6" onClick={() => withdrawAmount()}>Withdraw Now</button>
                  </div>
               </div>
            </>
         )}

         {selectedPaymentMode == 'bank' && (
            <>
               <div className="flex flex-col gap-6 lg:gap-12 lg:w-1/2">
                  <div className="flex flex-col gap-5 bg-light-background-two backdrop-blur-64 lg:bg-transparent px-6 lg:py-0 py-6">
                     <h2 className="text-white font-bold text-size-4 lg:text-head-4">Enter Withdrawal Amount</h2>
                     <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3" min="0" type="number" placeholder="Amount in AED" />
                  </div>
               </div>
               <div className="flex flex-col gap-6 lg:gap-12 lg:w-1/2">
                  <div className="flex flex-col gap-5 bg-light-background-two backdrop-blur-64 lg:bg-transparent px-6 lg:py-0 py-6">
                     <h2 className="text-white font-bold text-size-4 lg:text-head-4">Enter Bank Details</h2>
                     <div className="flex flex-col gap-6">
                        <div className="w-full">
                           <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="Account Holder Name" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4">
                           <div className="flex-1">
                              <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="Bank Name" />
                           </div>
                           <div className="flex-1">
                              <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="Account Number" />
                           </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4">
                           <div className="flex-1">
                              <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="SWIFT/BIC Code" />
                           </div>
                           <div className="flex-1">
                              <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="Bank Branch" />
                           </div>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                           <div className="flex items-center gap-3">      
                              <div className="rounded border border-[2px] lg:border-[3px] border-white w-[20px] h-[20px] flex items-center justify-center">
                                 {/* add this when checked */}
                                 <div className="text-white ml-[1px]">
                                    <FontAwesomeIcon  size="sm" icon={faCheck} />
                                 </div>
                              </div>
                              <div className="text-white text-sm lg:text-size-1">
                                 I agree to the payment and <Link className="underline" href="/terms-and-conditions">terms & conditions</Link>
                              </div>
                           </div>
                        </div>
                        <button className="bg-white rounded-lg text-size-2 lg:text-head-1 text-themetwo font-semibold py-3 lg:py-4 px-16 lg:mt-6">
                           Transfer Now
                        </button>
                     </div>
                  </div>
               </div>
            </>
         )}
         { amountError !== '' && 
            <Notification message="Payment Error" description={amountError} type='error'  />  
         }

         { amountSuccess !== '' && 
            <Notification message="Payment Success" description={amountSuccess} type='success'  />  
         }
      </section>
   )
}