'use client'

import React, { useState } from 'react'
//import {APIProvider, Map} from '@vis.gl/react-google-maps'
import Link from 'next/link'
import GoogleMap from '@/components/GoogleMap'

export default function ContactPage() {

   var [form, setForm] = useState({
      first_name: "",
      last_name: "",
      email: "",
      topic: "",
      message: "",

      first_name_error: "",
      last_name_error: "",
      email_error: "",
      topic_error: "",
      message_error: ""
   });

   function isValidateErrorForm() {
      var err = {
         first_name_error: "",
         last_name_error: "",
         email_error: "",
         topic_error: "",
         message_error: ""
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

      if (form.email === '') {
         err['email_error'] = 'Email is Required';
         is_error = true;
      }

      if (form.topic === '') {
         err['topic_error'] = 'Topic is Required';
         is_error = true;
      }

      if (form.message === '') {
         err['message_error'] = 'Message is Required';
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
         formData.append('first_name', form.first_name);
         formData.append('last_name', form.last_name);
         formData.append('email', form.email);
         formData.append('topic', form.topic);
         formData.append('message', form.message);

         var url = '/api/user/contact-us';
         var method = 'POST';

         try {
            let response = await fetch(url, {
               method: method,
               body: formData
            });

            var content = await response.json()

            if (!response.ok) {
               alert(content.messge)
            } else {
               alert(content.messge)
            }
            resetForm()
         } catch (error) {
            alert(content.messge)
            resetForm()
         }
      }
   }

   function updateForm(value: any) {
      console.log(value)
      return setForm((prev) => {
         return { ...prev, ...value };
      });
   }

   function resetForm() {
      setForm({
         first_name: "",
         last_name: "",
         email: "",
         topic: "",
         message: "",
   
         first_name_error: "",
         last_name_error: "",
         email_error: "",
         topic_error: "",
         message_error: ""
      });
   }
   
   return (
      <section className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo">
         <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo px-8 lg:px-12 py-12 lg:py-36 font-inter-regular">
            <div className="flex flex-col lg:flex-row gap-12">
               <div className="relative flex flex-col w-full lg:w-[55%] lg:gap-6 gap-3 lg:text-size-4 text-size-2">
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="first_name" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">First Name</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                           <input id="first_name" name="first_name" className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0" type="text" placeholder="First Name"
                           value={form.first_name}
                           onChange={(e) => updateForm({ first_name: e.target.value })} />
                        </div>

                        {
                           form.first_name_error !== '' && (
                              <span style={{color: "red"}}>{form.first_name_error}</span>
                           )
                        }

                     </div>
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="last_name" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">Last Name</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                           <input id="last_name" name="last_name" className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0" type="text" placeholder="Last Name"
                           value={form.last_name}
                           onChange={(e) => updateForm({ last_name: e.target.value })} />
                        </div>

                        {
                           form.last_name_error !== '' && (
                              <span style={{color: "red"}}>{form.last_name_error}</span>
                           )
                        }

                     </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="email" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">Email</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                           <input id="email" name="email" className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0" type="text" placeholder="Email"
                           value={form.email}
                           onChange={(e) => updateForm({ email: e.target.value })} />
                        </div>

                        {
                           form.email_error !== '' && (
                              <span style={{color: "red"}}>{form.email_error}</span>
                           )
                        }

                     </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="topic" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">Topic</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
                           <select id="topic" name="topic" className="w-full focus:ring-0 border-none bg-transparent text-size-3 outline-none focus:outline-none cursor-pointer" value={form.topic} onChange={(e) => updateForm({ topic: e.target.value })}>
                              <option value="">Select Inquiry</option>
                              <option value="General Inquiry">General Inquiry</option>
                           </select>
                        </div>

                        {
                           form.topic_error !== '' && (
                              <span style={{color: "red"}}>{form.topic_error}</span>
                           )
                        }

                     </div>
                  </div>
               </div>
               <div className="lg:w-[45%] lg:h-auto flex rounded-standard flex-col gap-8 w-0 h-0">
                  {/*<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}>
                     <Map
                        style={{width: '100%', height: '350px', borderRadius: '10px'}}
                        defaultCenter={{lat: 48.8575, lng: 2.3514}}
                        defaultZoom={3}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                     />
                  </APIProvider>*/}
                  <GoogleMap lat={25.276987} lon={55.296249} center_name='Yalla Win' zoom={11} height="400px" coords={[]} />
               </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:gap-12 mt-2">
               <div className="flex flex-col gap-4 lg:w-[55%] lg:gap-8 gap-3 lg:text-size-4 text-size-2">
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                     <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="message" className="text-theme-topo-1 flex items-end gap-2 ml-2">
                           <span className="font-medium text-white">Message</span>
                        </label>
                        <div className="bg-white rounded-lg px-5 lg:py-6 py-4 shadow-custom-1 relative flex">
                           <textarea className="w-full h-[250px] focus:ring-0 focus:outline-none border-none bg-transparent resize-none" id="message" name="message"
                           onChange={(e) => updateForm({ message: e.target.value })}>
                              {form.message}
                           </textarea>
                        </div>

                        {
                           form.message_error !== '' && (
                              <span style={{color: "red"}}>{form.message_error}</span>
                           )
                        }

                     </div>
                  </div>
                  <button className="text-center text-themeone font-medium py-3 bg-white rounded-standard" onClick={onSubmit}>Submit</button>
               </div>
               <div className="flex lg:hidden rounded-standard flex-col gap-8 mt-10">
                  {/*<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}>
                     <Map
                        style={{width: '100%', height: '350px', borderRadius: '10px'}}
                        defaultCenter={{lat: 48.8575, lng: 2.3514}}
                        defaultZoom={3}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                     />
                  </APIProvider>*/}
                  <GoogleMap lat={25.276987} lon={55.296249} center_name='Yalla Win' zoom={11} height="400px" coords={[]} />
                  
               </div>
               <div className="flex flex-col gap-4 w-full w-full lg:w-[45%] lg:text-size-4 text-size-2">
                  <div className="flex flex-col gap-3">
                     <label htmlFor="first-name" className="text-theme-topo-1 flex items-end gap-2 ml-2 opacity-0">
                        <span className="font-medium text-white">Message</span>
                     </label>
                     <div className="flex flex-col lg:gap-8 gap-3">
                        <div className="w-full py-6 bg-white rounded-lg px-5 py-4 flex flex-col">
                           <div className="h-[250px] flex flex-col justify-between">
                              <h4 className="text-head-4 font-bold mt-4">Yalla Draw Headquarters</h4>
                              <div className="flex flex-col gap-1 text-size-2">
                                 <div>Full</div>
                                 <div>Address</div>
                                 <div>Here</div>
                              </div>
                              <div className="flex flex-row mb-4">
                                 <div className="flex flex-col flex-1">
                                    <div className="font-bold text-head-2">Call us now</div>
                                    <div className="text-size-2">Phone number here</div>
                                 </div>
                                 <div className="flex flex-col flex-1">
                                    <div className="font-bold text-head-2">Write us an email</div>
                                    <Link className="text-size-2" href="mailto:support@yalladraw.com">support@yalladraw.com</Link>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center bg-white py-2 justify-center gap-16 rounded-standard">
                           <div className="font-bold text-size-4">Live chat with us</div>
                           <img className="max-h-[30px]" src="/assets/images/online-chat.svg" alt="" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
