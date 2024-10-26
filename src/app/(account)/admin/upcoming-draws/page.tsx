'use client'

import React, { useEffect, useRef, useState } from 'react'
import { faChevronLeft, faChevronRight, faCommentAlt, faEye, faImage, faPencil, faPlus, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import Product from '@/app/(site)/product/[id]/page'

type Tab = 'app-web' | 'merchant'
type TabTwo = 'games' | 'products'

export default function AdminUpDrawsManagement() { 

   const [activeTab, setActiveTab] = useState<Tab>('app-web')
   const [activeTabTwo, setActiveTabTwo] = useState<TabTwo>('games')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   const [modalThreeIsOpen, setModalThreeIsOpen] = useState<boolean>(false)
   const [toggled, setToggled] = useState(false)
   const [productDetails, setProductDetails] = useState([{ size: '', image: '' }])

   var draw_type = 'games'
   var platform_type = 'app-web'
   var skip = 0
   var limit = 5


   const handleTabChange = (tab: Tab) => {
      platform_type = tab
      draw_type = activeTabTwo
      skip = 0
      setActiveTab(tab)
      getTotalRecords()
   }

   const handleTabTwoChange = (tab: TabTwo) => {
      platform_type = activeTab
      draw_type = tab
      skip = 0
      setActiveTabTwo(tab)
      getTotalRecords()
   }

   const handleToggle = () => {
      setToggled(!toggled)
   }

   const handleGameActionClick = (action: 'add' | 'edit') => {

      {/* manipulate modal as per the action */}
      setModalIsOpen(true)
   }
   
   const handleDelete = (id: string | number) => {
      setModalTwoIsOpen(true)
   }

   const handleAddDetails = () => {
      setProductDetails([...productDetails, { size: '', image: '' }])
   }

   const handleDeleteRow = (ind: number) => {
      setProductDetails((prevRows) => prevRows.filter((_, index) => index !== ind))
   }

   
   var [id, setId] = useState("");

   var [form, setForm] = useState({
      name: "",
      game_id: "",
      game_name: "",
      prize_name: "",
      product_id: "",
      prize_id: "",
      draw_date: "",
      date_only: "",
      time_only: "",

      name_error: "",
      game_id_error: "",
      product_id_error: "",
      prize_id_error: "",
      date_only_error: "",
      time_only_error: "",

      server_error: "",
      server_success: ""
   });

   function openCreatePopup() {
      setForm({
         name: "",
         game_id: "",
         game_name: "",
         prize_name: "",
         product_id: "",
         prize_id: "",
         draw_date: "",
         date_only: "",
         time_only: "",

         name_error: "",
         game_id_error: "",
         product_id_error: "",
         prize_id_error: "",
         date_only_error: "",
         time_only_error: "",

         server_error: "",
         server_success: ""
      });
      setId('');
      setModalIsOpen(true);
   }

   async function openEditPopup(notif_id: any) {
      setId(notif_id);
      var url = '/api/admin/upcoming-draws?id=' + notif_id;
      let response = await fetch(url, {
         method: 'PATCH',
      });
      const content = await response.json();
      if(!response.ok) {

      } else {

         setForm({
            name: content.record.name,
            game_id: content.record.game_id,
            game_name: content.record.game_name,
            prize_name: content.record.prize_name,
            product_id: content.record.product_id,
            prize_id: content.record.prize_id,
            draw_date: content.record.draw_date,
            date_only: content.record.date_only,
            time_only: content.record.time_only,
      
            name_error: "",
            game_id_error: "",
            product_id_error: "",
            prize_id_error: "",
            date_only_error: "",
            time_only_error: "",

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
         name_error: "",
         game_id_error: "",
         product_id_error: "",
         prize_id_error: "",
         date_only_error: "",
         time_only_error: "",
      };
      var is_error = false;

      // Validation logic
      if (activeTabTwo === 'games' && form.game_id === '') {
         err['game_id_error'] = 'Game is Required';
         is_error = true;
      }

      if (activeTabTwo === 'products' && form.prize_id === '') {
         err['prize_id_error'] = 'Prize is Required';
         is_error = true;
      }

      if (form.product_id === '') {
         err['product_id_error'] = 'Product is Required';
         is_error = true;
      }

      if (form.date_only === '') {
         err['date_only_error'] = 'Date is Required';
         is_error = true;
      }

      if (form.time_only === '') {
         err['time_only_error'] = 'Time is Required';
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
         formData.append('product_id', form.product_id);
         formData.append('date_only', form.date_only);
         formData.append('time_only', form.time_only);
         formData.append('draw_date', form.date_only + " " + form.time_only);
         formData.append('draw_type', activeTabTwo);
         formData.append('platform_type', activeTab);

         if(activeTabTwo === 'games') {
            formData.append('game_id', form.game_id);
            formData.append('game_name', form.game_name);
         }

         if(activeTabTwo === 'products') {
            formData.append('prize_id', form.prize_id);
            formData.append('prize_name', form.prize_name);
         }

         var url = '/api/admin/upcoming-draws';
         var method = 'POST';
         var success_message = 'Record created successfully.';
         if(id !== "") {
            url = '/api/admin/upcoming-draws?id=' + id;
            method = 'PUT';
            success_message = 'Record updated successfully.';
         }

         try {
            let response = await fetch(url, {
               method: method,
               body: formData
            });

            setId('');
            setModalIsOpen(false)

            if (!response.ok) {
               setForm((prev) => {
                  return { ...prev, server_error: `HTTP error! status: ${response.status}` };
               });
            } else {
               setForm((prev) => {
                  return { ...prev, server_success: success_message };
               });
               draw_type = activeTabTwo;
               platform_type = activeTab;
               getTotalRecords();
            }
         } catch (error) {
            setForm((prev) => {
               return { ...prev, server_error: `A problem occurred with your fetch operation: ${error}` };
            });
         }
      }
   }

   var [records, setRecords] = useState<any>([]);

   useEffect(() => {
      getTotalRecords()
   }, [])

   var [app_web_games_draw_count, setAppWebGamesDrawCount] = useState(0)
   var [app_web_products_draw_count, setAppWebProductsDrawCount] = useState(0)
   var [merchant_games_draw_count, setMerchantGamesDrawCount] = useState(0)
   var [merchant_products_draw_count, setMerchantProductsDrawCount] = useState(0)
   var [products, setProducts] = useState<any>([])

   async function getTotalRecords() {
      try {
         let response = await fetch('/api/admin/upcoming-draws?draw_type=' + draw_type, {
            method: 'OPTIONS',
         });
         var content = await response.json();
         if(!response.ok) {

         } else {
            setAppWebGamesDrawCount(content.app_web_games_draw_count)
            setAppWebProductsDrawCount(content.app_web_products_draw_count)
            setMerchantGamesDrawCount(content.merchant_games_draw_count)
            setMerchantProductsDrawCount(content.merchant_products_draw_count)
            setProducts(content.products)
            getRecords();
         }
      } catch (error) {
         
      }
   }

   async function getRecords() {
      try {
         let response = await fetch('/api/admin/upcoming-draws?draw_type=' + draw_type + '&platform_type=' + platform_type + '&skip=' + skip + '&limit=' + recordsPerPage, {
            method: 'GET',
         });
         var content = await response.json();

         if(!response.ok) {

         } else {
            setRecords(content.records)
         }

      } catch (error) {

      }
   }

   function setIdAndOpenDeletePopup(Id: any) {
      setId(Id);
      setModalTwoIsOpen(true);
   }

   var deleteRecord = async() => {
      let response = await fetch('/api/admin/upcoming-draws?id=' + id, {
         method: 'DELETE',
      });
      var content = await response.json();
      setId('');
      setModalTwoIsOpen(false)

      if(!response.ok) {

      } else {
         draw_type = activeTabTwo;
         platform_type = activeTab;
         getTotalRecords();
      }
   } 

   var totalPages = 0;
   var [currentPage, setCurrentPage] = useState(1);
   var [recordsPerPage, setRecordsPerPages] = useState(5);

   if(activeTab === 'app-web' && activeTabTwo === 'games') {
      totalPages = app_web_games_draw_count;
   } else if(activeTab === 'merchant' && activeTabTwo === 'products') {
      totalPages = merchant_games_draw_count;
   } else if(activeTab === 'app-web' && activeTabTwo === 'products') {
      totalPages = app_web_products_draw_count;
   } else if(activeTab === 'merchant' && activeTabTwo === 'products') {
      totalPages = merchant_products_draw_count;
   }
   
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
      draw_type = activeTabTwo
      platform_type = activeTab
      getRecords()
      setCurrentPage(current_page);
   }

   function setSelectedProduct(value: any) {

      var updates: any = {
         product_id: value.product_id,
         prize_id: "",
         game_id: "",
         game_name: "",
         prize_name: "",
      }

      for(var i = 0; i < products.length; i++) {
         if(products[i]._id === value.product_id) {
            if(activeTabTwo === 'games') {
               updates['game_id'] = products[i].game_id
               updates['game_name'] = products[i].gameWithProduct.length > 0 ? products[i].gameWithProduct[0].name : ''
            } else {
               updates['prize_id'] = products[i].prize_id
               updates['prize_name'] = products[i].prizeWithProduct.length > 0 ? products[i].prizeWithProduct[0].name : ''
            }
            break;
         }
      }

      console.log('updates: ', updates)

      setForm((prev) => {
         return { ...prev, ...updates };
      });
      
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col w-full h-full">
            <div className="flex flex-col gap-4 lg:flex-row w-full">
               <div className="flex items-center w-full lg:w-1/2 max-w-xl border-[2px] border-white text-white font-bold text-size-4">
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'app-web' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('app-web')}>App & Web</div>
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'merchant' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('merchant')}>Merchant</div>
               </div>
               <button type="button" onClick={() => openCreatePopup()} className="flex items-center border gap-3 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                  <FontAwesomeIcon size="lg" icon={faPlus} />
                  <div className="capitalize font-medium text-size-2">Add New</div>
               </button>
            </div>
            <div className="flex items-center w-full gap-12 text-white font-bold text-size-4 mt-12">
               <div className={`cursor-pointer ${activeTabTwo === 'games' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('games')}>Upcoming Raffle Games</div>
               <div className={`cursor-pointer ${activeTabTwo === 'products' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('products')}>Upcoming Raffle Products</div>
            </div>
            <div className="flex flex-col mt-6">

               {activeTabTwo == 'games' && (
                  <></>
               )}

               {activeTabTwo == 'products' && (
                  <></>
               )}

               <table className="w-full">
                  <thead>
                     <tr className="bg-white">
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-bl rounded-tl">{activeTabTwo === 'games' ? 'Game Name' : 'Prize Name'}</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th> 
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Time</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                  {
                     records.map((record: any) => (
                     <tr key={record._id}>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{record.draw_type === 'games' ? record.game_name : record.prize_name}</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{record.date_only}</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{record.time_only}</td>
                        <td>
                           <div className="flex items-center justify-center gap-2">
                              <button type="button" onClick={() => openEditPopup(record._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                 <FontAwesomeIcon size="lg" icon={faPencil} />
                              </button>
                              <button type="button" onClick={() => setIdAndOpenDeletePopup(record._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                 <FontAwesomeIcon size="lg" icon={faTrashAlt} />
                              </button>
                           </div>
                        </td>
                     </tr>
                     ))
                  }

                  </tbody>
               </table>
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
                  <div className="text-darkone text-head-2">Add New</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Product Name</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <select className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" value={form.product_id} onChange={(e) => setSelectedProduct({ product_id: e.target.value })}>
                           <option value="">Select {activeTabTwo === 'games' ? 'Game' : 'Prize'} Product</option>
                           {
                              products.map((product: any) => (
                                 <option key={product._id} value={product._id}>{product.name}</option>
                              ))
                           }
                        </select>
                     </div>

                     {
                        form.product_id_error !== '' && (
                           <span style={{color: "red"}}>{form.product_id_error}</span>
                        )
                     }

                  </div>
                  <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Date</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="date"
                           value={form.date_only}
                           onChange={(e) => updateForm({ date_only: e.target.value })} />
                        </div>
                        {
                           form.date_only_error !== '' && (
                              <span style={{color: "red"}}>{form.date_only_error}</span>
                           )
                        }
                  </div>

                  <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Time</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="time"
                           value={form.time_only}
                           onChange={(e) => updateForm({ time_only: e.target.value })} />
                        </div>
                        {
                           form.time_only_error !== '' && (
                              <span style={{color: "red"}}>{form.time_only_error}</span>
                           )
                        }
                  </div>

                  <div className="flex items-center ml-auto gap-6">
                     <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={onSubmit}>Save</button>
                  </div>
               </div>
            </div>
         </Modal>
         
         <Modal open={modalTwoIsOpen} onClose={() => setModalTwoIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
               <div className="text-darkone font-medium text-head-3">Delete</div>
               <div className="text-darkone text-size-4">Are you sure you want to delete this record?</div>
               <div className="flex items-center gap-6 mt-3">
                  <button onClick={() => setModalTwoIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded">Cancel</button>
                  <button className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={deleteRecord}>Delete</button>
               </div>
            </div>
         </Modal>
      </section>
   )
}
