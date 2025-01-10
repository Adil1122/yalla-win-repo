"use client";

import React, { useEffect, useRef, useState } from "react"; 
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faComment,
  faCommentAlt,
  faComments,
  faEye,
  faPencil,
  faPlus,
  faTimes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CountryCitySearch } from "@/components/CountryCitySearch";
import Link from "next/link";
import Modal from "@/components/modal";
import { SwitchComponent } from "@/components/SwitchComponent";
import { formatISODate } from "@/libs/common";

type SearchScope = "cities" | "countries";
type ScheduleTab = "daily" | "weekly" | "monthly";

export default function AdminShopManagement() {
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [searchType, setSearchType] = useState<SearchScope>("countries");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false);
  const [deleteShop, setDeleteShop] = useState<any>(0);
  const [modalThreeIsOpen, setModalThreeIsOpen] = useState<boolean>(false);
  const [shopMachineToggle, setShopMachineToggle] = useState(false);

  const handleShopMachineToggle = (value: boolean) => {
    setShopMachineToggle(value);
  };

  const handleShopActionClick = (action: "add" | "edit") => {
    {
      /* manipulate modal as per the action */
    }
    setModalIsOpen(true);
  };

  var schedule = 'daily'
  var skip = 0;
  const [scheduleTab, setScheduleTab] = useState('daily');

  const handleRadioChange = (event: any) => {
    setSearchType(event.target.value)
    schedule = scheduleTab
  }

  const handleMenuItemClick = (event: any) => {
    event.stopPropagation()
  }

  const handleDelete = (id: string | number) => {
      setDeleteShop(id);
    setModalTwoIsOpen(true);
  };

  const handleDeleteShop = async () => {

   if (deleteShop) {
      let response = await fetch('/api/admin/shop-management?id=' + deleteShop, {
         method: 'DELETE',
      });
      var content = await response.json();

      setModalTwoIsOpen(false)

      if(!response.ok) {

      } else {
         getShops()
      }
   }

   setDeleteShop(0)
  }

  const habdleScheduleTabChange = (tab: ScheduleTab) => {
    schedule = tab;
    setScheduleTab(tab)
    getShopCounts()
  }

  var [id, setId] = useState("");

  var [form, setForm] = useState({
    name: "",
    merchant_id: "",
    location: "",
    machine_id: "",
    registeration_date: "",

    name_error: "",
    merchant_id_error: "",
    location_error: "",
    machine_id_error: "",
    registeration_date_error: "",
    server_error: "",
    server_success: "",
  });

  function openCreatePopup() {
    setForm({
      name: "",
      merchant_id: "",
      location: "",
      machine_id: "",
      registeration_date: "",

      name_error: "",
      merchant_id_error: "",
      location_error: "",
      machine_id_error: "",
      registeration_date_error: "",
      server_error: "",
      server_success: "",
    });
    setId("");
    setModalIsOpen(true);
  }

  async function openEditPopup(notif_id: any) { 
    setId(notif_id);
    var url = "/api/admin/shop-management?id=" + notif_id;
    let response = await fetch(url, {
      method: "PATCH",
    });
    const content = await response.json();
    if (!response.ok) {
    } else {
      setForm({
        name: content.result.name,
        merchant_id: content.result.merchant_id,
        location: content.result.location,
        machine_id: content.result.machine_id,
        registeration_date: content.result.registeration_date,

        name_error: "",
        merchant_id_error: "",
        location_error: "",
        machine_id_error: "",
        registeration_date_error: "",
        server_error: "",
        server_success: "",
      });
      setModalIsOpen(true);
    }
  }

  function updateForm(value: any) {
    console.log(value);
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function isValidateErrorForm() {
    var err = {
      name_error: "",
      merchant_id_error: "",
      location_error: "",
      machine_id_error: "",
      registeration_date_error: "",
    };
    var is_error = false;

    // Validation logic
    if (form.name === "") {
      err["name_error"] = "Name is Required";
      is_error = true;
    }

    if (form.merchant_id === "") {
      err["merchant_id_error"] = "Merchnat is Required";
      is_error = true;
    }

    if (form.location === "") {
      err["location_error"] = "Location is Required";
      is_error = true;
    }

    if (form.machine_id === "") {
      err["machine_id_error"] = "Machine Id is Required";
      is_error = true;
    }
    if (form.registeration_date === "") {
      err["registeration_date_error"] = "Date is Required";
      is_error = true;
    }

    setForm((prev) => {
      return { ...prev, ...err };
    });

    console.log("is_error: ", is_error);

    return is_error;
  }

  async function onSubmit(e: any) {
    e.preventDefault();
    if (!isValidateErrorForm()) {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("merchant_id", form.merchant_id);
      formData.append("location", form.location);
      formData.append("machine_id", form.machine_id);
      formData.append("registeration_date", form.registeration_date);

      var url = "/api/admin/shop-management";
      var method = "POST";
      var success_message = "Shop created successfully.";
      if (id !== "") {
        url = "/api/admin/shop-management?id=" + id;
        method = "PUT";
        success_message = "Shop updated successfully.";
      }

      try {
        let response = await fetch(url, {
          method: method,
          body: formData,
        });

        if (!response.ok) {
          setForm((prev) => {
            return {
              ...prev,
              server_error: `HTTP error! status: ${response.status}`,
            };
          });
        } else {
          setForm((prev) => {
            return { ...prev, server_success: success_message };
          });
        }
        setModalIsOpen(false);
        getShopCounts();
        
      } catch (error) {
        setForm((prev) => {
          return {
            ...prev,
            server_error: `A problem occurred with your fetch operation: ${error}`,
          };
        });
      }
    }
  }

  var [merchants, setMerchants] = useState<any>([])
  var [machines, setMachines] = useState<any>([])

  var [daily_shop_counts, setDailyShopCounts] = useState<any>([])
  var [weekly_shop_counts, setWeeklyShopCounts] = useState<any>([])
  var [monthly_shop_counts, setMonthlyShopCounts] = useState<any>([])

  useEffect(() => {
    schedule = scheduleTab;
    getShopCounts()
    getDropdownsData('merchants', '')
  }, [selectedItem])

  var getShopCounts = async() => {
    try {
      var selected_name = selectedItem !== null ? selectedItem.name : ''
      let response = await fetch('/api/admin/shop-management/shop-counts?search_by=' + searchType + '&search=' + selected_name, {
        method: 'GET',
      });
      var content = await response.json()
      if(!response.ok) {

      } else {
        setDailyShopCounts(content.daily_shop_counts)
        setWeeklyShopCounts(content.weekly_shop_counts)
        setMonthlyShopCounts(content.monthly_shop_counts)
        getShops()
      }
    } catch (error) {
      
    }
  }

  var getDropdownsData = async(merchants_machines: any, merchant_id: any) => {
    try {
        var url = "/api/admin/shop-management?merchants_machines=" + merchants_machines;
        if(merchants_machines === 'machines') {
          url = url + "&merchant_id=" + merchant_id;
        }

        let response = await fetch(url, {
          method: 'OPTIONS',
        });

        var content = await response.json();
        if(!response.ok) {

        } else {
          if(merchants_machines === 'merchants') {
            console.log('merchants: ', content.merchants)
            setMerchants(content.merchants);
          } else {
            console.log('machines: ', content.machines)
            setMachines(content.machines);
          }
        }
    } catch (error) {
      
    }
  }

  var getMachines = (merchant_id: any) => {
    updateForm({merchant_id: merchant_id});
    if(merchant_id !== '') {
      getDropdownsData('machines', merchant_id);
    }
  }

  var [shops, setShops] = useState<any>([])
  var [invoices, setInvoices] = useState<any>([])

  var getShops = async() => {
    try {
        var selected_name = selectedItem !== null ? selectedItem.name : ''
        let response = await fetch("/api/admin/shop-management?schedule=" + schedule + '&skip=' + skip + '&limit=' + recordsPerPage + '&search_by=' + searchType + '&search=' + selected_name, {
          method: 'GET',
        });

        var content = await response.json();
        if(!response.ok) {

        } else {
          var temp_shops = content.shops;
          for(var i = 0; i < temp_shops.length; i++) {
            temp_shops[i].registeration_date = formatISODate(new Date(temp_shops[i].registeration_date)).formatedDateOnly;
          }

          var temp_invoices: any = {};
          for(var i = 0; i < content.invoices.length; i++) {
            temp_invoices[content.invoices[i]._id] = content.invoices[i].totalSaleAmount
          }
          setShops(temp_shops)
          setInvoices(content.invoices)
          console.log('temp_invoices: ', temp_invoices)
        }

    } catch (error) {
      
    }
  }

  var totalPages = 0;
  var [currentPage, setCurrentPage] = useState(1);
  var [recordsPerPage, setRecordsPerPages] = useState(5);

  if(schedule === 'daily') {
    totalPages = daily_shop_counts;
  } else if(schedule === 'weekly') {
    totalPages = weekly_shop_counts;
  } else if(schedule === 'monthly') {
    totalPages = monthly_shop_counts;
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
    getShops()
    setCurrentPage(current_page);
  }

  return (
    <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col gap-4 lg:flex-row w-full">
          <div className="lg:w-[40%] bg-white rounded-lg">
            <CountryCitySearch
              searchIn={searchType}
              onSelectItem={setSelectedItem}
            />
          </div>
          <div className="w-full lg:w-fit">
          <Menu>
              <MenuButton className="w-full">
                <div className="flex items-center border gap-6 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white">
                  <div className="capitalize font-medium text-size-2">
                   {searchType === 'cities' ? 'Search By City' : 'Search By Country'}
                  </div>
                  <FontAwesomeIcon size="lg" icon={faChevronDown} />
                </div>
              </MenuButton>
              <MenuItems
                anchor="bottom"
                className="w-[140px] bg-white py-2 lg:py-4 rounded-lg mt-[2px] px-4"
              >
                <MenuItem>
                  <div className="flex gap-2 items-center">
                    <input
                      id="countries-input"
                      checked={searchType === 'countries'}
                      value="countries"
                      name="search-radio"
                      type="radio"
                      className="h-5 w-5 text-themeone focus:text-themeone focus:ring-0"
                      onClick={handleMenuItemClick}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="countries-input" className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5" onClick={handleMenuItemClick}>
                      Country
                    </label>
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="flex gap-2 items-center">
                    <input
                      id="cities-input"
                      checked={searchType === 'cities'}
                      value="cities"
                      name="search-radio"
                      type="radio"
                      className="h-5 w-5 text-themeone focus:text-themeone focus:ring-0"
                      onClick={(event) => {event.stopPropagation()}}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="cities-input" className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5" onClick={handleMenuItemClick}>
                      City
                    </label>
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
          <div className="w-full lg:w-fit">
          <Menu>
              <MenuButton className="w-full">
                <div className="flex items-center border gap-6 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white">
                  <div className="capitalize font-medium text-size-2">
                  {scheduleTab[0].toUpperCase() + scheduleTab.slice(1)}
                  </div>
                  <FontAwesomeIcon size="lg" icon={faChevronDown} />
                </div>
              </MenuButton>
              <MenuItems
                anchor="bottom"
                className="w-[110px] bg-white py-2 lg:py-4 rounded-lg mt-[2px] px-4"
              >
                <MenuItem>
                  <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5" onClick={() => habdleScheduleTabChange('daily')}>
                    Daily
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5" onClick={() => habdleScheduleTabChange('weekly')}>
                    Weekly
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="text-size-2 text-darkone hover:text-themeone cursor-pointer py-1.5" onClick={() => habdleScheduleTabChange('monthly')}>
                    Monthly
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
          <button
            type="button"
            onClick={() => openCreatePopup()}
            className="flex items-center border gap-3 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto"
          >
            <FontAwesomeIcon size="lg" icon={faPlus} />
            <div className="capitalize font-medium text-size-2">
              Add New Shop
            </div>
          </button>
        </div>
        <div className="flex flex-col mt-12">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th
                  scope="col"
                  className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tl rounded-bl"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Merchant Name
                </th>
                <th
                  scope="col"
                  className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Merchant ID
                </th>
                <th
                  scope="col"
                  className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Total Sales
                </th>
                <th
                  scope="col"
                  className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Reg Date
                </th>
                <th
                  scope="col"
                  className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">

            { 
              shops.map((shop: any) => (
              shop.merchantWithShop.length > 0 && 
              <tr key={shop._id}>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {shop.name}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {shop.merchantWithShop[0].name}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {shop.merchantWithShop[0].merchant_id}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {shop.location}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                { 
                  invoices.map((invoice: any) => (
                    invoice._id === shop.merchant_id &&
                    <React.Fragment key={invoice._id}>AED {invoice.totalSaleAmount}</React.Fragment>
                  ))
                }
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {shop.registeration_date}
                </td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={"shop-management/view/" + shop.merchant_id}
                      className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2"
                    >
                      <FontAwesomeIcon size="lg" icon={faEye} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditPopup(shop._id)}
                      className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2"
                    >
                      <FontAwesomeIcon size="lg" icon={faPencil} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(shop._id)}
                      className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2"
                    >
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
            <div className="text-darkone text-head-2">Add Shop</div>
            <div
              onClick={() => setModalIsOpen(false)}
              className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center"
            >
              <FontAwesomeIcon
                size="lg"
                icon={faTimes}
                className="text-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-head-1 text-darkone">Shop Details</h2>
              <div className="bg-lightsix border border-lightone rounded-lg px-6 py-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-darkone text-size-4">Name</div>
                    <div className="text-darkone text-size-2 border border-lightone rounded">
                    <input
                      className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                      type="text" 
                        placeholder="Shop Name"
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value })}
                      />
                    </div>
                    {form.name_error !== "" && (
                      <span style={{ color: "red" }}>{form.name_error}</span>
                    )}
                  </div>

                  
                  <div className="flex flex-col gap-2">
                    <div className="text-darkone text-size-4">
                      Choose Merchant
                    </div>
                    <div className="text-darkone text-size-2 border border-lightone rounded">
                      <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full" onChange={(e) => getMachines(e.target.value)} value={form.merchant_id} >
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
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-darkone text-size-4">Location</div>
                  <div className="text-darkone text-size-2 border border-lightone rounded">
                    <input
                      className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                      type="text" value={form.location}
                      onChange={(e) => updateForm({ location: e.target.value })}
                    />
                  </div>
                  {form.location_error !== "" && (
                    <span style={{ color: "red" }}>{form.location_error}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-darkone text-size-4">
                    Registration Date
                  </div>
                  <div className="text-darkone text-size-2 border border-lightone rounded">
                    <input
                      className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                      type="date" value={form.registeration_date !== "" ? new Date(form.registeration_date).toISOString().slice(0, 10) : form.registeration_date}
                      onChange={(e) => updateForm({ registeration_date: e.target.value })} />
                   </div>
                   {
                      form.registeration_date_error !== '' && (
                         <span style={{color: "red"}}>{form.registeration_date_error}</span>
                      )
                   }
                </div>
               
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex">
                <h2 className="text-head-1 text-darkone">
                  Choose Machine
                </h2>
                <div className="ml-auto" style={{display: 'none'}}>
                  <SwitchComponent
                    isEnabled={shopMachineToggle}
                    onToggle={handleShopMachineToggle}
                    label=""
                  />
                </div>
              </div>
              <div className="bg-lightsix border border-lightone rounded-lg px-6 py-6 flex flex-col gap-6">
                {shopMachineToggle && (
                  <div className="flex flex-col gap-2">
                    <div className="text-darkone text-size-4">
                      Add Machine No
                    </div>
                    <div className="text-darkone text-size-2 border border-lightone rounded">
                      <input
                        className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                        type="text"value={form.machine_id}
                        onChange={(e) => updateForm({ machine_id: e.target.value })} />
                     </div>
                     {
                        form.machine_id_error !== '' && (
                           <span style={{color: "red"}}>{form.machine_id_error}</span>
                        )
                     }
                  </div>
                )}
                {!shopMachineToggle && (
                  <div className="flex flex-col gap-2">
                    <div className="text-darkone text-size-4">
                      Choose Machine
                    </div>
                    <div className="text-darkone text-size-2 border border-lightone rounded">
                      <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full" onChange={(e) => updateForm({ machine_id: e.target.value })} value={form.machine_id}>
                        <option value="">Select a Machine</option>
                          {
                            machines.map((machine: any) => (
                              machine._id === form.machine_id ? 
                              <option key={machine._id} value={machine._id} selected>{machine.machine_id}</option>
                              :
                              <option key={machine._id} value={machine._id}>{machine.machine_id}</option>
                            ))
                          }
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center ml-auto gap-6">
              <button
                onClick={() => setModalIsOpen(false)}
                className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded"
              >
                Cancel
              </button>
              <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={onSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={modalTwoIsOpen} onClose={() => setModalTwoIsOpen(false)}>
        <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
          <div className="text-darkone font-medium text-head-3">Delete</div>
          <div className="text-darkone text-size-4">
            Are you sure you want to delete this record?
          </div>
          <div className="flex items-center gap-6 mt-3">
            <button
              onClick={() => setModalTwoIsOpen(false)}
              className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded"
            >
              Cancel
            </button>
            <button onClick={handleDeleteShop} className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={modalThreeIsOpen} onClose={() => setModalThreeIsOpen(false)}>
        <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
          <div className="flex items-center justify-between w-full">
            <div className="text-darkone text-head-2">Send Message</div>
            <div
              onClick={() => setModalThreeIsOpen(false)}
              className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center"
            >
              <FontAwesomeIcon
                size="lg"
                icon={faTimes}
                className="text-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">Message Title</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="text"
                  placeholder="Message Title"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">Contents</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="text"
                  placeholder="Message Content"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">Message Date</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="date"
                  placeholder=""
                />
              </div>
            </div>
            <button
              onClick={() => setModalThreeIsOpen(false)}
              className="text-white text-head-1 ml-auto font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded"
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
