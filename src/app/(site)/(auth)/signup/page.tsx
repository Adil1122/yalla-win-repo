'use client'

import Image from "next/image"
import signUpImg from '@/../public/assets/images/signup.png'
import checkIcon from '@/../public/assets/images/check.svg'
import { ChatBubbleLeftEllipsisIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import Notification from "@/components/notificationWidget"
import { useState, useLayoutEffect } from "react";
import { useRouter } from 'next/navigation';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

export default function SignUpPage() {
   const router = useRouter();

   useLayoutEffect(() => {
      if (localStorage.getItem('yalla_logged_in_user') !== null) {
         router.push('/');
      }
   }, []);

   const [image, setImage] = useState<File | undefined>();
   const [mobile_value, setMobileValue] = useState<any>('');
   const [form, setForm] = useState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirm: "",
      country_code: "971",
      mobile: "",
      notification_type: "email",
      agree: "",
      dateOfBirth: "",
      shippingAddress: "",
      residentialAddress: "",
      state: "",
      country: "",
      city: "",
      area: "",




      first_name_error: "",
      last_name_error: "",
      email_error: "",
      password_error: "",
      password_confirm_error: "",
      country_code_error: "",
      mobile_error: "",
      image_error: "",
      dateOfBirth_error: "",
      shippingAddress_error: "",
      residentialAddress_error: "",
      state_error: "",
      country_error: "",
      city_error: "",
      area_error: "",
      server_error: ""
      
   }); 

   function updateForm(value: any) {
      return setForm((prev) => {
         return { ...prev, ...value };
      });
   }

   const updateMobileValue = (e: any) => {
      //console.log('eee: ', e)
      setMobileValue(e)
   }

   const handleChangeFile = (e: any) => {
      const files = e.currentTarget.files;
      if (files)
         setImage(files[0]);
   }

   function isValidateErrorForm() {
      var err = {
         first_name_error: "",
         last_name_error: "",
         email_error: "",
         password_error: "",
         password_confirm_error: "",
         country_code_error: "",
         mobile_error: "",
         image_error: "",
         dateOfBirth_error: "",
         shippingAddress_error: "",
         residentialAddress_error: "",
         country_error: "",
         city_error: "",
         state_error: "",
         area_error: "",
      };
      var is_error = false;

      // Validation logic
      if (form.first_name === '') {
         err['first_name_error'] = 'First Name is Required';
         is_error = true;
      }

      if (form.last_name === '') {
         err['last_name_error'] = 'Last Name is Required';
         is_error = true;
      }

      var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (form.email === '') {
         err['email_error'] = 'Email is Required';
         is_error = true;
      } else if (!form.email.match(validRegex)) {
         err['email_error'] = 'Email is invalid';
         is_error = true;
      }

      if (form.dateOfBirth === '') {
         err['dateOfBirth_error'] = 'Date Of Birth is Required';
         is_error = true;
      }

      if (form.shippingAddress === '') {
         err['shippingAddress_error'] = 'Shipping Address is Required';
         is_error = true;
      }

      if (form.residentialAddress === '') {
         err['residentialAddress_error'] = 'Residential Address is Required';
         is_error = true;
      }

      if (form.state === '') {
         err['state_error'] = 'State is Required';
         is_error = true;
      }

      if (form.password === '') {
         err['password_error'] = 'Password is Required';
         is_error = true;
      }

      if (form.password !== form.password_confirm) {
         err['password_confirm_error'] = 'Password Confirmation mismatched';
         is_error = true;
      }


      //console.log('mobile_value: ', mobile_value)
      if(mobile_value === '') {
         err['mobile_error'] = 'Mobile Number is Required';
         is_error = true;
      }

      /*if (form.mobile === '') {
         err['mobile_error'] = 'Mobile Number is Required';
         is_error = true;
      }*/

      if (form.country === '') {
         err['country_error'] = 'Country is Required';
         is_error = true;
      }
      if (form.city === '') {
         err['city_error'] = 'Country is Required';
         is_error = true;
      }
      if (form.area === '') {
         err['area_error'] = 'Area is Required';
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

      return is_error;
   }

   async function onSubmit(e: any) {
      e.preventDefault();
      if (!isValidateErrorForm()) {
         let formData = new FormData();
         formData.append('first_name', form.first_name);
         formData.append('last_name', form.last_name);
         formData.append('email', form.email);
         formData.append('dateOfBirth', form.dateOfBirth);
         formData.append('shippingAddress', form.shippingAddress);
         formData.append('residentialAddress', form.residentialAddress);
         formData.append('state', form.state);
         formData.append('country', form.country);
         formData.append('city', form.city);
         formData.append('area', form.area);
         formData.append('password', form.password);
         formData.append('password_confirm', form.password_confirm);
         formData.append('country_code', form.country_code);
         formData.append('mobile', mobile_value);
         formData.append('notification_type', form.notification_type);
         formData.append('user_type', 'web');
         if (typeof image !== 'undefined') {
            formData.append('image', image);
         }

         try {
            let response = await fetch("api/website/register", {
               method: "POST",
               body: formData
            });
            const content = await response.json();

            if (!response.ok) {
               setForm((prev) => {
                  return { ...prev, server_error: `HTTP error! status: ${response.status}` };
               });
            } else {
               if (response.status === 201) {
                  setForm((prev) => {
                     return { ...prev, email_error: 'User Already Exists.' };
                  });
               } else if (response.status === 200) {
                  localStorage.setItem('otp_number', content.otp);
                  localStorage.setItem('otp_type', form.notification_type);
                  localStorage.setItem('otp_user', JSON.stringify(content.result));
                  router.push("/verify-otp");
               }
            }
         } catch (error) {
            setForm((prev) => {
               return { ...prev, server_error: `A problem occurred with your fetch operation: ${error}` };
            });
         }
      }
   }

   return (
      <div className="flex flex-row flex-grow h-full w-full bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo px-8 lg:px-12 py-12 lg:py-36 gap-6 font-inter-regular">
         <div className="relative flex flex-col w-full lg:w-[55%] lg:gap-6 gap-3 lg:text-size-4 text-size-2">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="first-name"
                     className="text-theme-topo-1 flex items-end gap-2 ml-2"
                  >
                     <span className="font-medium text-white">First Name</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="first_name"
                        name="first_name"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:ring-0 focus:outline-none"
                        type="text"
                        placeholder="First Name"
                        value={form.first_name}
                        onChange={(e) => updateForm({ first_name: e.target.value })}
                     />

                     {form.first_name_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.first_name_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>
               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="last_name"
                     className="text-theme-topo-1 flex items-end gap-2 ml-2"
                  >
                     <span className="font-medium text-white">Last Name</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="last_name"
                        name="last_name"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:ring-0 focus:outline-none"
                        type="text"
                        placeholder="Last Name"
                        value={form.last_name}
                        onChange={(e) => updateForm({ last_name: e.target.value })}
                     />

                     {form.last_name_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.last_name_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>
            </div>
            <div className="flex flex-col gap-3">
               <div className="flex flex-col gap-3">
                  <label
                     htmlFor="email"
                     className="text-theme-topo-1 flex items-end gap-2 ml-2"
                  >
                     <span className="font-medium text-white">Email</span>
                  </label>
                  <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                     <input
                        id="email"
                        name="email"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                     />

                     {form.email_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.email_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-3">
               <div className="flex flex-col gap-3">
                  <label
                     htmlFor="email"
                     className="text-theme-topo-1 flex items-end gap-2 ml-2"
                  >
                     <span className="font-medium text-white">Photo</span>
                  </label>
                  <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                     <input
                        id="image"
                        name="image"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="file"
                        onChange={handleChangeFile}
                     />

                     {form.image_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.image_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="dateOfBirth"
                     className="text-theme-topo-1 flex items-end gap-2 ml-2"
                  >
                     <span className="font-medium text-white">Date of Birth</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="date"
                        placeholder="Date of Birth"
                        value={form.dateOfBirth}
                        onChange={(e) => updateForm({ dateOfBirth: e.target.value })}
                     />

                     {form.dateOfBirth_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.dateOfBirth_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>

               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="shippingAddress"
                     className="text-theme-topo-1 flex items-end gap-2 ml-2"
                  >
                     <span className="font-medium text-white">Shipping Address</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="shippingAddress"
                        name="shippingAddress"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Shipping Address"
                        value={form.shippingAddress}
                        onChange={(e) =>
                           updateForm({ shippingAddress: e.target.value })
                        }
                     />

                     {form.shippingAddress_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.shippingAddress_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="residentialAddress"
                     className="text-theme-topo-1 flex items-end gap-2 ml-2"
                  >
                     <span className="font-medium text-white">
                        Residential Address
                     </span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="residentialAddress"
                        name="residentialAddress"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Residential Address"
                        value={form.residentialAddress}
                        onChange={(e) =>
                           updateForm({ residentialAddress: e.target.value })
                        }
                     />

                     {form.residentialAddress_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.residentialAddress_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>

               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="state"
                     className="text-theme-topo-1 flex items-end gap-2 ml-2"
                  >
                     <span className="font-medium text-white">State</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="state"
                        name="state"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="State"
                        value={form.state}
                        onChange={(e) => updateForm({ state: e.target.value })}
                     />

                     {form.state_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.state_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>
               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="state"
                     className="text-theme-topo-1 flex items-end gap-2 ml-2"
                  >
                     <span className="font-medium text-white">Area</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="area"
                        name="area"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Area"
                        value={form.area}
                        onChange={(e) => updateForm({ area: e.target.value })}
                     />

                     {form.area_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.area_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="password"
                     className="text-theme-topo-1 text-size-4 flex items-end gap-2"
                  >
                     <span className="font-medium text-white">Create Password</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="password"
                        name="password"
                        className="w-full border-none placeholder:font-normal bg-transparent text-size-4 text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                     />

                     {form.password_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.password_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>
               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="password_confirm"
                     className="text-theme-topo-1 text-size-4 flex items-end gap-2"
                  >
                     <span className="font-medium text-white">Confirm Password</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="password_confirm"
                        name="password_confirm"
                        className="w-full border-none placeholder:font-normal bg-transparent text-size-4 text-theme-topo-1 font-semibold outline-none focus:ring-0 focus:outline-none"
                        type="password"
                        placeholder="Password"
                        value={form.password_confirm}
                        onChange={(e) =>
                           updateForm({ password_confirm: e.target.value })
                        }
                     />
                  </div>
               </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
               <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="country"
                     className="text-theme-topo-1 text-size-4 flex items-end gap-2"
                  >
                     <span className="font-medium text-white">Country</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="country"
                        name="country"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) => updateForm({ country: e.target.value })}
                     />

                     {form.country_error !== "" && (
                        <>
   <span title="This field is required" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto">
   <ExclamationCircleIcon className="size-6 lg:size-10" /></span>
   <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">{form.country_error}</span></>)}</div></div>

   <div className="flex flex-col gap-3 flex-1">
                  <label
                     htmlFor="city"
                     className="text-theme-topo-1 text-size-4 flex items-end gap-2"
                  >
                     <span className="font-medium text-white">City</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     <input
                        id="city"
                        name="city"
                        className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="city"
                        value={form.city}
                        onChange={(e) => updateForm({ city: e.target.value })}
                     />

                     {form.city_error !== "" && (
                        <>
   <span title="This field is required" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto">
   <ExclamationCircleIcon className="size-6 lg:size-10" /></span>
   <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">{form.city_error}</span></>)}</div></div>
            </div>


            <div className="flex flex-row gap-4 lg:gap-6">
               {/*<div className="flex flex-col gap-3 w-[35%] lg:flex-1">
                  <label
                     htmlFor="country_code"
                     className="text-theme-topo-1 text-size-4 flex items-end gap-2"
                  >
                     <span className="font-medium text-white whitespace-nowrap">
                        Country Code
                     </span>
                  </label>
                  <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                     <select
                        id="country_code"
                        name="country_code"
                        className="w-full border-none bg-transparent text-size-3 outline-none focus:outline-none cursor-pointer focus:ring-0"
                        value={form.country_code}
                        onChange={(e) => updateForm({ country_code: e.target.value })}
                     >
                        <option value="971">971</option>
                        <option value="966">966</option>
                        <option value="973">973</option>
                     </select>
                  </div>
               </div>*/}
               <div className="flex flex-col gap-3 w-[65%] lg:flex-2">
                  <label
                     htmlFor="mobile"
                     className="text-theme-topo-1 text-size-4 flex items-end gap-2"
                  >
                     <span className="font-medium text-white">Mobile Number</span>
                  </label>
                  <div className="bg-white rounded-lg px-5  py-4 shadow-custom-1 relative flex">
                     {/*<input
                        id="mobile"
                        name="mobile"
                        className="w-full border-none placeholder:font-normal bg-transparent text-size-4 text-theme-topo-1 font-semibold outline-none focus:ring-0 focus:outline-none"
                        type="text"
                        placeholder="Mobile Number"
                        value={form.mobile}
                        onChange={(e) => updateForm({ mobile: e.target.value })}
                     />*/}

                     <PhoneInput
                           placeholder="Enter phone number"
                           value={mobile_value}
                           onChange={(e) => updateMobileValue(e)}
                           className="w-full border-none placeholder:font-normal bg-transparent text-size-4 text-theme-topo-1 font-semibold outline-none focus:ring-0 focus:outline-none"
                           />

                     {form.mobile_error !== "" && (
                        <>
                           <span
                              title="This field is required"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                           >
                              <ExclamationCircleIcon className="size-6 lg:size-10" />
                           </span>
                           <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                              {form.mobile_error}
                           </span>
                        </>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex flex-col mt-auto">
               <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 justify-between lg:items-end">
                  <div className="flex flex-row gap-1 lg:gap-0 lg:flex-col flex-1 text-white font-semibold text-size-4 lg:text-head-4">
                     <div className="flex flex-col">Select OTP </div>
                     <div>Verification method</div>
                  </div>
                  <div className="flex flex-row flex-1 justify-between">
                     
                     <div className="flex flex-col bg-white rounded-lg px-10 py-4 w-36 items-center cursor-pointer" onClick={(e) => updateForm({ notification_type: 'email' })}>
                        <ChatBubbleLeftEllipsisIcon className="size-10 text-black" />
                        <div>Email</div>
                     </div>

                     <div className="flex flex-col bg-white rounded-lg px-10 py-4 lg:w-36 items-center cursor-pointer" onClick={(e) => updateForm({ notification_type: 'sms' })}>
                        <ChatBubbleLeftEllipsisIcon className="size-10 text-black" />
                        <div>SMS</div>
                     </div>

                     <div className="flex flex-col bg-white rounded-lg px-10 py-4 w-36 items-center cursor-pointer" onClick={(e) => updateForm({ notification_type: 'whatsapp' })}>
                        <ChatBubbleLeftEllipsisIcon className="size-10 text-black" />
                        <div>WhatsApp</div>
                     </div>

                  </div>
               </div>
               <div className="flex flex-row gap-3 lg:gap-6 mt-12 items-start lg:items-center">
                  <div className="bg-white rounded lg:w-8 lg:h-8 cursor-pointer">
                     <Image alt="" width={35} src={checkIcon} />
                  </div>
                  <div className="flex flex-row text-white text-center lg:text-left text-size-4">
                     <div>
                        I agree to the{" "}
                        <span className="font-semibold">User Agreement</span> and{" "}
                        <span className="font-semibold">Privacy Policy</span>
                     </div>
                  </div>
               </div>
               <div
                  className="text-center cursor-pointer text-themeone text-size-3 rounded-full shadow-custom-1 py-4 bg-white mt-12 font-semibold"
                  onClick={onSubmit}
               >
                  Sign Up
               </div>
            </div>
         </div>
         <div className="hidden lg:block lg:w-[45%]">
            <Image
               width={700}
               className="ml-auto"
               alt="user signup"
               src={signUpImg}
            ></Image>
         </div>
         {form.server_error !== "" && (
            <Notification
               message="Server Error"
               description={form.server_error}
               type="error"
               close={() => {setForm((prev: any) => ({ ...prev, server_error: '' }))}}
            />
         )}
      </div>
   );
}
