'use client'

import Link from "next/link"
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useLayoutEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Notification from "@/components/notificationWidget";
import { useAuth } from '@/components/AuthContext';
import { platform } from "os";

export default function LoginPage() {
   const router = useRouter();
   const { setLoggedIn } = useAuth();

   useLayoutEffect(() => {
      if (localStorage.getItem('yalla_logged_in_user') !== null) {
         router.push('/');
      }
   }, []);

   const [form, setForm] = useState({
      email: "",
      password: "",
      platform: "website",
      mac: "",
      email_error: "",
      password_error: "",
      server_error: "",
    });

    function updateForm(value: any) {
      return setForm((prev) => {
        return { ...prev, ...value };
      });
    }

    function validateForm() {

      var err = {
         email_error: "",
         password_error: ""
      };
      var is_error = false;

      var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if(form.email === '') {
         err['email_error'] = 'Email is Required';
         is_error = true;
      }
      else if (!form.email.match(validRegex)) {
         err['email_error'] = 'Email is invalid';
         is_error = true;
      }

      if(form.password === '') {
         err['password_error'] = 'Password is Required';
         is_error = true;
      }

      setForm((prev) => {
         return { ...prev, ...err };
       });

      return is_error;

  }

    async function onSubmit(e: any) {
      e.preventDefault();
      if(!validateForm()) {
         const person = { ...form };
         try {
            let response = await fetch("api/website/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
            });
            const content = await response.json();
            console.log(content)
         if (!response.ok) {
            if(response.status === 400) {
               setForm((prev) => {
                  return { ...prev, ...{server_error: 'Invalid User Device ...'} };
               });
            } else {
               setForm((prev) => {
                  return { ...prev, ...{server_error: `HTTP error! status: ${response.status}`} };
               });
            }
         } else {
            if(response.status === 200) {
               localStorage.setItem('yalla_logged_in_user', JSON.stringify(content.user));
               setLoggedIn(true);
               router.push('/');
            } else {
               setForm((prev) => {
                  return { ...prev, ...{email_error: content.message} };
                });
            }
         }
         } catch (error) {
         console.error('A problem occurred with your fetch operation: ', error);
         } finally {
         //navigate("/");
         }
      }
    }


   return (
      <div className="flex flex-row flex-grow h-full w-full bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo px-8 lg:px-12 py-12 lg:py-36 gap-6 font-inter-regular">
         <div className="flex flex-col w-full lg:w-[55%] lg:gap-6 gap-3 lg:text-size-4 text-size-2">
            <div className="flex flex-col gap-3">
               <label htmlFor="email" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                  <span className="font-medium text-white">Email</span>
               </label>
               <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                  <input id="email" name="email" className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0" type="text" placeholder="Email"
                  value={form.email} onChange={(e) => updateForm({ email: e.target.value })} />
                  { form.email_error !== '' && (
                     <>   
                     <span title="This field is required" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto">
                        <ExclamationCircleIcon className="size-6 lg:size-10" />
                     </span>
                     <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                        {form.email_error}
                     </span>
                     </>
                  )}
               </div>
            </div>
            <div className="flex flex-col gap-3">
               <label htmlFor="password" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                  <span className="font-medium text-white">Password</span>
               </label>
               <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                  <input id="password" name="password" className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0" type="password" placeholder="Password"
                  value={form.password} onChange={(e) => updateForm({ password: e.target.value })} />

                  { form.password_error !== '' && (
                     <>   
                     <span title="This field is required" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto">
                        <ExclamationCircleIcon className="size-6 lg:size-10" />
                     </span>
                     <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                        {form.password_error}
                     </span>
                     </>
                  )}

               </div>
            </div>
            <div className="ml-auto">
               <Link href="/forgot-password" className="text-white font-semibold lg:text-lg text-sm">Forgot Password?</Link>
            </div>
            <div className="flex flex-col mt-auto">  
               <div className="text-center text-themeone text-size-2 lg:text-size-3 rounded-full shadow-custom-1 py-4 bg-white mt-12 font-semibold cursor-pointer" onClick={onSubmit}>Login</div>
            </div>
         </div>
         <div className={`hidden lg:block lg:w-[45%] flex-grow relative bg-[url("/assets/images/signup.svg")] bg-center bg-cover bg-no-repeat rounded-3xl`}></div>

         { form.server_error !== '' && 
            <Notification message="Server Error" description={form.server_error} type='error'  />  
         }

      </div>
   )
}