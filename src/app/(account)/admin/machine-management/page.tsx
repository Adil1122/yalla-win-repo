'use client'

import React, { useEffect, useState } from 'react'
import { faChevronDown, faChevronLeft, faChevronRight, faLocation, faLock, faPencil, faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { CountryCitySearch } from '@/components/CountryCitySearch'
import Link from 'next/link'
import Modal from '@/components/modal'
import { Shop, ShopSearch } from '@/components/ShopSearch'
import { formatISODate } from '@/libs/common'

type SearchScope = 'cities' | 'countries'

export default function AdminMachineManagement() {

   const [selectedItem, setSelectedItem] = useState<{ id: number; name: string } | null>(null)
   const [searchType, setSearchType] = useState<SearchScope>('countries')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   const [modalThreeIsOpen, setModalThreeIsOpen] = useState<boolean>(false)
   const [toggled, setToggled] = useState(false)
   const [selectedShop, setSelectedShop] = useState<Shop>()

   const handleMachineActionClick = (action: 'add' | 'edit') => {

      {/* manipulate modal as per the action */}
      setModalIsOpen(true)
   }

   const handleDelete = (id: string | number) => {
      setModalTwoIsOpen(true)
   }

   const handleMachineLockToggle = (action: 'lock' | 'unlock') => {
      setModalThreeIsOpen(true)
   }
   
   const handleMachineStatusToggle = () => {
      setToggled(!toggled)
   }

   const handleShopSelect = (shop: any) => {
      setSelectedShop(shop)
   }
   var [id, setId] = useState("");

   var [form, setForm] = useState({
      machine_id: "66e053d0c59f779acb326b63",
      shop_id: "66e058c34b111cf411b5ed20",
      merchant_id: "66dfe62ad05edc7551a638e9",
      location: "",
   

      machine_id_error: "",
      shop_id_error: "",
      merchant_id_error: "",
      location_error: "",
      server_error: "",
      server_success: ""
   });

   function openCreatePopup() {
      setForm({
         machine_id: "66e053d0c59f779acb326b63",
         shop_id: "66e058c34b111cf411b5ed20",
         merchant_id: "66dfe62ad05edc7551a638e9",
         location: "",
        
   
         machine_id_error: "",
         shop_id_error: "",
         merchant_id_error: "",
         location_error: "",
         server_error: "",
         server_success: ""
      });
      setId('');
      setModalIsOpen(true);
   }

   async function openEditPopup(notif_id: any) {
      setId(notif_id);
      var url = '/api/admin/machine-management?id=' + notif_id;
      let response = await fetch(url, {
         method: 'PATCH',
      });
      const content = await response.json();
      if(!response.ok) {

      } else {

         setForm({
            machine_id: content.result.machine_id,
            shop_id: content.result.shop_id,
            merchant_id: content.result.merchant_id,
            location: content.result.location,

      
            machine_id_error: "",
            shop_id_error: "",
            merchant_id_error: "",
            location_error: "",
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
         machine_id_error: "",
         shop_id_error: "",
         merchant_id_error: "",
         location_error: "",
      };
      var is_error = false;

      // Validation logic
      if (form.machine_id === '') {
         err['machine_id_error'] = 'machine_id is Required';
         is_error = true;
      }

      if (form.shop_id === '') {
         err['shop_id_error'] = 'Content is Required';
         is_error = true;
      }

      if (form.merchant_id === '') {
         err['merchant_id_error'] = 'merchant_id is Required';
         is_error = true;
      }

      if (form.location === '') {
         err['location_error'] = 'location is Required';
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
         formData.append('machine_id', form.machine_id);
         formData.append('shop_id', form.shop_id);
         formData.append('merchant_id', form.merchant_id);
         formData.append('location', form.location);
      

         var url = '/api/admin/machine-management';
         var method = 'POST';
         var success_message = 'Machine created successfully.';
         if(id !== "") {
            url = '/api/admin/machine-management?id=' + id;
            method = 'PUT';
            success_message = 'Machine updated successfully.';
         }

         try {
            let response = await fetch(url, {
               method: method,
               body: formData
            });

            if (!response.ok) {
               setForm((prev) => {
                  return { ...prev, server_error: `HTTP error! status: ${response.status}` };
               });
            } else {
               setForm((prev) => {
                  return { ...prev, server_success: success_message };
               });
            }
         } catch (error) {
            setForm((prev) => {
               return { ...prev, server_error: `A problem occurred with your fetch operation: ${error}` };
            });
         }
      }
   }

   var [merchants, setMerchants] = useState<any>([])
  var [shops, setShops] = useState<any>([])

  var [daily_machine_counts, setDailyMachineCounts] = useState<any>([])
  var [weekly_machine_counts, setWeeklyMachineCounts] = useState<any>([])
  var [monthly_machine_counts, setMonthlyMachineCounts] = useState<any>([])

  useEffect(() => {
    getMachineCounts()
    getDropdownsData('merchants', '')
  }, [])

  var getMachineCounts = async() => {
   try {
     let response = await fetch('/api/admin/machine-management/machine-counts', {
       method: 'GET',
     });
     var content = await response.json()
     if(!response.ok) {

     } else {
       setDailyMachineCounts(content.daily_machine_counts)
       setWeeklyMachineCounts(content.weekly_machine_counts)
       setMonthlyMachineCounts(content.monthly_machine_counts)
       getMachines()
     }
   } catch (error) {
     
   }
 }

 var getDropdownsData = async(merchants_shops: any, merchant_id: any) => {
   try {
       var url = "/api/admin/machine-management?merchants_shops=" + merchants_shops;
       if(merchants_shops === 'shops') {
         url = url + "&merchant_id=" + merchant_id;
       }

       let response = await fetch(url, {
         method: 'OPTIONS',
       });

       var content = await response.json();
       if(!response.ok) {

       } else {
         if(merchants_shops === 'merchants') {
           console.log('merchants: ', content.merchants)
           setMerchants(content.merchants);
         } else {
           console.log('machines: ', content.shops)
           setShops(content.shops);
         }
       }
   } catch (error) {
     
   }
 }

 var getShops = (merchant_id: any) => {
   updateForm({merchant_id: merchant_id});
   if(merchant_id !== '') {
     getDropdownsData('shops', merchant_id);
   }
 }

 var [machines, setMachines] = useState<any>([])
  var [schedule, setSchedule] = useState('monthly')
  var skip = 0;

  var getMachines = async() => {
    try {
        let response = await fetch("/api/admin/machine-management?schedule=" + schedule + '&skip=' + skip + '&limit=' + recordsPerPage, {
          method: 'GET',
        });

        var content = await response.json();
        if(!response.ok) {

        } else {
          var temp_machines = content.machines;
          for(var i = 0; i < temp_machines.length; i++) {
            temp_machines[i].updatedAt = formatISODate(new Date(temp_machines[i].updatedAt)).formatedDateOnly;
          }
          setMachines(temp_machines)
        }

    } catch (error) {
      
    }
  }
  
  var totalPages = 0;
  var [currentPage, setCurrentPage] = useState(1);
  var [recordsPerPage, setRecordsPerPages] = useState(5);

  if(schedule === 'daily') {
    totalPages = daily_machine_counts;
  } else if(schedule === 'weekly') {
    totalPages = weekly_machine_counts;
  } else if(schedule === 'monthly') {
    totalPages = monthly_machine_counts;
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
    getMachines()
    setCurrentPage(current_page);
  }





   return ( 
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 ">
         <div className="flex flex-col w-full h-full">
            <div className="flex flex-col gap-4 lg:flex-row w-full">
               <div className="lg:w-[40%] bg-white rounded-lg">
                  <CountryCitySearch searchIn={searchType} onSelectItem={setSelectedItem} />
               </div>
               <div className="w-full lg:w-fit">
                  <Menu>
                     <MenuButton className="w-full">
                        <div className="flex items-center border gap-6 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white">
                           <div className="capitalize font-medium text-size-2">Search By</div>
                           <FontAwesomeIcon size="lg" icon={faChevronDown} />
                        </div>
                     </MenuButton>
                     <MenuItems anchor="bottom" className="w-[140px] bg-white py-2 lg:py-4 rounded-lg mt-[2px] px-4">
                        <MenuItem>
                           <div className="flex gap-2 items-center">
                              <input checked name="search-radio" type="radio" className="h-5 w-5 text-themeone focus:text-themeone focus:ring-0" />
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">Country</div>
                           </div>
                        </MenuItem>
                        <MenuItem>
                           <div className="flex gap-2 items-center">
                              <input name="search-radio" type="radio" className="h-5 w-5 text-themeone focus:text-themeone focus:ring-0" />
                              <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5">City</div>
                           </div>
                        </MenuItem>
                     </MenuItems>
                  </Menu>
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
               <button type="button" onClick={() => openCreatePopup()}  className="flex items-center border gap-3 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                  <FontAwesomeIcon size="lg" icon={faPlus} />
                  <div className="capitalize font-medium text-size-2">Add New Machine</div>
               </button>
            </div>
            <div className="flex flex-col mt-12">
               <table className="w-full">
                  <thead>
                     <tr className="bg-white">
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tl rounded-bl">Machine ID</th> 
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Shop Name</th> 
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Merchant ID</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Location</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Last Activity</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                        <th scope="col" className="px-3 py-5 lg:px-8 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                  { 
                     machines.map((machine: any, index: number) => (
                        <tr key={index}>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{machine.machine_id}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{machine.machineWithShop[0].name}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{machine.merchant_id}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{machine.location}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">{machine.updatedAt}</td>
                           <td className="whitespace-nowrap px-3 lg:py-5 lg:px-8 text-sm lg:text-size-1 text-white text-center">Connected</td>
                           <td>
                              <div className="flex items-center justify-center gap-2">
                                 <Link href="machine-management/map/12" className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                    <FontAwesomeIcon size="lg" icon={faLocation} />
                                 </Link>
                                 <button type="button" onClick={(e) => openEditPopup(machine._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                    <FontAwesomeIcon size="lg" icon={faPencil} />
                                 </button>
                                 <button type="button" onClick={() => handleMachineLockToggle('lock')} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                    <FontAwesomeIcon size="lg" icon={faLock} />
                                 </button>
                                 <div className="flex items-center gap-2 lg:gap-3 px-2 border-[2px] border-white rounded py-2">
                                    <div className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer" onClick={handleMachineStatusToggle}>
                                       <div className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${toggled ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                                    </div>
                                 </div>
                                 <button type="button" onClick={() => handleDelete(machine._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
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
                     pages.map((page: any, index: number) => (
                        show_pages.includes(page) && (
                           <div
                           key={index}  // Apply key to the outermost element
                           className={`px-4 py-2 flex items-center justify-center cursor-pointer ${page === currentPage ? 'text-black bg-white' : ''}`}
                           onClick={() => setPagination(page)}
                           >
                           {page}
                           </div>
                        )
                     ))
                  }

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
                  <div className="text-darkone text-head-2">Add Machine</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Machine ID</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text"
                        value={form.machine_id}
                        onChange={(e) => updateForm({ machine_id: e.target.value })} />
                     </div>
                     {
                        form.machine_id_error !== '' && (
                           <span style={{color: "red"}}>{form.machine_id_error}</span>
                        )
                     }
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Choose Merchant</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full" onChange={(e) => getShops(e.target.value)} value={form.merchant_id}>
                           <option value="">Select a Merchant</option>
                           {
                           merchants.map((merchant: any) => (
                              merchant._id === form.merchant_id ?
                              <option key={merchant._id} value={merchant._id} selected>{merchant.name}</option>
                              :
                              <option key={merchant._id} value={merchant._id}>{merchant.name}</option>
                           ))
                           }
                        </select>
                     </div>
                  </div>

                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Choose Shop</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                     <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full" onChange={(e) => updateForm({ shop_id: e.target.value })} value={form.shop_id}>
                        <option value="">Select a Machine</option>
                          {
                            shops.map((shop: any) => (
                              shop._id === form.shop_id ? 
                              <option key={shop._id} value={shop._id} selected>{shop.name}</option>
                              :
                              <option key={shop._id} value={shop._id}>{shop.name}</option>
                            ))
                          }
                      </select>
                     </div>
                  </div>

                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Location</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" 
                        value={form.location}
                        onChange={(e) => updateForm({ location: e.target.value })} />
                     </div>
                     {
                        form.location_error !== '' && (
                           <span style={{color: "red"}}>{form.location_error}</span>
                        )
                     }
                  </div>
                  <div className="flex items-center ml-auto gap-6">
                     <button onClick={() => setModalTwoIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded"onClick={onSubmit}>Save</button>
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
                  <button className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Delete</button>
               </div>
            </div>
         </Modal>

         <Modal open={modalThreeIsOpen} onClose={() => setModalThreeIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
               <div className="text-darkone font-medium text-head-3">Machine Lock</div>
               <div className="text-darkone text-size-4">Are you sure you want to lock this machine?</div>
               <div className="flex items-center gap-6 mt-3">
                  <button onClick={() => setModalThreeIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded">Cancel</button>
                  <button className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Lock</button>
               </div>
            </div>
         </Modal>
      </section>
   )
}
