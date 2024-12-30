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
import { machine } from "os";
import { formatISODate } from "@/libs/common";

type SearchScope = "cities" | "countries";
type ScheduleTab = "daily" | "weekly" | "monthly";

export default function AdminMerchantManagement() {
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [searchType, setSearchType] = useState<SearchScope>("countries");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false);
  const [modalThreeIsOpen, setModalThreeIsOpen] = useState<boolean>(false);
  const [toggled, setToggled] = useState(false);
  const [messageReply, setMessageReply] = useState<boolean>(false);

  const handleToggle = () => {
    setToggled(!toggled);
  };

  const handleMerchantActionClick = (action: "add" | "edit") => {
    {
      /* manipulate modal as per the action */
    }
    setModalIsOpen(true);
  };

  function setIdAndOpenDeletePopup(Id: any) {
    setId(Id);
    setModalTwoIsOpen(true);
 }

 var deleteMerchant = async() => {
    let response = await fetch('/api/admin/merchant-management?id=' + id, {
       method: 'DELETE',
    });
    var content = await response.json();
    schedule = scheduleTab
    setId('');
    setModalTwoIsOpen(false)

    if(!response.ok) {

    } else {
       schedule = scheduleTab
       getMerchantCounts();
    }
 }

  const handleMessageActionClick = (action: "view" | "send") => {
    {
      /* manipulate modal as per the action */
    }
    setModalThreeIsOpen(true);
  };

  var schedule = 'daily'
  var skip = 0;
  const [scheduleTab, setScheduleTab] = useState('daily');

  const habdleScheduleTabChange = (tab: ScheduleTab) => {
    schedule = tab;
    setScheduleTab(tab)
    getMerchantCounts()
  }

  const handleRadioChange = (event: any) => {
    setSearchType(event.target.value)
    schedule = scheduleTab
  }

  const handleMenuItemClick = (event: any) => {
    event.stopPropagation()
  }

  var [id, setId] = useState("");

  var [form, setForm] = useState({
    name: "",
    eid: "",
    mobile: "",
    email: "",
    password: "",
    shop_id: "",
    profit_percentage: "",
    machine_id: "",
    registration_date: "",
    country: "",
    city: "",
    area: "",

    name_error: "",
    eid_error: "",
    mobile_error: "",
    email_error: "",
    password_error: "",
    shop_id_error: "",
    profit_percentage_error: "",
    machine_id_error: "",
    registration_date_error: "",
    country_error: "",
    city_error: "",
    area_error: "",
    server_error: "",
    server_success: "",
  });

  function openCreatePopup() {
    setForm({
      name: "",
      eid: "",
      mobile: "",
      email: "",
      password: "",
      shop_id: "",
      profit_percentage: "",
      machine_id: "",
      registration_date: "",
      country: "",
      city: "",
      area: "",

      name_error: "",
      eid_error: "",
      mobile_error: "",
      password_error: "",
      email_error: "",
      shop_id_error: "",
      profit_percentage_error: "",
      machine_id_error: "",
      registration_date_error: "",
      country_error: "",
      city_error: "",
      area_error: "",
      server_error: "",
      server_success: "",
    });

    setId("");
    setModalIsOpen(true);
  }

  async function openEditPopup(notif_id: any) {
    setId(notif_id);
    var url = "/api/admin/merchant-management?id=" + notif_id;
    let response = await fetch(url, {
      method: "PATCH",
    });
    const content = await response.json();
    if (!response.ok) {
    } else {
      setForm({

        name: content.result.name,
        eid: content.result.eid,
        mobile: content.result.mobile,
        email: content.result.email,
        password: content.result.password_text,
        shop_id: content.result.shop_id,
        profit_percentage: content.result.profit_percentage,
        machine_id: content.result.machine_id,
        registration_date: content.result.registration_date,
        country: content.result.country,
        city: content.result.city,
        area: content.result.area,

        name_error: "",
        eid_error: "",
        mobile_error: "",
        password_error: "",
        email_error: "",
        shop_id_error: "",
        profit_percentage_error: "",
        machine_id_error: "",
        registration_date_error: "",
        country_error: "",
        city_error: "",
        area_error: "",
        server_error: "",
        server_success: "",
      });
      setModalIsOpen(true);
    }
  }

  function updateForm(value: any) {
    console.log('came here: ', value);
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function isValidateErrorForm() {
    var err = {
      name_error: "",
      eid_error: "",
      mobile_error: "",
      email_error: "",
      password_error: "",
      shop_id_error: "",
      profit_percentage_error: "",
      machine_id_error: "",
      registration_date_error: "",
      country_error: "",
      city_error: "",
      area_error: "",
    };
    var is_error = false;

    // Validation logic
    if (form.name === "") {
      err["name_error"] = "Name is Required";
      is_error = true;
    }

    if (form.eid === "") {
      err["eid_error"] = "eId is Required";
      is_error = true;
    }

    if (form.mobile === "") {
      err["mobile_error"] = "Phone Number is Required";
      is_error = true;
    }
    if (form.email === "") {
      err["email_error"] = "Email is Required";
      is_error = true;
    }

    if (id === '' && form.password === "") {
      err["password_error"] = "Password is Required";
      is_error = true;
    }

    if (form.shop_id === "") {
      err["shop_id_error"] = "Shop is Required";
      is_error = true;
    }
    if (form.profit_percentage === "") {
      err["profit_percentage_error"] = "Profit % is Required";
      is_error = true;
    }
    if (form.machine_id === "") {
      err["machine_id_error"] = "Machine Id is Required";
      is_error = true;
    }
    if (form.registration_date === "") {
      err["registration_date_error"] = "Date is Required";
      is_error = true;
    }
    if (form.country === "") {
      err["country_error"] = "Country is Required";
      is_error = true;
    }
    if (form.city === "") {
      err["city_error"] = "City is Required";
      is_error = true;
    }
    if (form.area === "") {
      err["area_error"] = "Area is Required";
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
      formData.append("eid", form.eid);
      formData.append("mobile", form.mobile);
      formData.append("email", form.email);
      formData.append("shop_id", form.shop_id);
      formData.append("profit_percentage", form.profit_percentage);
      formData.append("machine_id", form.machine_id);
      formData.append("registration_date", form.registration_date);
      formData.append("country", form.country);
      formData.append("city", form.city);
      formData.append("area", form.area);
      formData.append("password", form.password);

      var url = "/api/admin/merchant-management";
      var method = "POST";
      var success_message = "Merchant created successfully.";
      if (id !== "") {
        url = "/api/admin/merchant-management?id=" + id;
        method = "PUT";
        success_message = "Merchant updated successfully.";
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
          setModalIsOpen(false);
        }
        schedule = scheduleTab
        getMerchantCounts()
      } catch (error) {
        setForm((prev) => {
          return {
            ...prev,
            server_error: `A problem occurred with your fetch operation: ${error}`,
          };
        });
        setModalIsOpen(false);
      }
    }
  }


  var [shops, setShops] = useState<any>([])
  var [merchants, setMerchants] = useState<any>([])
  var [machines, setMachines] = useState<any>([])

  var [daily_merchant_counts, setDailyMerchantCounts] = useState<any>([])
  var [weekly_merchant_counts, setWeeklyMerchantCounts] = useState<any>([])
  var [monthly_merchant_counts, setMonthlyMerchantCounts] = useState<any>([])

  useEffect(() => {
    getMerchantCounts()
    getDropdownsData('shops', '')
  }, [selectedItem])

  var getMerchantCounts = async() => {
    try {
      var selected_name = selectedItem !== null ? selectedItem.name : ''
      let response = await fetch('/api/admin/merchant-management/merchant-counts?search_by=' + searchType + '&search=' + selected_name, {
        method: 'GET',
      });
      var content = await response.json()
      if(!response.ok) {

      } else {
        setDailyMerchantCounts(content.daily_merchant_counts)
        setWeeklyMerchantCounts(content.weekly_merchant_counts)
        setMonthlyMerchantCounts(content.monthly_merchant_counts)
        getMerchants()
      }
    } catch (error) {
      
    }
  }

  var getDropdownsData = async(shops_machines: any, shop_id: any) => {
    try {
        var url = "/api/admin/merchant-management?shops_machines=" + shops_machines;
        if(shops_machines === 'machines') {
          url = url + "&shop_id=" + shop_id;
        }

        let response = await fetch(url, {
          method: 'OPTIONS',
        });

        var content = await response.json();
        if(!response.ok) {

        } else {
          if(shops_machines === 'shops') {
            setShops(content.shops);
          } else {
            if(content.machine_id) {
              updateForm({machine_id: content.machine_id})
            } else {
              updateForm({machine_id: ""})
            }
          }
        }
    } catch (error) {
      updateForm({machine_id: ""})
    }
  }

  var [shops, setShops] = useState<any>([])
  var [invoices, setInvoices] = useState<any>([])

  var getMerchants = async() => {
    try {
        var selected_name = selectedItem !== null ? selectedItem.name : ''
        let response = await fetch("/api/admin/merchant-management?schedule=" + schedule + '&skip=' + skip + '&limit=' + recordsPerPage + '&search_by=' + searchType + '&search=' + selected_name, {
          method: 'GET',
        });

        var content = await response.json();
        if(!response.ok) {

        } else {
          console.log('content.merchants: ', content.merchants)
          setMerchants(content.merchants)
          setMachines(content.machines)
        }

    } catch (error) {
      
    }
  }

  var totalPages = 0;
  var [currentPage, setCurrentPage] = useState(1);
  var [recordsPerPage, setRecordsPerPages] = useState(5);

  if(scheduleTab === 'daily') {
    totalPages = daily_merchant_counts;
  } else if(scheduleTab === 'weekly') {
    totalPages = weekly_merchant_counts;
  } else if(scheduleTab === 'monthly') {
    totalPages = monthly_merchant_counts;
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
    schedule = scheduleTab
    getMerchants()
    setCurrentPage(current_page);
  }

  function setMachineId(value: any) {
    updateForm({shop_id: value});
    getDropdownsData('machines', value);
  }

  async function changeStatus(id:any) {
    try {
       let response = await fetch('/api/admin/merchant-management/extras?action=change_status&id=' + id, {
          method: 'PUT',
       });
       //var content = await response.json();
       //setId('');
 
       if(!response.ok) {
 
       } else {
          //product_type = activeTabTwo;
          //merchant_app = activeTab;
          getMerchantCounts();
       }
    } catch (error) {
       
    }
 }

  return (
    <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 h-full">
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
              Add New Merchant
            </div>
          </button>
        </div>
        <div className="flex flex-col mt-12">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tl rounded-bl"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  eID
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Machine No
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Phone No
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">

            { 
              merchants.map((merchant: any, index: any) => (
              merchant.role === 'merchant' &&  
              <tr key={merchant._id} className="h-[70px]">
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {merchant.name}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {merchant.eid}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                {
                  /*machines.map((machine: any, index: any) => (
                    machine.merchant_id === merchant._id && index === 0 &&
                    machine.machine_id
                  ))*/
                  
                  merchant.merchantWithMachine.length > 0 ? merchant.merchantWithMachine[0].machine_id : ''
                
                }
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {merchant.area}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {merchant.email}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {merchant.mobile}
                </td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={"merchant-management/view/" + merchant._id}
                      className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2"
                    >
                      <FontAwesomeIcon size="lg" icon={faEye} />
                    </Link>
                    <div className="flex items-center gap-2 lg:gap-3 px-2 border-[2px] border-white rounded py-2">
                      <div
                        className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer"
                        onClick={() => changeStatus(merchant._id)}
                      >
                        <div
                          className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${
                            merchant.active === 1
                              ? "translate-x-[-5px] lg:translate-x-[-6px]"
                              : "translate-x-[5px] lg:translate-x-[7px]"
                          }`}


                        >

                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMessageActionClick("send")}
                      className="relative text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2"
                      style={{display: 'none'}}
                    >
                      <span className="absolute -top-4 -right-1 bg-white rounded-full text-darkone font-semibold text-sm w-[20px] flex items-center justify-center h-[20px]">
                        1
                      </span>
                      <FontAwesomeIcon size="lg" icon={faCommentAlt} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditPopup(merchant._id)}
                      className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2"
                    >
                      <FontAwesomeIcon size="lg" icon={faPencil} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdAndOpenDeletePopup(merchant._id)}
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
            <div className="text-darkone text-head-2">Add New Merchant</div>
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
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">Name</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                  />
                </div>
                {form.name_error !== "" && ( 
                  <span style={{ color: "red" }}>{form.name_error}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">eID</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="text"
                    value={form.eid}
                    onChange={(e) => updateForm({ eid: e.target.value })}
                  />
                </div>
                {form.eid_error !== "" && (
                  <span style={{ color: "red" }}>{form.eid_error}</span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">Phone Number</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="text"
                    placeholder=""
                    value={form.mobile}
                    onChange={(e) => updateForm({ mobile: e.target.value })}
                  />
                </div>
                {form.mobile_error !== "" && (
                <span style={{ color: "red" }}>{form.mobile_error}</span>
              )}
              </div>
              
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">Email Address</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="text"
                    placeholder=""
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                  />
                </div>

                {form.email_error !== "" && (
                  <span style={{ color: "red" }}>{form.email_error}</span>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">Password</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="password"
                    placeholder=""
                    value={form.password}
                    onChange={(e) => updateForm({ password: e.target.value })}
                  />
                </div>

                {form.password_error !== "" && (
                  <span style={{ color: "red" }}>{form.password_error}</span>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">Choose Shop</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full" onChange={(e) => setMachineId(e.target.value)} value={form.shop_id}>
                      <option value="">Selct a Shop</option>
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
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">Profit %</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="text"
                    value={form.profit_percentage}
                    onChange={(e) => updateForm({ profit_percentage: e.target.value })}
                  />
                </div>

                {form.profit_percentage_error !== "" && (
                  <span style={{ color: "red" }}>{form.profit_percentage_error}</span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">Machine ID</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="text"
                    value={form.machine_id}
                    onChange={(e) => updateForm({ machine_id: e.target.value })}
                    readOnly />
                </div>
                  {form.machine_id_error !== "" && (
                     <span style={{ color: "red" }}>{form.machine_id_error}</span>
                  )}
              </div>
              
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">
                  Registration Date
                </div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="date"
                    value={form.registration_date}
                    onChange={(e) =>
                      updateForm({ registration_date: e.target.value })
                    }
                  />
                </div>
                {form.registration_date_error !== "" && (
                  <span style={{ color: "red" }}>
                    {form.registration_date_error}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">Country</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="text"
                    value={form.country}
                    onChange={(e) => updateForm({ country: e.target.value })}
                  />
                </div>
                {form.country_error !== "" && (
                <span style={{ color: "red" }}>{form.country_error}</span>
              )}
              </div>
              
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">City</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="text"
                    value={form.city}
                    onChange={(e) => updateForm({ city: e.target.value })}
                  />
                </div>
                {form.city_error !== "" && (
                  <span style={{ color: "red" }}>{form.city_error}</span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-darkone text-size-4">Area</div>
                <div className="text-darkone text-size-2 border border-lightone rounded">
                  <input
                    className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                    type="text"
                    value={form.area}
                    onChange={(e) => updateForm({ area: e.target.value })}
                  />
                </div>{form.area_error !== "" && (
                <span style={{ color: "red" }}>{form.area_error}</span>
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
            <button className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={deleteMerchant}>
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={modalThreeIsOpen} onClose={() => setModalThreeIsOpen(false)}>
        <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
          <div className="flex items-center justify-between w-full">
            <div className="text-darkone text-head-2">View Message</div>
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
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <div className="text-darkone text-size-4">Message</div>
                <div className="text-lightone text-size-4">
                  10 sep 2024, 12:30 am
                </div>
              </div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <textarea
                  className="w-full h-[150px] focus:ring-0 focus:outline-none border-none bg-transparent resize-none"
                  placeholder="Message title"
                ></textarea>
              </div>
            </div>
            {messageReply && (
              <>
                <div className="flex flex-col gap-4">
                  <div className="text-darkone text-size-2 border border-lightone rounded">
                    <input
                      className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                      type="text"
                      placeholder="Type your reply"
                    />
                  </div>
                </div>
                <div className="flex items-center ml-auto gap-6">
                  <button
                    onClick={() => setModalIsOpen(false)}
                    className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded"
                  >
                    Cancel
                  </button>
                  <button
                    className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
            {!messageReply && (
              <button
                onClick={() => setMessageReply(true)}
                className="text-white text-head-1 ml-auto font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
}
