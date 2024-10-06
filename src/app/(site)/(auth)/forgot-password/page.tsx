'use client';

import { useState } from "react";
import Image from "next/image";
import Notification from "@/components/notificationWidget";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import signUpImg from '@/../public/assets/images/signup.png'


export default function ForgotPasswordPage() {

   const [form, setForm] = useState({
      email: "",
      email_error: "",
      server_error: "",
      server_success: "",
    });

    function updateForm(value: any) {
      return setForm((prev) => {
        return { ...prev, ...value };
      });
    }

    function isValidateErrorForm() {

      var err = {
         
         email_error: ""
         
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

      setForm((prev) => {
         return { ...prev, ...err };
       });

      return is_error;

  }

   const handleSubmit = async () => {
      try {
         //const person = { ...form };
         if(!isValidateErrorForm()) {
            const response = await fetch('/api/website/send-reset-email', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ ...form }),
            });

            const content = await response.json();

            if (!response.ok) {
               setForm((prev) => {
                  return { ...prev, ...{server_error: `HTTP error! status: ${response.status}`} };
                });
            } else {
               if(response.status === 200) {

                  setForm((prev) => {
                     return { ...prev, ...{server_success: content.message} };
                   });

               } else if(response.status === 201) {
                  setForm((prev) => {
                     return { ...prev, ...{server_error: content.message} };
                   });
               }
            }
         } else {
            console.log('validatedd')
         }
      } catch (error) {
      }
   };

   return (
      <div className="flex flex-row flex-grow h-full w-full bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo px-8 md:px-12 py-12 md:py-36 gap-6 font-inter-regular">
         <div className="relative flex flex-col w-full md:w-[55%] md:gap-6 gap-3 md:text-size-4 text-size-2">
            <div className="flex flex-col gap-3">
               <label htmlFor="email-address" className="text-theme-topo-1 flex items-end gap-2 ml-2">
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
            <div className="text-center cursor-pointer text-themeone text-size-3 rounded-full shadow-custom-1 py-4 bg-white mt-12 font-semibold" onClick={handleSubmit}>
               Send Reset Link
            </div>
         </div>
         <div className="hidden md:block md:w-[45%]">
         <Image width={700} height={500}  className="ml-auto" alt="user signup" src={signUpImg}></Image>
         </div>
         { form.server_error !== '' && 
            <Notification message="Server Error" description={form.server_error} type='error'  />  
         }

         { form.server_success !== '' && 
            <Notification message="Success ..." description={form.server_success} type='success'  />  
         }
      </div>
   );
}
