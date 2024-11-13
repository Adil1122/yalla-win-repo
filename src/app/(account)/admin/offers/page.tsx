'use client'

import React, { useEffect, useRef, useState } from 'react'
import { faChevronLeft, faChevronRight, faCommentAlt, faEye, faImage, faPencil, faPlus, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
//import Product from '@/app/(site)/product/[id]/page'

type Tab = 'app-web' | 'merchant'
type TabTwo = 'games' | 'products'

export default function AdminUpDrawsManagement() { 

   const [activeTab, setActiveTab] = useState<Tab>('app-web')
   const [activeTabTwo, setActiveTabTwo] = useState<TabTwo>('games')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   //const [modalThreeIsOpen, setModalThreeIsOpen] = useState<boolean>(false)
   const [toggled, setToggled] = useState(false)
   const [productDetails, setProductDetails] = useState([{ size: '', image: '' }])

   var offer_type = 'games'
   var platform_type = 'app-web'
   var skip = 0
   //var limit = 5


   const handleTabChange = (tab: Tab) => {
      platform_type = tab
      offer_type = activeTabTwo
      skip = 0
      setActiveTab(tab)
      getTotalRecords()
   }

   const handleTabTwoChange = (tab: TabTwo) => {
      platform_type = activeTab
      offer_type = tab
      skip = 0
      setActiveTabTwo(tab)
      getTotalRecords()
   }

   /*const handleToggle = () => {
      setToggled(!toggled)
   }

   const handleGameActionClick = (action: 'add' | 'edit') => {

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
   }*/

   
   var [id, setId] = useState("");

   var [form, setForm] = useState({
      name: "",
      game_id: "",
      //game_name: "",
      product_id: "",
      free_qty: "",
      platform_type: "",
      offer_type: "",
      start_date: "",
      expiry_date: "",
      status: "",

      name_error: "",
      game_id_error: "",
      product_id_error: "",
      start_date_error: "",
      expiry_date_error: "",
      status_error: "",

      server_error: "",
      server_success: ""
   });

   function openCreatePopup() {
      setForm({
         name: "",
         game_id: "",
         //game_name: "",
         product_id: "",
         free_qty: "",
         platform_type: "",
         offer_type: "",
         start_date: "",
         expiry_date: "",
         status: "",

         name_error: "",
         game_id_error: "",
         product_id_error: "",
         start_date_error: "",
         expiry_date_error: "",
         status_error: "",

         server_error: "",
         server_success: ""
      });
      setId('');
      setModalIsOpen(true);
   }

   async function openEditPopup(notif_id: any) {
      setId(notif_id);
      var url = '/api/admin/offers?id=' + notif_id;
      let response = await fetch(url, {
         method: 'PATCH',
      });
      const content = await response.json();
      if(!response.ok) {

      } else {

         setForm({

            name: content.record.name,
            game_id: content.record.game_id,
            //game_name: content.record.game_name,
            product_id: content.record.product_id,
            free_qty: content.record.free_qty,
            platform_type: content.record.platform_type,
            offer_type: content.record.offer_type,
            start_date: content.record.start_date,
            expiry_date: content.record.expiry_date,
            status: content.record.status,

            name_error: "",
            game_id_error: "",
            product_id_error: "",
            start_date_error: "",
            expiry_date_error: "",
            status_error: "",

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
         start_date_error: "",
         expiry_date_error: "",
         status_error: "",
      };
      var is_error = false;

      // Validation logic
      if (form.name === '') {
         err['name_error'] = 'Name is Required';
         is_error = true;
      }

      if (activeTabTwo === 'games' && form.game_id === '') {
         err['game_id_error'] = 'Game is Required';
         is_error = true;
      }

      if (activeTabTwo === 'products' && form.product_id === '') {
         err['product_id_error'] = 'Product is Required';
         is_error = true;
      }

      if (form.start_date === '') {
         err['start_date_error'] = 'Start Date is Required';
         is_error = true;
      }

      if (form.expiry_date === '') {
         err['expiry_date_error'] = 'Expiry Date is Required';
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
         formData.append('name', form.name);
         formData.append('start_date', form.start_date);
         formData.append('expiry_date', form.expiry_date);
         formData.append('offer_type', activeTabTwo);
         formData.append('platform_type', activeTab);

         if(activeTabTwo === 'games') {
            formData.append('game_id', form.game_id);
            //formData.append('game_name', form.game_name);
         } else {
            formData.append('product_id', form.product_id);
         }

         var url = '/api/admin/offers';
         var method = 'POST';
         var success_message = 'Record created successfully.';
         if(id !== "") {
            url = '/api/admin/offers?id=' + id;
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
               offer_type = activeTabTwo;
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

   var [app_web_games_offer_count, setAppWebGamesOfferCount] = useState(0)
   var [app_web_products_offer_count, setAppWebProductsOfferCount] = useState(0)
   var [merchant_games_offer_count, setMerchantGamesOfferCount] = useState(0)
   var [merchant_products_offer_count, setMerchantProductsOfferCount] = useState(0)
   var [games, setGames] = useState([])
   var [products, setProducts] = useState([])

   async function getTotalRecords() {
      try {
         let response = await fetch('/api/admin/offers?offer_type=' + offer_type, {
            method: 'OPTIONS',
         });
         var content = await response.json();
         if(!response.ok) {

         } else {
            setAppWebGamesOfferCount(content.app_web_games_offer_count)
            setAppWebProductsOfferCount(content.app_web_products_offer_count)
            setMerchantGamesOfferCount(content.merchant_games_offer_count)
            setMerchantProductsOfferCount(content.merchant_products_offer_count)
            setGames(content.games)
            setProducts(content.products)
            getRecords();
         }
      } catch (error) {
         
      }
   }

   async function getRecords() {
      try {
         let response = await fetch('/api/admin/offers?offer_type=' + offer_type + '&platform_type=' + platform_type + '&skip=' + skip + '&limit=' + recordsPerPage, {
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
      let response = await fetch('/api/admin/offers?id=' + id, {
         method: 'DELETE',
      });
      var content = await response.json();
      setId('');
      setModalTwoIsOpen(false)

      if(!response.ok) {

      } else {
         offer_type = activeTabTwo;
         platform_type = activeTab;
         getTotalRecords();
      }
   } 

   var totalPages = 0;
   var [currentPage, setCurrentPage] = useState(1);
   var [recordsPerPage, setRecordsPerPages] = useState(5);

   if(activeTab === 'app-web' && activeTabTwo === 'games') {
      totalPages = app_web_games_offer_count;
   } else if(activeTab === 'merchant' && activeTabTwo === 'products') {
      totalPages = merchant_games_offer_count;
   } else if(activeTab === 'app-web' && activeTabTwo === 'products') {
      totalPages = app_web_products_offer_count;
   } else if(activeTab === 'merchant' && activeTabTwo === 'products') {
      totalPages = merchant_products_offer_count;
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
      offer_type = activeTabTwo
      platform_type = activeTab
      getRecords()
      setCurrentPage(current_page);
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
               <div className={`cursor-pointer ${activeTabTwo === 'games' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('games')}>Games</div>
               <div className={`cursor-pointer ${activeTabTwo === 'products' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('products')}>Raffle Products</div>
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
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-bl rounded-tl">Offer Name</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Start Date</th> 
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">End Date</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                  {
                     records.map((record: any) => (
                     <tr key={record._id}>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{record.name}</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{record.start_date}</td>
                        <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{record.expiry_date}</td>
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
                     <div className="text-darkone text-size-4">Offer Name</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <select className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" 
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value })}>
                           <option value="">Select Offer</option>
                           <option value="Buy One Get One">Buy One Get One</option>
                           <option value="Buy One Get Two">Buy One Get Two</option>
                           <option value="Buy One Get Three">Buy One Get Three</option>
                           <option value="Buy One Get Four">Buy One Get Four</option>
                        </select>

                     </div>
                     {
                        form.name_error !== '' && (
                           <span style={{color: "red"}}>{form.name_error}</span>
                        )
                     }
                  </div>

                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">{activeTabTwo === 'games' ? 'Game' : 'Product'} Name</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">

                        {
                           activeTabTwo === 'games' ?
                           <select className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" value={form.game_id} onChange={(e) => updateForm({ game_id: e.target.value })}>
                              <option value="">Select Game</option>
                              {
                                 games.map((game: any) => (
                                    <option key={game._id} value={game._id}>{game.name}</option>
                                 ))
                              }
                           </select>
                           :
                           <select className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" value={form.product_id} onChange={(e) => updateForm({ product_id: e.target.value })}>
                              <option value="">Select Product</option>
                              {
                                 products.map((product: any) => (
                                    <option key={product._id} value={product._id}>{product.name}</option>
                                 ))
                              }
                           </select>
                        }
                        
                     </div>

                     {
                        form.game_id_error !== '' && (
                           <span style={{color: "red"}}>{form.game_id_error}</span>
                        )
                     }

                  </div>
                  <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Start Date</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="date"
                           value={form.start_date}
                           onChange={(e) => updateForm({ start_date: e.target.value })} />
                        </div>
                        {
                           form.start_date_error !== '' && (
                              <span style={{color: "red"}}>{form.start_date_error}</span>
                           )
                        }
                  </div>

                  <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Expiry Date</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="date"
                           value={form.expiry_date}
                           onChange={(e) => updateForm({ expiry_date: e.target.value })} />
                        </div>
                        {
                           form.expiry_date_error !== '' && (
                              <span style={{color: "red"}}>{form.expiry_date_error}</span>
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
