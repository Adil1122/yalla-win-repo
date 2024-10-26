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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CountryCitySearch } from "@/components/CountryCitySearch";
import Link from "next/link";
import Modal from "@/components/modal";

type Tab = "app" | "web";
type SearchScope = "cities" | "countries";
type ScheduleTab = "daily" | "weekly" | "monthly";

export default function AdminUserManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("app");
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [searchType, setSearchType] = useState<SearchScope>("cities");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false);
  const [messageReply, setMessageReply] = useState<boolean>(false);
  const [scheduleTab, setScheduleTab] = useState('daily');

  /*const handleButtonClick = () => {
    if (inputRef?.current) {
      inputRef.current.click();
    }
  };*/

  /*const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };*/

  const handleCustomerActionClick = (action: "add" | "edit") => {
    {
      /* manipulate modal as per the action */
    }
    setModalTwoIsOpen(true);
  };

  const handleCommentClick = () => {
    setModalIsOpen(true);
  };

  var user_type:any = 'app';
  var skip = 0;
  var schedule = 'daily';

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    user_type = tab;
    schedule = scheduleTab
    console.log('user_type: ', user_type)
    getUsers()
  };

  const habdleScheduleTabChange = (tab: ScheduleTab) => {
    schedule = tab;
    user_type = activeTab;
    setScheduleTab(tab)
    getUsers()
  }

  const [image, setImage] = useState<File | undefined>();
  const [chosenFileName, setChosenFileName] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const inputFileRef: any = useRef();

  var [id, setId] = useState("");

  var [form, setForm] = useState({
    name: "",
    residentialAddress: "",
    email: "",
    password: "",
    country: "",
    city: "",
    area: "",
    mobile: "",
    image: "",

    name_error: "",
    email_error: "",
    residentialAddress_error: "",
    password_error: "",
    country_error: "",
    city_error: "",
    area_error: "",
    mobile_error: "",
    server_error: "",
    server_success: "",
  });

  function openCreatePopup() {
    setForm({
      name: "",
      residentialAddress: "",
      email: "",
      password: "",
      country: "",
      city: "",
      area: "",
      mobile: "",
      image: "",

      name_error: "",
      residentialAddress_error: "",
      email_error: "",
      password_error: "",
      country_error: "",
      city_error: "",
      area_error: "",
      mobile_error: "",
      server_error: "",
      server_success: "",
    });

    setId("");
    setPreviewImage('')
    setModalTwoIsOpen(true);
  }

  async function openEditPopup(id: any) {
    setId(id);
    var url = "/api/admin/user-management?id=" + id;
    let response = await fetch(url, {
      method: "PATCH",
    });
    const content = await response.json();
    if (!response.ok) {
    } else {
      setForm({
        name: content.result.name,
        residentialAddress: content.result.residentialAddress,
        email: content.result.email,
        password: content.result.password,
        country: content.result.country,
        city: content.result.city,
        area: content.result.area,
        mobile: content.result.mobile,
        image: content.result.image,

        name_error: "",
        residentialAddress_error: "",
        email_error: "",
        password_error: "",
        country_error: "",
        city_error: "",
        area_error: "",
        mobile_error: "",
        server_error: "",
        server_success: "",
      });
      setPreviewImage('')
      setModalTwoIsOpen(true);
    }
  }

  function updateForm(value: any) {
    console.log(value);
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  /*function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }*/

  const handleChangeFile = (e: any) => {
    const files = e.currentTarget.files;
    if (files) {
      setImage(files[0]);
      var preview_url = URL.createObjectURL(files[0]);
      setPreviewImage(preview_url)
      //console.log(preview_url)
      setChosenFileName(files[0].name + '');
      console.log('selected image: ', files[0])
    }
 }

  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    inputFileRef.current.click();
  };

  function isValidateErrorForm() {
    var err = {
      name_error: "",
      residentialAddress_error: "",
      email_error: "",
      password_error: "",
      country_error: "",
      city_error: "",
      area_error: "",
      mobile_error: "",
      image_error: "",
    };
    var is_error = false;

    // Validation logic
    if (form.name === "") {
      console.log(1)
      err["name_error"] = "Name is Required";
      is_error = true;
    }
    if (form.residentialAddress === "") {
      console.log(2)
      err["residentialAddress_error"] = "ResidentialAddress is Required";
      is_error = true;
    }

    if (form.email === "") {
      console.log(3)
      err["email_error"] = "email is Required";
      is_error = true;
    }

    if (form.password === "") {
      err["password_error"] = "password  is Required";
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
    if (form.mobile === "") {
      err["mobile_error"] = "Mobile is Required";
      is_error = true;
    }

    if (typeof image !== 'undefined') {
      var image_type = image.type;
      if (image_type.indexOf('image/') === -1) {
         err['image_error'] = 'Invalid image format';
         is_error = true;
      }
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
      formData.append("residentialAddress", form.residentialAddress);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("country", form.country);
      formData.append("city", form.city);
      formData.append("area", form.area);
      formData.append("mobile", form.mobile);
      formData.append('user_type', user_type);
      formData.append('platform', 'web');
      if (typeof image !== "undefined") {
        formData.append("image", image);
      }
      

      var url = "/api/admin/user-management";
      var method = "POST";
      var success_message = "User created successfully.";
      if (id !== "") {
        url = "/api/admin/user-management?id=" + id;
        method = "PUT";
        success_message = "User updated successfully.";
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
          /*setForm((prev) => {
            return { ...prev, server_success: success_message };
          });*/
          user_type = activeTab;
          schedule = scheduleTab
          setModalTwoIsOpen(false);
          getTotalRecords()
        }
      } catch (error) {
        setForm((prev) => {
          return {
            ...prev,
            server_error: `A problem occurred with your fetch operation: ${error}`,
          };
        });
        setModalTwoIsOpen(false);
      }
    }
  }

  var [users, setUsers] = useState<any>([]);
  var [invoices, setInvoices] = useState<any>([]);

   useEffect(() => {
      getTotalRecords()
      schedule = scheduleTab
   }, [selectedItem])

   var [app_users_count, setAppUsersCount] = useState(0);
   var [web_users_count, setWebUsersCount] = useState(0);
   var [search_by, setSearchBy] = useState('country');
   var [search, setSearch] = useState('');

   var getTotalRecords = async() => {
      try {
         var selected_name = selectedItem !== null ? selectedItem.name : ''
         let response = await fetch('/api/admin/user-management?search_by=' + searchType + '&search=' + selected_name + '&schedule=' + schedule, {
            method: 'OPTIONS',
         });
         var content = await response.json();
         if(!response.ok) {

         } else {
            setAppUsersCount(content.app_users_count)
            setWebUsersCount(content.web_users_count)
            getUsers();
         }
      } catch (error) {
         
      }
   }

   var getUsers = async() => {
    console.log('user_tyoe_get: ', user_type)
      try {
         var selected_name = selectedItem !== null ? selectedItem.name : ''
         let response = await fetch('/api/admin/user-management?user_type=' + user_type + '&skip=' + skip + '&limit=' + recordsPerPage + '&search_by=' + searchType + '&search=' + selected_name + '&schedule=' + schedule, {
            method: 'GET',
         });
         var content = await response.json();

         if(!response.ok) {

         } else {
            console.log('content page: ', content)
            setUsers(content.users)
            setInvoices(content.invoices)
         }

      } catch (error) {
      }
   }

   function setIdAndOpenDeletePopup(Id: any) {
      setId(Id);
      setModalTwoIsOpen(true);
   }

   var deleteUser = async() => {
    let response = await fetch('/api/admin/user-management?id=' + id, {
       method: 'DELETE',
    });
    var content = await response.json();
    setId('');
    setModalTwoIsOpen(false)

    if(!response.ok) {

    } else {
       user_type = activeTab;
       getTotalRecords();
    }
 } 

 var totalPages = 0;
 var [currentPage, setCurrentPage] = useState(1);
 var [recordsPerPage, setRecordsPerPages] = useState(5);

 if(activeTab === 'app') {
    totalPages = app_users_count;
 } else if(activeTab === 'web') {
    totalPages = web_users_count;
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
    getUsers()
    setCurrentPage(current_page);
 }

 const handleRadioChange = (event: any) => {
   setSearchType(event.target.value)
   schedule = scheduleTab
 }

 const handleMenuItemClick = (event: any) => {
   event.stopPropagation()
 }

  return ( 
    <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
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
          <button
            type="button"
            onClick={() => openCreatePopup()}
            className="flex items-center border gap-3 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto"
          >
            <FontAwesomeIcon size="lg" icon={faPlus} />
            <div className="capitalize font-medium text-size-2">
              Add New User
            </div>
          </button>
        </div>
        <div className="flex flex-row gap-8 mt-12">
          <div className="flex items-center w-full lg:w-1/2 max-w-xl border-[2px] border-white text-white font-bold text-size-4">
            <div
              className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${
                activeTab === "app" ? "bg-white text-darkone" : "text-white"
              }`}
              onClick={() => handleTabChange("app")}
            >
              App Users
            </div>
            <div
              className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${
                activeTab === "web" ? "bg-white text-darkone" : "text-white"
              }`}
              onClick={() => handleTabChange("web")}
            >
              Website Users
            </div>
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
        </div>
        <div className="flex flex-col mt-12">
          {activeTab == "app" && <></>}

          {activeTab == "web" && <></>}

          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Name
                </th>
                {/* <th
                  scope="col"
                  className="w-[11%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Registeration
                </th> */}
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
                  Password
                </th>

                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  City
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Country
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone"
                >
                  Last Order
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
              users.map((user: any) => (
              <tr key={user._id}>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {user.name}
                </td>
                {/* <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {user._id}
                </td> */}
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {user.email}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {user.password_text}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {user.city}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {user.country}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                  {user.mobile}
                </td>
                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                {
                  invoices.map((invoice: any, index: any) => (
                    invoice.user_id === user._id && (
                      <span key={index}>{invoice._id}</span>
                    )
                  ))
                }
                </td>
                <td>
                  <div key={user._id + '0'} className="flex items-center justify-center gap-2">
                    <Link
                      href={"user-management/profile/" + user._id}
                      className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2"
                    >
                      <FontAwesomeIcon size="lg" icon={faEye} />
                    </Link>
                    <button
                      type="button"
                      onClick={handleCommentClick}
                      className="relative text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2"
                    >
                      <span className="absolute -top-4 -right-1 bg-white rounded-full text-darkone font-semibold text-sm w-[20px] flex items-center justify-center h-[20px]">
                        1
                      </span>
                      <FontAwesomeIcon size="lg" icon={faCommentAlt} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => openEditPopup(user._id)}
                      className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2"
                    >
                      <FontAwesomeIcon size="lg" icon={faPencil} />
                    </button>
                  </div>
                </td>
              </tr>
              ))}


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
                  <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" >
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

      <Modal open={modalTwoIsOpen} onClose={() => setModalTwoIsOpen(false)}>
        <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
          <div className="flex items-center justify-between w-full">
            <div className="text-darkone text-head-2">Add New Customer</div>
            <div
              onClick={() => setModalTwoIsOpen(false)}
              className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center"
            >
              <FontAwesomeIcon
                size="lg"
                icon={faTimes}
                className="text-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 justify-center">
            <div className="border border-lightone flex items-center justify-center rounded-full h-[100px] w-[100px]">
              <img className="rounded-full" src={previewImage !== '' ? previewImage : form.image} alt="Profile" onClick={onBtnClick} />
            </div>
            <button
              type="button"
              onClick={onBtnClick}
              className="text-darkone text-size-4"
            >
              Add Image
            </button>
            <input
              accept="image/*"
              type="file"
              className="hidden"
              ref={inputFileRef}
              onChange={handleChangeFile} 
            />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">Name</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="text"
                  placeholder="Username"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
              {form.name_error !== "" && (
                <span style={{ color: "red" }}>{form.name_error}</span>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">Email Address</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="email"
                  placeholder="example@email.com"
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
                  placeholder="12345678"value={form.password}
                  onChange={(e) => updateForm({ password: e.target.value })} />
               </div>
               {
                  form.password_error !== '' && (
                     <span style={{color: "red"}}>{form.password_error}</span>
                  )
               }
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">Phone Number</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="text"
                  placeholder="(96) 27617199"value={form.mobile}
                  onChange={(e) => updateForm({ mobile: e.target.value })} />
               </div>
               {
                  form.mobile_error !== '' && (
                     <span style={{color: "red"}}>{form.mobile_error}</span>
                  )
               }
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">Address</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="text"
                  placeholder="street address" value={form.residentialAddress}
                  onChange={(e) => updateForm({ residentialAddress: e.target.value })} />
               </div>
               {
                  form.residentialAddress_error !== '' && (
                     <span style={{color: "red"}}>{form.residentialAddress_error}</span>
                  )
               }
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">City</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="text"
                  placeholder="Dubai" value={form.city}
                  onChange={(e) => updateForm({ city: e.target.value })} />
               </div>
               {
                  form.city_error !== '' && (
                     <span style={{color: "red"}}>{form.city_error}</span>
                  )
               }
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">Country</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="text"
                  placeholder="United Arab Emirates" value={form.country}
                  onChange={(e) => updateForm({ country: e.target.value })} />
               </div>
               {
                  form.country_error !== '' && (
                     <span style={{color: "red"}}>{form.country_error}</span>
                  )
               }
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-darkone text-size-4">Area</div>
              <div className="text-darkone text-size-2 border border-lightone rounded">
                <input
                  className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                  type="text"
                  placeholder="United Arab Emirates" value={form.area}
                  onChange={(e) => updateForm({ area: e.target.value })} />
               </div>
               {
                  form.area_error !== '' && (
                     <span style={{color: "red"}}>{form.area_error}</span>
                  )
               }
            </div>

            <div className="flex items-center ml-auto gap-6">
              <button
                onClick={() => setModalTwoIsOpen(false)}
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
    </section>
  );
}
