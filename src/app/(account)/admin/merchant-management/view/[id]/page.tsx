'use client'

import React, { useEffect, useState } from 'react'
import { faArrowLeft, faChevronLeft, faChevronRight, faEye, faPaperPlane, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'

type Tab = 'details' | 'communication'

export default function AdminViewMerchantDetails({ params } : {params: { id: string; }}) {

   const [activeTab, setActiveTab] = useState<Tab>('details')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [messageReply, setMessageReply] = useState<boolean>(false)
   var active_tab = 'details';
   

   const handleMessageActionClick = (action: 'view' | 'send') => {

      {/* manipulate modal as per the action */}
      setModalIsOpen(true)
   }

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
      setCurrentPage(1)
      active_tab = tab;
      skip = 0;
      getTotalRecords();
   }

   useEffect(() => {
      getTotalRecords()
   }, [])

   var [total_records_count, setTotalRecordsCount] = useState<any>(0);
   var [records, setRecords] = useState<any>([]);
   var [record, setRecord] = useState<any>({});
   //var [invoices_details, setInvoicesDetails] = useState<any>([]);
   var limit = 5;
   var skip = 0;


   var getTotalRecords = async() => {
      try {
         let response = await fetch('/api/admin/merchant-management/view?count=1&type=' + active_tab + '&id=' + params.id + '&search=', {
            method: 'GET',
         });
         var content = await response.json();
         console.log(content)
         if(!response.ok) {

         } else {
            setTotalRecordsCount(content.total_records_count)
            setRecord(content.record)
            //setInvoicesDetails(content.invoices_details)
            getRecords();
         }
      } catch (error) {
         
      }
   }

   var getRecords = async() => {
        try {
           let response = await fetch('/api/admin/merchant-management/view?count=0&type=' + active_tab + '&skip=' + skip + '&limit=' + limit + '&id=' + params.id + '&search=', {
              method: 'GET',
           });
           var content = await response.json();
           console.log('content page: ', content)
  
           if(!response.ok) {
  
           } else {
              setRecords(content.records)
           }
  
        } catch (error) {
        }
   }

   var totalPages = 0;
   var [currentPage, setCurrentPage] = useState(1);
   var [recordsPerPage, setRecordsPerPages] = useState(5);
   totalPages = total_records_count;
   
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
      active_tab = activeTab;
      getRecords()
      setCurrentPage(current_page);
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">
            <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
               <div className="cursor-pointer">
                  <FontAwesomeIcon size="xl" icon={faArrowLeft} />
               </div>
               <div className="cursor-pointer text-head-3 font-medium">View Profile</div>
            </div>
            <div className="flex items-center justify-between px-16 py-12 gap-12">
               <div className="flex items-start flex-grow gap-24">
                  <div className="flex flex-col gap-3">
                     <div className="flex items-center gap-2 font-medium text-head-1">
                        <div className="text-white w-[80px]">ID:</div>
                        <div className="text-lighttwo">{record._id ?? record._id}</div>
                     </div>
                     <div className="flex items-center gap-2 font-medium text-head-1">
                        <div className="text-white w-[80px]">Name:</div>
                        <div className="text-lighttwo">{record.name ?? record.name}</div>
                     </div>
                     <div className="flex items-center gap-2 font-medium text-head-1">
                        <div className="text-white w-[80px]">Email:</div>
                        <div className="text-lighttwo">{record.email ?? record.email}</div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="mt-12 px-12 flex items-center w-full gap-12 text-white text-size-4">
               <div className={`cursor-pointer ${activeTab === 'details' ? 'underline' : ''}`} onClick={() => handleTabChange('details')}>Shop Details</div>
               <div className={`cursor-pointer ${activeTab === 'communication' ? 'underline' : ''}`} onClick={() => handleTabChange('communication')}>Communication Log</div>
            </div>

            <div className="flex flex-col mt-12 px-12">
               {activeTab == 'details' && (
                  <table className="w-full">
                     <thead>
                        <tr className="bg-white">
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tl rounded-bl">Shop ID</th>
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Shop Name</th> 
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Profit %</th>
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Reg Date</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                     {
                        records.map((rec: any) => (
                        <tr key={rec._id}>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec._id}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.name}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">20%</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.createdAt}</td>
                        </tr>
                        ))
                     }
                        
                     </tbody>
                  </table>
               )}

               {activeTab == 'communication' && (
                  <table className="w-full">
                     <thead>
                        <tr className="bg-white">
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tl rounded-bl">Message ID</th>
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Title</th> 
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date Sent</th>
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">

                     {
                        records.map((rec: any) => (
                        <tr key={rec._id}>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec._id}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.contents}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.createdAt}</td>
                           <td>
                              <div className="flex items-center justify-center gap-2">
                                 <button type="button" onClick={() => handleMessageActionClick('view')} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                    <FontAwesomeIcon size="lg" icon={faEye} />
                                 </button>
                                 <button type="button" onClick={() => handleMessageActionClick('send')} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                    <FontAwesomeIcon size="lg" icon={faPaperPlane} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                        ))
                     }

                     </tbody>
                  </table>
               )}

               <div className="font-poppins-medium mt-6 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">
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
            </div>
         </div>

         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">View Message</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col lg:flex-row lg:justify-between">
                        <div className="text-darkone text-size-4">Message</div>
                        <div className="text-lightone text-size-4">10 sep 2024, 12:30 am</div>
                     </div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                     <textarea className="w-full h-[150px] focus:ring-0 focus:outline-none border-none bg-transparent resize-none" placeholder="Message title"></textarea>
                     </div>
                  </div>
                  {messageReply && (
                     <>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="Type your reply" />
                           </div>
                        </div>
                        <div className="flex items-center ml-auto gap-6">
                           <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                           <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Save</button>
                        </div>
                     </>
                  )}
                  {!messageReply && (
                     <button onClick={() => setMessageReply(true)} className="text-white text-head-1 ml-auto font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Reply</button>
                  )}
               </div>
            </div>
         </Modal>
      </section>
   )
}
