'use client'

//import Link from "next/link"
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import Notification from "@/components/notificationWidget"
import { useAuth } from '@/components/AuthContext';

export default function VerifyOTPPage() { 

    const router = useRouter()
   const [showNotification, setShowNotification] = useState<boolean>(false);
   const [notificationMessage, setNotificationMessage] = useState<string>('');
    const { setLoggedIn } = useAuth();
    

   const [form, setForm] = useState({
      otp: "",
      otp_matched: '',
      server_error: ''
    });

    function updateForm(value: any) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
      }

    async function onSubmit(e: any) {
      e.preventDefault();
      try {
   
         var otp = localStorage.getItem('otp_number') as string;
         var otpType = localStorage.getItem('otp_type') as string;
         var otp_user = localStorage.getItem('otp_user') as any;

         console.log(otp, form.otp)
         if(form.otp === otp) {
            var otp_user_object = JSON.parse(otp_user + '');
            var activate_user = {
               email: otp_user_object.email,
               saved_otp: otp,
               otp: form.otp
            }
            console.log(activate_user)
            let response = await fetch("api/website/activate_user", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(activate_user),
            });
            const content = await response.json();
            console.log(content)
            if(response.status === 200) {
               localStorage.setItem('yalla_logged_in_user', otp_user + '');
               localStorage.removeItem('otp_user');
               localStorage.removeItem('otp_number');
               setForm((prev) => {
                  return { ...prev, ...{otp_matched: 'yes'} };
                });
                setLoggedIn(true);
               router.push('/')
            } else {
               setForm((prev) => {
                  return { ...prev, ...{server_error: `HTTP error! status: ${response.status}`} };
                });
            }

         } else {
            setForm((prev) => {
               return { ...prev, ...{otp_matched: 'no'} };
             });
         }
      } catch (error) {
        console.error('A problem occurred with your fetch operation: ', error);
      } finally {
        //navigate("/");
      }
    }

    const resendOtp =  async () => {

      var otp = localStorage.getItem('otp_number') as string;
      var otpType = localStorage.getItem('otp_type') as string;
      var otp_user = localStorage.getItem('otp_user') as any;

      let formData = new FormData();
         formData.append('type', otpType);
         formData.append('email', JSON.parse(otp_user).email);

         try {
            let response = await fetch("api/website/resend-otp", {
               method: "POST",
               body: formData
            });
            const content = await response.json();

            if (!response.ok) {
               setForm((prev) => {
                  return { ...prev, server_error: `HTTP error! status: ${response.status}` };
               });
            } else {
               if (response.status === 200) {
                  
                  localStorage.setItem('otp_number', content.otp);
                  setShowNotification(true)
                  setNotificationMessage('Otp Resent successfully!')
               }
            }
         } catch (error) {
            setForm((prev) => {
               return { ...prev, server_error: `A problem occurred with your fetch operation: ${error}` };
            });
         }
   }


   return (
      <div className="flex flex-row flex-grow h-full w-full bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo px-8 lg:px-12 py-12 lg:py-36 gap-6 font-inter-regular">
         <div className="flex flex-col w-full lg:w-[55%] lg:gap-6 gap-3 lg:text-size-4 text-size-2">
            <div className="flex flex-col gap-3">
               <label htmlFor="email" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                  <span className="font-medium text-white">OTP</span>
               </label>
               <div className="bg-white rounded-lg px-5 lg:py-6 py-4 shadow-custom-1 relative flex">
                  <input id="otp" name="otp" className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none" type="text" placeholder="OTP"
                  value={form.otp} onChange={(e) => updateForm({ otp: e.target.value })} />

                  { form.otp_matched === 'no' && (
                  <>  
                  <span title="This field is required" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto">
                     <ExclamationCircleIcon className="size-6 lg:size-10" />
                  </span>
                  <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                     OTP Missmatched
                  </span>
                  </>
                  )}

               </div>
            </div>

            
            <div className="flex flex-col mt-auto">  
               <div className="text-center text-themeone text-size-2 lg:text-size-3 rounded-full shadow-custom-1 py-4 bg-white mt-12 font-semibold cursor-pointer" onClick={onSubmit}>Verify</div>
            </div>
            <div className="flex flex-row gap-4 ml-auto">
                  <div>Verification code not recieved?</div>
                  <div onClick={() => resendOtp} className="underline text-black cursor-pointer">Resend code</div>
            </div>
         </div>
         <div className={`hidden lg:block lg:w-[45%] flex-grow relative bg-[url("/assets/images/signup.svg")] bg-center bg-cover bg-no-repeat rounded-3xl`}></div>

         { form.server_error !== '' && 
            <Notification message="Server Error" description={form.server_error} type='error'  close={() => {setForm((prev: any) => ({ ...prev, server_error: '' }))}} />  
         } 

         { showNotification && 
            <Notification message="Success ..." description={notificationMessage} type='success' close={() => setShowNotification(false)} />  
         }
      </div>
   )
}