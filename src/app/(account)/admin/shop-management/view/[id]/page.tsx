'use client'

import React, { useEffect, useState } from 'react'
import { faArrowLeft, faChevronDown, faChevronLeft, faChevronRight, faPencil, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { SwitchComponent } from '@/components/SwitchComponent'
import { get } from 'http'

type Tab = 'games' | 'products' | 'sales' | 'transaction'
type InvoiceTab = 'invoice' | 'ticket'

export default function AdminViewShopDetails({ params } : {params: { id: string; }}) {

   const [activeTab, setActiveTab] = useState<Tab>('games')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [activeInvoiceTab, setInvoiceActiveTab] = useState<InvoiceTab>('invoice')
   const [showInvoice, setShowInvoice] = useState<boolean>(false)
   const [search, setSearch] = useState('')
   var search_str = ''
   var active_tab = 'games';

   const handleEditClick = () => {
      setModalIsOpen(true)
   }

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
      setCurrentPage(1)
      active_tab = tab;
      skip = 0;
      search_str = search;
      getTotalRecords();
   }

   const handleShowInvoice = (input: string) => {
      setShowInvoice(true)
   }

   const handleInvoiceTabChange = (tab: InvoiceTab) => {
      setInvoiceActiveTab(tab)
   }

   useEffect(() => {
      getTotalRecords()
   }, [])

   var [total_records_count, setTotalRecordsCount] = useState<any>(0);
   var [records, setRecords] = useState<any>([]);
   //var [record, setRecord] = useState<any>({});
   //var [invoices_details, setInvoicesDetails] = useState<any>([]);
   var limit = 5;
   var skip = 0;


   var getTotalRecords = async() => {
      try {
         let response = await fetch('/api/admin/shop-management/view?count=1&type=' + active_tab + '&id=' + params.id + '&search=' + search_str, {
            method: 'GET',
         });
         var content = await response.json();
         console.log(content)
         if(!response.ok) {

         } else {
            setTotalRecordsCount(content.total_records_count)
            //setRecord(content.record)
            //setInvoicesDetails(content.invoices_details)
            getRecords();
         }
      } catch (error) {
         
      }
   }

   var getRecords = async() => {
        try {
           let response = await fetch('/api/admin/shop-management/view?count=0&type=' + active_tab + '&skip=' + skip + '&limit=' + limit + '&id=' + params.id + '&search=' + search_str, {
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

   var [saleId, setSaleId] = useState("");
   var [form, setForm] = useState({
      total_sales: '',
      total_orders: '',
      winning_orders: '',
      merchant_percentage: '',
      our_percentage: '',
      payment_status: '',

      total_sales_error: "",
      total_orders_error: "",
      winning_orders_error: "",
      merchant_percentage_error: "",
      our_percentage_error: "",
      payment_status_error: "",
      server_error: "",
      server_success: ""
   });

   async function openEditPopup(sale_id: any) {
      setSaleId(sale_id)
      var url = '/api/admin/shop-management/view?id=' + sale_id;
      let response = await fetch(url, {
         method: 'PATCH',
      });
      const content = await response.json();
      if(!response.ok) {

      } else {

         setForm({
            total_sales: content.sale.total_sales,
            total_orders: content.sale.total_orders,
            winning_orders: content.sale.winning_orders,
            merchant_percentage: content.sale.merchant_percentage,
            our_percentage: content.sale.our_percentage,
            payment_status: content.sale.payment_status,

            total_sales_error: "",
            total_orders_error: "",
            winning_orders_error: "",
            merchant_percentage_error: "",
            our_percentage_error: "",
            payment_status_error: "",
            server_error: "",
            server_success: ""
         });

         setModalIsOpen(true);

      }
   }

   function updateForm(value: any) {
      console.log(value)
      return setForm((prev) => {
         return { ...prev, ...value };
      });
   }

   function isValidateErrorForm() {
      var err = {
         total_sales_error: "",
         total_orders_error: "",
         winning_orders_error: "",
         merchant_percentage_error: "",
         our_percentage_error: "",
         payment_status_error: ""
      };

      var is_error = false;

      // Validation logic
      if (form.total_sales === '') {
         err['total_sales_error'] = 'Total Sales is Required';
         is_error = true;
      }

      if (form.total_orders === '') {
         err['total_orders_error'] = 'Total Orders is Required';
         is_error = true;
      }

      if (form.winning_orders === '') {
         err['winning_orders_error'] = 'Winning Orders is Required';
         is_error = true;
      }

      if (form.merchant_percentage === '') {
         err['merchant_percentage_error'] = 'Merchant Percentage is Required';
         is_error = true;
      }

      if (form.our_percentage === '') {
         err['our_percentage_error'] = 'Our Percentage is Required';
         is_error = true;
      }

      if (form.payment_status === '') {
         err['payment_status_error'] = 'payment Status is Required';
         is_error = true;
      }

      setForm((prev) => {
         return { ...prev, ...err };
      });

      console.log('is_error: ', is_error)

      return is_error;
   }

   async function onSubmit(e: any) {
      e.preventDefault();
      if (!isValidateErrorForm()) {
         let formData = new FormData();
         formData.append('total_sales', form.total_sales);
         formData.append('total_orders', form.total_orders);
         formData.append('winning_orders', form.winning_orders);
         formData.append('merchant_percentage', form.merchant_percentage);
         formData.append('our_percentage', form.our_percentage);
         formData.append('payment_status', form.payment_status);

         var url = '/api/admin/shop-management/view?id=' + saleId;
         var method = 'PUT';
         var success_message = 'Sale updated successfully.';

         try {
            let response = await fetch(url, {
               method: method,
               body: formData
            });

            setModalIsOpen(false)

            if (!response.ok) {
               setForm((prev) => {
                  return { ...prev, server_error: `HTTP error! status: ${response.status}` };
               });
            } else {
               setForm((prev) => {
                  return { ...prev, server_success: success_message };
               });
               setCurrentPage(1)
               active_tab = activeTab;
               skip = 0;
               getRecords();
            }
         } catch (error) {
            setForm((prev) => {
               return { ...prev, server_error: `A problem occurred with your fetch operation: ${error}` };
            });
         }
      }
   }

   var [invoice, setInvoice] = useState<any>([])
   var [tickets, setTickets] = useState<any>([])

   async function getInvoiceDetails(inv_id: any) {
      try {
        let response = await fetch("/api/user/current-game-purchasing?id=" + inv_id, {
            method: "PATCH",
         });
         const content = await response.json();
         console.log(content)

         if(!response.ok) {

         } else {
            setInvoice(content.invoice)
            setTickets(content.tickets)
            console.log('content.invoice: ', content.invoice)
         }
      } catch (error) {
         
      }
   }

   function changeSearch(value: any) {

      active_tab = activeTab;
      skip = 0;
      search_str = value;
      setSearch(value)
      getTotalRecords()

   }


   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         {!showInvoice && (

            <div className="flex flex-col flex-grow">
               <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
                  <div className="cursor-pointer">
                     <FontAwesomeIcon size="xl" icon={faArrowLeft} />
                  </div>
                  <div className="cursor-pointer text-head-3 font-medium">View Details</div>
               </div>
               <div className="px-12 mt-12">
                  <div className="flex flex-row items-center gap-3 w-full lg:w-1/2">
                     <div className="flex items-center w-full gap-3 bg-white rounded-lg py-3 px-6">
                        <div>
                           <FontAwesomeIcon size="lg" icon={faSearch} />
                        </div>
                        <div className="w-full">
                           <input type="text" className="h-[40px] w-full bg-transparent ml-2 border-none focus:outline-none focus:ring-0 -mt-1" placeholder="Search By QR Id"
                           value={search} onChange={(e) => changeSearch(e.target.value)} />
                        </div>
                     </div>
                     <div className="w-full lg:w-fit">
                        <Menu>
                           <MenuButton className="w-full">
                              <div className="flex items-center border gap-6 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white">
                                 <div className="capitalize font-medium text-size-2">Daily</div>
                                 <FontAwesomeIcon size="lg" icon={faChevronDown} />
                              </div>
                           </MenuButton>
                           <MenuItems anchor="bottom" className="w-[110px] bg-white py-2 lg:py-4 rounded-lg mt-[2px] px-4">
                              <MenuItem>
                                 <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Daily</div>
                              </MenuItem>
                              <MenuItem>
                                 <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Weekly</div>
                              </MenuItem>
                              <MenuItem>
                                 <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Monthly</div>
                              </MenuItem>
                           </MenuItems>
                        </Menu>
                     </div>
                  </div>
               </div>
               <div className="mt-12 px-12 flex items-center w-full gap-12 text-white text-size-4">
                  <div className={`cursor-pointer ${activeTab === 'games' ? 'underline' : ''}`} onClick={() => handleTabChange('games')}>Raffle Games</div>
                  <div className={`cursor-pointer ${activeTab === 'products' ? 'underline' : ''}`} onClick={() => handleTabChange('products')}>Raffle Products</div>
                  <div className={`cursor-pointer ${activeTab === 'sales' ? 'underline' : ''}`} onClick={() => handleTabChange('sales')}>Sales Overview</div>
                  <div className={`cursor-pointer ${activeTab === 'transaction' ? 'underline' : ''}`} onClick={() => handleTabChange('transaction')}>Transaction History</div>
               </div>

               <div className="flex flex-col mt-12 px-12">
                  {activeTab == 'games' && (
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">QR ID</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product</th> 
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Image</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Category</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Type</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Price</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                        {
                           records.map((rec: any) => (
                           <tr key={rec._id}>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.invoice_number}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.productWithInvoice && rec.productWithInvoice.length > 0 ? rec.productWithInvoice[0].name : 'None'}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                                 <img className="max-w-[60px] mx-auto" src={rec.productWithInvoice && rec.productWithInvoice.length > 0 ? rec.productWithInvoice[0].image : ''} alt="" />
                              </td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.gameWithInvoice && rec.gameWithInvoice.length > 0 ? rec.gameWithInvoice[0].name : 'None'}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.gameWithInvoice && rec.gameWithInvoice.length > 0 ? rec.gameWithInvoice[0].type : 'None'}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.createdAt}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED {rec.total_amount}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.invoice_status}</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => handleShowInvoice(rec._id)} type="button" className="flex items-center justify-center px-3 border-[2px] bg-white text-themeone font-bold border-themeone rounded py-2">
                                       Invoice
                                    </button>
                                 </div>
                              </td>
                           </tr>
                           ))
                        }
                        </tbody>
                     </table>
                  )}

                  {activeTab == 'products' && (
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">QR ID</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product</th> 
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Image</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Prize Name</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Price</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                        {
                           records.map((rec: any) => ( 
                           <tr key={rec._id}>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.invoice_number}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Product name</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">
                                 <img className="max-w-[60px] mx-auto" src="/assets/images/cap.svg" alt="" />
                              </td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">iPhone</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.createdAt}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED {rec.total_amount}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.invoice_status}</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => handleShowInvoice(rec._id)} type="button" className="flex items-center justify-center px-3 border-[2px] bg-white text-themeone font-bold border-themeone rounded py-2">
                                       Invoice
                                    </button>
                                 </div>
                              </td>
                           </tr>
                           ))
                        }
                        </tbody>
                     </table>
                  )}
                  
                  {activeTab == 'sales' && (
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tl rounded-bl">Total Sales</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Total Orders</th> 
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winning Orders</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Merchant %</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Yalla Win %</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Payment Status</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                        {
                           records.map((rec: any) => (
                              <tr key={rec._id}>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED {rec.total_sales}</td>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.total_orders}</td>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.winning_orders}</td>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED {rec.merchant_percentage}</td>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED {rec.our_percentage}</td>
                                 <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.payment_status}</td>
                                 <td>
                                    <div className="flex items-center justify-center gap-2">
                                       <button type="button" onClick={() => openEditPopup(rec._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                          <FontAwesomeIcon size="lg" icon={faPencil} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        }

                        </tbody>
                     </table>
                  )}
                  
                  {activeTab == 'transaction' && (
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                           <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Trasnaction #</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Payment</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Via</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Card No</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Amount</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Note</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                        {
                           records.map((rec: any, index: any) => (
                           <tr key={rec._id}>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{index + 1}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.payment_type}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.via}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.card_details}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED {rec.amount}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.createdAt}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{rec.note}</td>
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
         )}

         {showInvoice && (
            <div className="flex flex-col flex-grow gap-12">
               <div className="flex flex-col flex-grow">
                  <div onClick={() => setShowInvoice(false)} className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
                     <div className="cursor-pointer">
                        <FontAwesomeIcon size="xl" icon={faArrowLeft} />
                     </div>
                     <div className="cursor-pointer text-head-3 font-medium">View Details</div>
                  </div>
               </div>
               <div className="flex flex-col gap-2 lg:gap-4 w-full">
                  <div className="flex flex-row gap-4 text-white text-size-3 lg:text-size-4 mx-auto text-center">
                     <div className={`cursor-pointer ${activeInvoiceTab === 'invoice' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('invoice')}>Invoice</div>
                     <div className={`cursor-pointer ${activeInvoiceTab === 'ticket' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('ticket')}>Ticket</div>
                  </div>
                  <div className="bg-white w-full lg:w-1/2 mx-auto mt-4 py-4 lg:py-8">
                     {activeInvoiceTab == 'invoice' && (
                        <>
                           <div className="mx-auto w-fit">
                              <img src="/assets/images/logo.svg" alt="" />
                           </div>
                           <div className="bg-custom-purple text-darkone font-noto-sans-black text-head-3 lg:text-big-four uppercase text-center py-2 lg:py-4 mt-4">Invoice</div>
                           <div className="flex flex-col px-8 lg:px-12 font-light text-sm lg:text-size-2 text-black my-4 lg:my-8 gap-2 lg:gap-4">
                              <div className="flex justify-between">
                                 <div>Game Name</div>
                                 <div>Yalla 3</div>
                              </div>
                              
                              <div className="flex justify-between">
                                 <div>Order Number</div>
                                 <div>378378728723</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>VAT %</div>
                                 <div>12</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Total Amount</div>
                                 <div>133 AED</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Order Date</div>
                                 <div>28 July, 2024 8:22 PM*</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Order Status</div>
                                 <div className="text-success">In Progress</div>
                              </div>
                           </div>
                           <div className="flex flex-col items-center gap-2 mt-4">
                              <img src="/assets/images/barcode.svg" alt="" />
                              <div className="font-light text-sm lg:text-size-2">728188278172981</div>
                           </div>
                        </>
                     )}
                     
                     {activeInvoiceTab == 'ticket' && (
                        <>
                           <div className="mx-auto w-fit">
                              <img src="/assets/images/logo.svg" alt="" />
                           </div>
                           <div className="bg-custom-purple text-darkone font-noto-sans-black text-head-3 lg:text-big-four uppercase text-center py-2 lg:py-4 mt-4">Yalla 4</div>
                           <div className="flex flex-col px-8 lg:px-12 font-light text-sm lg:text-size-2 text-black my-4 lg:my-8 gap-6">
                              <div className="w-fit mx-auto">
                                 <img className="max-h-[100px] lg:max-h-[200px]" src="/assets/images/keychain.svg" alt="" />
                              </div>
                              <div className="flex flex-col gap-2 lg:gap-4">
                                 <div className="flex justify-between">
                                    <div>Order Number</div>
                                    <div>37319082192</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>Game Name</div>
                                    <div>Yalla 3</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>VAT %</div>
                                    <div>12</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>Total Amount</div>
                                    <div>123 AED</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>Order Date</div>
                                    <div>28 July, 2024 8:22 PM</div>
                                 </div>
                                 <div className="flex justify-between">
                                    <div>Order Status</div>
                                    <div className="text-success">Active</div>
                                 </div>
                              </div>
                              
                              <div className="grid grid-cols-4 lg:grid-cols-4 mt-4 lg:text-size-1 text-xs">
                                 <div className="flex flex-col gap-2 items-center">
                                    <div className="font-medium lg:font-bold uppercase">Numbers</div>
                                    <div className="font-light">7498</div>
                                 </div>
                                 <div className="flex flex-col gap-2 items-center">
                                    <div className="font-medium lg:font-bold uppercase">Straight</div>
                                    <div className="font-light">1</div>
                                 </div>
                                 <div className="flex flex-col gap-2 items-center">
                                    <div className="font-medium lg:font-bold uppercase">Rumble</div>
                                    <div className="font-light">1</div>
                                 </div>
                                 <div className="flex flex-col gap-2 items-center">
                                    <div className="font-medium lg:font-bold uppercase">Chance</div>
                                    <div className="font-light">1</div>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col items-center gap-2 mt-4">
                              <img src="/assets/images/barcode.svg" alt="" />
                              <div className="font-light text-sm lg:text-size-2">73817298172891</div>
                           </div>
                        </>
                     )}
                  </div>
                  <button className="text-center text-themeone bg-white mx-auto mt-8 font-semibold shadow-custom-1 rounded-full py-3 px-16 w-fit">Print</button>
               </div>
            </div>
         )}

         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Sales Overview</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Total Sales</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text"
                        value={form.total_sales}
                        onChange={(e) => updateForm({ total_sales: e.target.value })} />
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Total Orders</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text"
                        value={form.total_orders}
                        onChange={(e) => updateForm({ total_orders: e.target.value })} />
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Winning Orders</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder=""
                        value={form.winning_orders}
                        onChange={(e) => updateForm({ winning_orders: e.target.value })} />
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Merchant %</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder=""
                        value={form.merchant_percentage}
                        onChange={(e) => updateForm({ merchant_percentage: e.target.value })} />
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Our %</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder=""
                        value={form.our_percentage}
                        onChange={(e) => updateForm({ our_percentage: e.target.value })} />
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Payment Status</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder=""
                        value={form.payment_status}
                        onChange={(e) => updateForm({ payment_status: e.target.value })} />
                     </div>
                  </div>
                  <div className="flex items-center ml-auto gap-6">
                     <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={onSubmit}>Save</button>
                  </div>
               </div>
            </div>
         </Modal>
      </section>
   )
}
