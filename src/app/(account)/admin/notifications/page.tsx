'use client'

import React, { useEffect, useRef, useState } from 'react'
import { faChevronLeft, faChevronRight, faCommentAlt, faDeleteLeft, faEye, faImage, faPaperPlane, faPencil, faPlus, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'

type Tab = 'app-web' | 'merchant'
type TabTwo = 'new' | 'past'

export default function AdminNotifications() {

   const [activeTab, setActiveTab] = useState<Tab>('merchant')
   const [activeTabTwo, setActiveTabTwo] = useState<TabTwo>('new')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)

   var new_past: any = 'new';
   var notification_type:any = 'merchant';

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
      notification_type = tab;
      new_past = activeTabTwo;
      getNotifications()
   }
   
   const handleTabTwoChange = (tab: TabTwo) => {
      setActiveTabTwo(tab)
      new_past = tab;
      notification_type = activeTab;
      getNotifications()
   }

   

   var [id, setId] = useState("");

   var [form, setForm] = useState({
      title: "",
      content: "",
      date: "",
      time: "",
      notification_date: "",

      title_error: "",
      content_error: "",
      date_error: "",
      time_error: "",
      server_error: "",
      server_success: ""
   });

   function openCreatePopup() {
      setForm({
         title: "",
         content: "",
         date: "",
         time: "",
         notification_date: "",
   
         title_error: "",
         content_error: "",
         date_error: "",
         time_error: "",
         server_error: "",
         server_success: ""
      });
      setId('');
      setModalIsOpen(true);
   }

   async function openEditPopup(notif_id: any) {
      setId(notif_id);
      var url = '/api/admin/notifications?id=' + notif_id;
      let response = await fetch(url, {
         method: 'PATCH',
      });
      const content = await response.json();
      if(!response.ok) {

      } else {

         setForm({
            title: content.notification.title,
            content: content.notification.content,
            date: content.notification.date,
            time: content.notification.time,
            notification_date: content.notification.notification_date,
      
            title_error: "",
            content_error: "",
            date_error: "",
            time_error: "",
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
         title_error: "",
         content_error: "",
         date_error: "",
         time_error: "",
      };
      var is_error = false;

      // Validation logic
      if (form.title === '') {
         err['title_error'] = 'Title is Required';
         is_error = true;
      }

      if (form.content === '') {
         err['content_error'] = 'Content is Required';
         is_error = true;
      }

      if (form.date === '') {
         err['date_error'] = 'Date is Required';
         is_error = true;
      }

      if (form.time === '') {
         err['time_error'] = 'Time is Required';
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
         formData.append('title', form.title);
         formData.append('content', form.content);
         formData.append('date', form.date);
         formData.append('time', form.time);
         formData.append('notification_date', form.date + " " + form.time);
         formData.append('type', activeTab);

         var url = '/api/admin/notifications';
         var method = 'POST';
         var success_message = 'Notification created successfully.';
         if(id !== "") {
            url = '/api/admin/notifications?id=' + id;
            method = 'PUT';
            success_message = 'Notification updated successfully.';
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
               new_past = activeTabTwo;
               notification_type = activeTab;
               getTotalRecords();
            }
         } catch (error) {
            setForm((prev) => {
               return { ...prev, server_error: `A problem occurred with your fetch operation: ${error}` };
            });
         }
      }
   }

   var [notifications, setNotifications] = useState<any>([]);

   useEffect(() => {
      getTotalRecords()
   }, [])

   var [new_merchant_notifications_count, setNewMerchantNotificationsCount] = useState(0);
   var [new_app_web_notifications_count, setNewAppWebNotificationsCount] = useState(0);
   var [old_merchant_notifications_count, setOldMerchantNotificationsCount] = useState(0);
   var [old_app_web_notifications_count, setOldAppWebNotificationsCount] = useState(0);
   var skip = 0;

   var getTotalRecords = async() => {
      try {
         let response = await fetch('/api/admin/notifications', {
            method: 'OPTIONS',
         });
         var content = await response.json();
         if(!response.ok) {

         } else {
            setNewMerchantNotificationsCount(content.new_merchant_notifications_count)
            setNewAppWebNotificationsCount(content.new_app_web_notifications_count)
            setOldMerchantNotificationsCount(content.old_merchant_notifications_count)
            setOldAppWebNotificationsCount(content.old_app_web_notifications_count)
            /*new_merchant_notifications_count = content.new_merchant_notifications_count
            new_app_web_notifications_count = content.new_app_web_notifications_count
            old_merchant_notifications_count = content.old_merchant_notifications_count
            old_app_web_notifications_count = content.old_app_web_notifications_count*/
            getNotifications();
         }
      } catch (error) {
         
      }
   }

   var getNotifications = async() => {
      try {
         let response = await fetch('/api/admin/notifications?type=' + notification_type + '&new_past=' + new_past + '&skip=' + skip + '&limit=' + recordsPerPage, {
            method: 'GET',
         });
         var content = await response.json();

         if(!response.ok) {

         } else {
            setNotifications(content.notifications)
         }

      } catch (error) {
      }
   }

   function setIdAndOpenDeletePopup(Id: any) {
      setId(Id);
      setModalTwoIsOpen(true);
   }

   var deleteNotification = async() => {
      let response = await fetch('/api/admin/notifications?id=' + id, {
         method: 'DELETE',
      });
      var content = await response.json();
      setId('');
      setModalTwoIsOpen(false)

      if(!response.ok) {

      } else {
         new_past = activeTabTwo;
         notification_type = activeTab;
         getTotalRecords();
      }
   } 

   var totalPages = 0;
   var [currentPage, setCurrentPage] = useState(1);
   var [recordsPerPage, setRecordsPerPages] = useState(5);

   //var lastIndex = currentPage * recordsPerPage;
   //var firstIndex = lastIndex - recordsPerPage;
   //var currentRecords = notifications.slice(firstIndex, lastIndex);

   if(activeTab === 'merchant' && activeTabTwo === 'new') {
      console.log('merchant/new/' + new_merchant_notifications_count);
      totalPages = new_merchant_notifications_count;
   } else if(activeTab === 'merchant' && activeTabTwo === 'past') {
      console.log('merchant/past/' + old_merchant_notifications_count);
      totalPages = old_merchant_notifications_count;
   } else if(activeTab === 'app-web' && activeTabTwo === 'new') {
      console.log('app-web/new/' + new_app_web_notifications_count);
      totalPages = new_app_web_notifications_count;
   } else if(activeTab === 'app-web' && activeTabTwo === 'past') {
      console.log('app-web/past/' + old_app_web_notifications_count);
      totalPages = old_app_web_notifications_count;
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
      getNotifications()
      setCurrentPage(current_page);
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col w-full h-full">
            <div className="flex flex-col gap-4 lg:flex-row w-full">
               <div className="flex items-center w-full lg:w-1/2 max-w-xl border-[2px] border-white text-white font-bold text-size-4">
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'merchant' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('merchant')}>Merchant</div>
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'app-web' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('app-web')}>App & Web</div>
               </div>
               <button type="button" onClick={() => openCreatePopup()} className="flex items-center border gap-3 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                  <FontAwesomeIcon size="lg" icon={faPlus} />
                  <div className="capitalize font-medium text-size-2">Create New</div>
               </button>
            </div>
            <div className="flex items-center w-full gap-12 text-white font-bold text-size-4 mt-12">
               <div className={`cursor-pointer ${activeTabTwo === 'new' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('new')}>New Notifications</div>
               <div className={`cursor-pointer ${activeTabTwo === 'past' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('past')}>Past Notifications</div>
            </div>
            <div className="flex flex-col mt-6">

                  
               <div className="flex flex-col gap-12">
                  {
                     notifications.map((notification: any) => (
                        
                        <div key={notification._id} className="flex flex-col py-4 px-6 bg-light-background-three backdrop-blur-64 text-white gap-4">
                           <div className="text-size-2 font-medium">{notification.title}</div>
                           <div key={notification._id + '0'} className="flex items-center gap-8">
                              <div className="bg-white rounded text-darkone px-6 py-4 w-full text-size-2">
                                 {notification.content}
                              </div>
                              <div className="flex items-center gap-4">
                                 <button type="button" onClick={(e) => openEditPopup(notification._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                    <FontAwesomeIcon size="lg" icon={faPencil} />
                                 </button>
                                 <button type="button" className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                    <FontAwesomeIcon size="lg" icon={faTrashAlt} onClick={() => setIdAndOpenDeletePopup(notification._id)} />
                                 </button>
                              </div>
                           </div>
                        </div>
                  ))
               }
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
                  
               
               

            </div>
         </div>

         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">{id === '' ? 'Create New Notification' : 'Edit Notification'}</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Notification Title</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" 
                        value={form.title}
                        onChange={(e) => updateForm({ title: e.target.value })} />
                     </div>
                     {
                        form.title_error !== '' && (
                           <span style={{color: "red"}}>{form.title_error}</span>
                        )
                     }
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Content</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text"
                        value={form.content}
                        onChange={(e) => updateForm({ content: e.target.value })} />
                     </div>
                     {
                        form.content_error !== '' && (
                           <span style={{color: "red"}}>{form.content_error}</span>
                        )
                     }
                  </div>

                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Date</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="date"
                           value={form.date}
                           onChange={(e) => updateForm({ date: e.target.value })} />
                        </div>
                        {
                           form.date_error !== '' && (
                              <span style={{color: "red"}}>{form.date_error}</span>
                           )
                        }
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Time</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="time"
                           value={form.time}
                           onChange={(e) => updateForm({ time: e.target.value })} />
                        </div>
                        {
                           form.time_error !== '' && (
                              <span style={{color: "red"}}>{form.time_error}</span>
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
                  <button className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={deleteNotification}>Delete</button>
               </div>
            </div>
         </Modal>
      </section>
   )
}
