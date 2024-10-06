'use client'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { formatISODate } from '@/libs/common';
import Link from 'next/link';

export default function UserPurchaseRafflePrize() {
   const [invoices, setInvoices] = useState([]);

   useEffect(() => {
      getInvoices();
   }, []);

   const getInvoices = async() => {
      try {
         var user = localStorage.getItem('yalla_logged_in_user') !== null ? JSON.parse(localStorage.getItem('yalla_logged_in_user') + '') : '';
         let response = await fetch("/api/user/current-prize-purchasing?user_id=" + user._id, {
            method: "GET",
         });
         const content = await response.json();
         console.log(content)

         if(!response.ok) {

         } else {
            
            var temp: any = [];
            for(var i = 0; i < content.invoices.length; i++) {
               if(content.invoices[i].cart_product_details !== null && content.invoices[i].cart_product_details !== '') {
                  var products = JSON.parse(content.invoices[i].cart_product_details);
                  var draws = JSON.parse(content.invoices[i].draws);
                  for(var j = 0; j < products.length; j++) {
                     var date_obj = formatISODate(new Date(draws[j].draw_date));
                     var s_no = (i + 1) < 10 ? '0' + (i + 1) : i + 1;
                     var inv = {
                        _id: content.invoices[i]._id,
                        invoice_number: content.invoices[i].invoice_number,
                        product_name: products[j].product_name,
                        product_image: products[j].product_image,
                        draw_date: date_obj.fomattedDate,
                        invoice_status: content.invoices[i].invoice_status,
                        s_no: s_no
                     }
                     temp.push(inv);
                  }
               }
            }

            console.log('temp: ', temp)
            setInvoices(temp); 
         }
      } catch (error) {
         
      }
   }
   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow py-20 flex flex-col">
         <button type="button" className="flex flex-row items-center gap-3 text-white px-6 lg:px-12 w-fit">
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
            <div className="font-bold text-head-2 lg:text-head-4">Raffle Prize</div>
         </button>
         <div className="w-screen w-full lg:w-auto overflow-x-auto px-6 lg:px-12 mt-8 lg:mt-12">
            <table className="w-full">
               <thead>
                  <tr className="bg-white">
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-left text-darkone">Order #</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Name</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Image</th> 
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Details</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Image</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Draw Date</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-lightthree">
               { 
                  invoices.map((invoice: any) => (
                     <tr key={invoice._id}>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">{invoice.s_no}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{invoice.product_name}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1">
                           <img className="w-[70px] mx-auto" src={invoice.product_image} alt="" />
                        </td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">iPhone 15 - AED 12</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1">
                           <img className="w-[70px] mx-auto" src="/assets/images/cap.svg" alt="" />
                        </td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{invoice.draw_date}</td>
                        <td className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{invoice.invoice_status}</td>
                        <td className="relative py-5 px-8">
                           <Link href={'/prize-invoice/' + invoice._id} className="text-themeone font-medium px-4 py-1 lg:py-3 cursor-pointer lg:px-8 text-sm lg:text-size-1 bg-white rounded mx-auto w-fit">Invoice</Link>
                        </td>
                     </tr>
                  ))
               }
               </tbody>
            </table>
         </div>
      </section>
   )
}
