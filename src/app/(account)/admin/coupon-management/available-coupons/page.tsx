'use client'

import React, { useEffect, useRef, useState } from 'react'
import { faChevronLeft, faChevronRight, faCommentAlt, faEye, faImage, faPencil, faPlus, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'

type Tab = 'shop' | 'app' | 'website'

export default function AdminAvailableCoupons() {

   const [activeTab, setActiveTab] = useState<Tab>('shop')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   const [toggled, setToggled] = useState(false)
   var coupon_type:any = 'shop';

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
      coupon_type = tab;
      getCoupons();
   }

   const handleToggle = () => {
      setToggled(!toggled)
   }

   const handleCouponActionClick = (action: 'add' | 'edit') => {

      {/* manipulate modal as per the action */}
      setModalIsOpen(true)
   }
   
   const handleDelete = (id: string | number) => {
      setModalTwoIsOpen(true)
   }

   var [id, setId] = useState("");

   var [form, setForm] = useState({
      coupon_code: "",
      price: "",
      date_only: "",
      time_only: "",
      date: "",

      coupon_code_error: "",
      price_error: "",
      date_only_error: "",
      time_only_error: "",
      server_error: "",
      server_success: ""
   });

   function openCreatePopup() {
      setForm({
         coupon_code: "",
         price: "",
         date_only: "",
         time_only: "",
         date: "",

         coupon_code_error: "",
         price_error: "",
         date_only_error: "",
         time_only_error: "",
         server_error: "",
         server_success: ""
      });
      setId('');
      setModalIsOpen(true);
   }

   async function openEditPopup(coupon_id: any) {
      setId(coupon_id);
      var url = '/api/admin/coupon-management/available-coupons?id=' + coupon_id;
      let response = await fetch(url, {
         method: 'PATCH',
      });
      const content = await response.json();
      if(!response.ok) {

      } else {

         setForm({
            coupon_code: content.coupon.coupon_code,
            price: content.coupon.price,
            date_only: content.coupon.date_only,
            time_only: content.coupon.time_only,
            date: content.coupon.date,
      
            coupon_code_error: "",
            price_error: "",
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
         coupon_code_error: "",
         price_error: "",
         date_only_error: "",
         time_only_error: "",
         server_error: "",
         server_success: ""
      };
      var is_error = false;

      // Validation logic
      if (form.coupon_code === '') {
         err['coupon_code_error'] = 'Coupon Code is Required';
         is_error = true;
      }

      if (form.price === '') {
         err['price_error'] = 'Price is Required';
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
         formData.append('coupon_code', form.coupon_code);
         formData.append('price', form.price);
         formData.append('date_only', form.date_only);
         formData.append('time_only', form.time_only);
         formData.append('date', form.date_only + " " + form.time_only);
         formData.append('type', activeTab);

         var url = '/api/admin/coupon-management/available-coupons';
         var method = 'POST';
         var success_message = 'Coupon created successfully.';
         if(id !== "") {
            url = '/api/admin/coupon-management/available-coupons?id=' + id;
            method = 'PUT';
            success_message = 'Coupon updated successfully.';
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
               coupon_type = activeTab;
               getTotalRecords();
            }
         } catch (error) {
            setForm((prev) => {
               return { ...prev, server_error: `A problem occurred with your fetch operation: ${error}` };
            });
         }
      }
   }

   var [coupons, setCoupons] = useState<any>([]);

   useEffect(() => {
      getTotalRecords()
   }, [])

   var [shop_coupons_count, setShopCouponsCount] = useState(0);
   var [app_coupons_count, setAppCouponsCount] = useState(0);
   var [web_coupons_count, setWebCouponsCount] = useState(0);
   var skip = 0;

   var getTotalRecords = async() => {
      try {
         let response = await fetch('/api/admin/coupon-management/available-coupons', {
            method: 'OPTIONS',
         });
         var content = await response.json();
         if(!response.ok) {

         } else {
            setShopCouponsCount(content.shop_coupons_count)
            setAppCouponsCount(content.app_coupons_count)
            setWebCouponsCount(content.web_coupons_count)
            getCoupons();
         }
      } catch (error) {
         
      }
   }

   var getCoupons = async() => {
      try {
         let response = await fetch('/api/admin/coupon-management/available-coupons?type=' + coupon_type + '&skip=' + skip + '&limit=' + recordsPerPage, {
            method: 'GET',
         });
         var content = await response.json();

         if(!response.ok) {

         } else {
            setCoupons(content.coupons)
         }

      } catch (error) {
      }
   }

   function setIdAndOpenDeletePopup(Id: any) {
      setId(Id);
      setModalTwoIsOpen(true);
   }

   var deleteCoupon = async() => {
      let response = await fetch('/api/admin/coupon-management/available-coupons?id=' + id, {
         method: 'DELETE',
      });
      var content = await response.json();
      setId('');
      setModalTwoIsOpen(false)

      if(!response.ok) {

      } else {
         coupon_type = activeTab;
         getTotalRecords();
      }
   } 

   var totalPages = 0;
   var [currentPage, setCurrentPage] = useState(1);
   var [recordsPerPage, setRecordsPerPages] = useState(5);

   if(activeTab === 'shop') {
      console.log('shop_coupons_count: ', shop_coupons_count)
      totalPages = shop_coupons_count;
   } else if(activeTab === 'app') {
      totalPages = app_coupons_count;
   } else if(activeTab === 'website') {
      totalPages = web_coupons_count;
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
      getCoupons()
      setCurrentPage(current_page);
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col w-full h-full">
            <div className="flex flex-col gap-4 lg:flex-row w-full">
               <div className="flex items-center w-full lg:max-w-[60%] border-[2px] border-white text-white font-bold text-size-4">
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'shop' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('shop')}>Shop Coupons</div>
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'app' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('app')}>App Coupons</div>
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'website' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('website')}>Website Coupons</div>
               </div>
               <button type="button" onClick={() => openCreatePopup()} className="flex items-center border gap-3 lg:border-[3px] white-space-nowrap border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                  <FontAwesomeIcon size="lg" icon={faPlus} />
                  <div className="capitalize font-medium text-size-2">Add New Coupon</div>
               </button>
            </div>
            <div className="flex flex-col mt-12">
               
               {//activeTab == 'shop' && (
                  <>
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-bl rounded-tl">ID</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Coupon Code</th> 
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Price</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Limit / Date</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">

                        {
                           coupons.map((coupon: any, index: any) => (
                           <tr key={coupon._id}>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{index + 1}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{coupon.coupon_code}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED {coupon.price}</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{coupon.date}</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => openEditPopup(coupon._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faPencil} />
                                    </button>
                                    <div className="flex items-center gap-2 lg:gap-3 px-2 border-[2px] border-white rounded py-2">
                                       <div className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer" onClick={handleToggle}>
                                          <div className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${toggled ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                                       </div>
                                    </div>
                                    <button type="button" onClick={() => setIdAndOpenDeletePopup(coupon._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
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
                  </>
               //)
               }

               {activeTab == 'app' && (
                  <>
                     {/*<table className="w-full">
                        <thead>
                           <tr className="bg-white">
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-bl rounded-tl">ID</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Coupon Code</th> 
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Username</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Price</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Expiration</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Purchase Time</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                              <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           <tr>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">123</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">3728d73823dd</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">abc</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">AED 1234</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024 - 09:00AM</td>
                              <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Active</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => handleCouponActionClick('edit')} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faPencil} />
                                    </button>
                                    <div className="flex items-center gap-2 lg:gap-3 px-2 border-[2px] border-white rounded py-2">
                                       <div className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer" onClick={handleToggle}>
                                          <div className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${toggled ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                                       </div>
                                    </div>
                                    <button type="button" onClick={() => handleDelete(123)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faTrashAlt} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                     <div className="font-poppins-medium mt-6 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer">
                           <FontAwesomeIcon size="1x" icon={faChevronLeft} />
                        </div>
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer">1</div>
                        <div className="px-4 py-2 text-black bg-white flex items-center justify-center cursor-pointer">2</div>
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer">3</div>
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer">
                           <FontAwesomeIcon size="1x" icon={faChevronRight} />
                        </div>
                     </div>*/}
                  </>
               )}
               
               {activeTab == 'website' && (
                  <></>
               )}

            </div>
         </div>

         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Add New Coupon</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Coupon Code</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text"
                        value={form.coupon_code}
                        onChange={(e) => updateForm({ coupon_code: e.target.value })} />
                     </div>
                     {
                        form.coupon_code_error !== '' && (
                           <span style={{color: "red"}}>{form.coupon_code_error}</span>
                        )
                     }

                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Price</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text"
                        value={form.price}
                        onChange={(e) => updateForm({ price: e.target.value })} />
                     </div>

                     {
                        form.price_error !== '' && (
                           <span style={{color: "red"}}>{form.price_error}</span>
                        )
                     }

                  </div>


                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  <button className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={deleteCoupon}>Delete</button>
               </div>
            </div>
         </Modal>
      </section>
   )
}
