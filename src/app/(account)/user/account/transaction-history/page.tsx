'use client'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { formatISODate } from '@/libs/common';

export default function UserTransactionHistory() { 
   const [Transactions, setTransactions] = useState([]);
   useEffect(() => {
      getTransactions();
   }, []);

   const getTransactions = async() => {
      try {
         var user = localStorage.getItem('yalla_logged_in_user') !== null ? JSON.parse(localStorage.getItem('yalla_logged_in_user') + '') : '';
         let response = await fetch("/api/user/account/transaction-history?user_id=" + user._id , {
            method: "GET",
         });
         const content = await response.json();
         if(!response.ok) {

         } else {
            var temp = content.transactions;
            
            for(var i = 0; i < temp.length; i++) {  
               var date = formatISODate(new Date(temp[i].date));
               temp[i].date = date.fomattedDate;
               var s_no = (i + 1) < 10 ? '0' + (i + 1) : i + 1;
               temp[i]['s_no'] = s_no;
               temp[i].via = temp[i].via === 'card' ? 'Card' : 'Coupon';
               temp[i].payment_type = temp[i].payment_type === 'deposit' ? 'Deposit' : 'Withdrawal';
            }
            setTransactions(temp);
         }
      } catch (error) {
         
      }
      
   }
   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow py-20 flex flex-col">
         <button type="button" className="flex flex-row items-center gap-3 text-white px-6 lg:px-12 w-fit">
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
            <div className="font-bold text-head-2 lg:text-head-4">Transaction History</div>
         </button>
         <div className="w-screen w-full lg:w-auto overflow-x-auto px-6 lg:px-12 mt-8 lg:mt-12">
            <table className="w-full">
               <thead>
                  <tr className="bg-white">
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-left text-darkone rounded-tl rounded-bl">Transaction #</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Order #</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Payment</th> 
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Card No</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Amount</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Closing Balance</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Transaction Note</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-lightthree">
               { 
                  Transactions.map((transaction: any) => (
                  <tr key={transaction._id}>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">{transaction.s_no}</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{transaction.s_no}</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{transaction.payment_type + ' via ' + transaction.via}</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{transaction.card_details}</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{transaction.amount}</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{transaction.date}</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{transaction.closing_balance}</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{transaction.note}</td>
                  </tr>
                  ))
               }
                  {/*<tr>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">1234</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Deposit via Card</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">72182198291921</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">400</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 24 12PM</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">7440</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">order#8928</td>
                  </tr>
                  <tr>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">1234</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Deposit via Card</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">72182198291921</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">400</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 24 12PM</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">7440</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">order#8928</td>
                  </tr>
                  <tr>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">1234</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">1234</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Deposit via Card</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">72182198291921</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">400</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 24 12PM</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">7440</td>
                     <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">order#8928</td>
                  </tr>*/}
               </tbody>
            </table>
         </div>
      </section>
   )
}
