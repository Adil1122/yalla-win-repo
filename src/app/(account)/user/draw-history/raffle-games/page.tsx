'use client'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { formatISODate } from '@/libs/common'
import Link from 'next/link'
import { faChevronLeft, faChevronRight, faCommentAlt, faDeleteLeft, faEye, faImage, faPaperPlane, faPencil, faPlus, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default function UserDrawHistoryRaffleGame() {
   const [invoices, setInvoices] = useState([]);

   useEffect(() => {
      //getInvoices();
      getInvoiceCount()
   }, []);

   var skip = 0
   var [invoice_count, setInvoiceCount] = useState(0);

   const getInvoiceCount = async() => {
      try {
         let response = await fetch("/api/user/game-draw-history", {
            method: "OPTIONS",
         });
         const content = await response.json();
         //console.log(content)

         if(!response.ok) {

         } else {
            setInvoiceCount(content.invoice_count)
            console.log('content.invoice_count: ', content.invoice_count)
            getInvoices()
         }
      } catch (error) {
         
      }
   }

   const getInvoices = async() => {
      try {
         let response = await fetch("/api/user/game-draw-history?skip=" + skip + "&limit=" + recordsPerPage + "&platform_type=web", {
            method: "GET",
         });
         const content = await response.json();
         console.log(content)

         if(!response.ok) {

         } else {
            var temp = content.invoices;
            for(var i = 0; i < temp.length; i++) {
               var date = formatISODate(new Date(temp[i].drawInInvoice[0].draw_date));
               temp[i].drawInInvoice[0].draw_date = date.fomattedDate;
               var s_no = (i + 1) < 10 ? '0' + (i + 1) : i + 1;
               temp[i]['s_no'] = s_no;
            }
            setInvoices(temp);
         }
      } catch (error) {
         
      }
   }

   var totalPages = 0;
   var [currentPage, setCurrentPage] = useState(1);
   var [recordsPerPage, setRecordsPerPages] = useState(5);
   totalPages = invoice_count;
   var pages = [];
   var show_pages: any = [];
   for(var i = 1; i <= Math.ceil(totalPages / recordsPerPage); i++) {
      pages.push(i);
      if(i === currentPage || i === (currentPage + 1) || i === (currentPage - 1) || i === (currentPage + 2) || i === (currentPage - 2)) {
         show_pages.push(i);
      }
   }
   console.log('pages: ', pages)

   function setPagination(current_page: any) {
      if(current_page < 1) {
         current_page = 1;
      }

      if(current_page > pages.length) {
         current_page = pages.length
      }
      skip = recordsPerPage * (current_page - 1);
      getInvoices()
      setCurrentPage(current_page);
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow py-20 flex flex-col">
         <button type="button" className="flex flex-row items-center gap-3 text-white px-6 lg:px-12 w-fit">
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
            <div className="font-bold text-head-2 lg:text-head-4">Raffle Game</div>
         </button>
         <div className="w-screen w-full lg:w-auto overflow-x-auto px-6 lg:px-12 mt-8 lg:mt-12">
            <table className="w-full">
               <thead>
                  <tr className="bg-white">
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-left text-darkone rounded-tl rounded-bl">Game Id</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Name</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game Title</th> 
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">User Number</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Draw Date</th>
                     <th scope="col" className="px-4 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-lightthree">
               { 
                        invoices.map((invoice: any) => (
                           (invoice.gameInInvoice.length > 0 && invoice.productInInvoice.length > 0 && invoice.drawInInvoice.length > 0) && (
                           <tr key={invoice._id}>
                              <td key={invoice._id + '0'} className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-left">{invoice.s_no}</td>
                              <td key={invoice._id + '1'} className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{invoice.productInInvoice[0].name}</td>
                              <td key={invoice._id + '2'} className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1">
                                 <img key={invoice._id + '3'} className="w-[70px] mx-auto" src={invoice.productInInvoice[0].image} alt="" />
                              </td>
                              <td key={invoice._id + '4'} className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{invoice.gameInInvoice[0].name}</td>
                              <td key={invoice._id + '5'} className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{invoice.invoice_status}</td>
                              <td key={invoice._id + '7'} className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{invoice.invoice_number}</td>
                              <td key={invoice._id + '8'} className="whitespace-nowrap px-4 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{invoice.drawInInvoice[0].draw_date}</td>
                              <td key={invoice._id + '9'} className="relative py-5 px-8">
                                 <Link href={'/game-invoice/' + invoice._id} key={invoice._id + '10'} className="text-themeone font-medium px-4 py-1 lg:py-3 cursor-pointer lg:px-8 text-sm lg:text-size-1 bg-white rounded mx-auto w-fit">Invoice</Link>
                              </td>
                           </tr>
                     )))
                  }
                  
               </tbody>
            </table>
         </div>

         <div className="font-poppins-medium mt-12 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">

            {
               pages.length > 0 &&
               <div className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(currentPage - 1)}>
                  <FontAwesomeIcon size="1x" icon={faChevronLeft} />
               </div>
            }

            {
               pages.map((page: any) => (
                  show_pages.includes(page) && (
                     page === currentPage ?
                     <div key={page} className="px-4 py-2 text-black bg-white flex items-center justify-center cursor-pointer" onClick={() => setPagination(page)}>{page}</div>
                     :
                     <div key={page} className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(page)}>{page}</div>
                  ) 
            ))}

            {
               pages.length > 0 &&
               <div className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(currentPage + 1)}>
                  <FontAwesomeIcon size="1x" icon={faChevronRight} />
               </div>
            }

         </div>

      </section>
   )
}
