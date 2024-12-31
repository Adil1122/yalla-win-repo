'use client'

import React, { useEffect, useState } from 'react'
import { faChevronDown, faPencil, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Bars3Icon } from "@heroicons/react/24/solid"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Drawer from '../drawer'
import SideBarMenu from './sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../AuthContext'
import { useRouter } from 'next/navigation'
import Modal from '../modal'
import getDaysHoursMinsSecs from '@/libs/common';
import Notification from "@/components/notificationWidget"
import { setServers } from 'dns'

export default function DashboardTopBar() {
   
   const [isDrawerOpen, setIsDrawerOpen] = useState(false)
   const [profileModal, setProfileModal] = useState(false)
   const [changePasswordModal, setChangePasswordModal] = useState(false)
   const [logoutModal, setLogoutModal] = useState(false)
   const pathname = usePathname()
   const isUser = pathname.startsWith('/user')
   const isAdmin = pathname.startsWith('/admin')
   const { setLoggedIn } = useAuth()
   const [isBusy, setIsBusy] = useState<boolean>(false)
   const router = useRouter()
   const [success, setSuccess] = useState('')
   const [errors, setErrors] = useState({
      currentPasswordError: '',
      newPasswordError: '',
      passwordConfirmationError: '',
      apiError: ''
   })
   
   var [loggedInUser, setLoggedInUser] = useState({
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      image: "",
      qr_code: ""
   });
   
   const [changePassword, setChangePassword] = useState({
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
   })

   useEffect(() => {
      
      if(localStorage.getItem('yalla_logged_in_user') !== null) {
         var user = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '')
         var time_diff = getDaysHoursMinsSecs(new Date(user.loginTime), new Date())

         if(parseFloat(time_diff.days) > 0 || parseFloat(time_diff.hours) >= 5) {
            logout()
         } else {

            setLoggedInUser({
               name: user.name,
               firstName: user.first_name,
               lastName: user.last_name,
               email: user.email,
               image: user.image,
               qr_code: user.qr_code
            })
         }
      } else {
         router.push('/');
      } 
   }, []);

   const saveProfile = async () => {

      if (!isBusy) {

         if (loggedInUser.firstName == '' || loggedInUser.lastName == '') {
            alert('Name cannot be empty')
         } else {
            
            setIsBusy(true)   
            const { _id } = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '')
   
            try {
               let response = await fetch(`/api/admin/profile?id=${_id}`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                     first_name: loggedInUser.firstName,
                     last_name: loggedInUser.lastName
                  })
               })
      
               if(!response.ok) {
                  console.log('error in winner announcement api')
               } else if (response.status == 200) {
                  
                  const storedUser = JSON.parse(localStorage.getItem('yalla_logged_in_user') || '{}')
                  storedUser.first_name = loggedInUser.firstName
                  storedUser.last_name = loggedInUser.lastName
                  localStorage.setItem('yalla_logged_in_user', JSON.stringify(storedUser))
                  
                  setProfileModal(false)
                  setSuccess('Profile has been updated')
               }
            } catch (error) {
               console.log(error)
            }
            
            setIsBusy(false)
         }
      }
   }
   
   const updatePassword = async () => {

      if (!isBusy) {

         setErrors({
            currentPasswordError: '',
            newPasswordError: '',
            passwordConfirmationError: '',
            apiError: ''
         })

         const { currentPassword, newPassword, passwordConfirmation } = changePassword

         if (currentPassword == '') {
            setErrors((prev) => ({...prev, currentPasswordError: 'Current password is required'}))
         } else if (newPassword == '') {
            setErrors((prev) => ({...prev, newPasswordError: 'New password is required'}))
         } else if (newPassword.length < 8) {
            setErrors((prev) => ({...prev, newPasswordError: 'Password must be at least 8 characters long'}))
         } else if (passwordConfirmation == '') {
            setErrors((prev) => ({...prev, passwordConfirmationError: 'Password confirmation is required'}))
         } else if (newPassword !== passwordConfirmation) {
            setErrors((prev) => ({...prev, passwordConfirmationError: 'Password does not match with password confirmation'}))
         } else {
            
            setIsBusy(true)   
            const { _id } = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '')
   
            try {
               let response = await fetch(`/api/admin/change-password?id=${_id}`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                     current_password: changePassword.currentPassword,
                     new_password: changePassword.newPassword,
                     password_confirmation: changePassword.passwordConfirmation
                  })
               })
      
               if(!response.ok) {
                  const content = await response.json()
                  setErrors((prev) => ({...prev, apiError: content.message}))
               } else if (response.status == 200) {                  
                  setChangePasswordModal(false)
                  setSuccess('Password has been updated')
               } else {
                  const content = await response.json()
                  console.log(content)
                  setErrors((prev) => ({...prev, apiError: content.message}))
               }
            } catch (error) {
               console.log(error)
            }
            
            setIsBusy(false)
         }
      }
   }

   const logout = () => {
      setLoggedIn(false);
      localStorage.removeItem('yalla_logged_in_user');
      router.push('/');
   }

   const handleAdminProfile = () => {
      setProfileModal(true)
   }
   
   const handleChangePassword = () => {
      setChangePasswordModal(true)
   }
   
   const handleLogoutModal = () => {
      setLogoutModal(true)
   }

   return (
      <>
         <div className="flex flex-row items-center px-4 lg:px-0 lg:justify-end py-4 lg:py-6 shadow-custom-1-left">
            <div onClick={() => setIsDrawerOpen(true)} className="lg:hidden">
               <img src="/assets/dashboard/bars.svg" alt="" />
            </div>
            <div className="flex flex-row items-center gap-4 lg:gap-6 ml-auto">
               {isUser && (
                  <div className="flex items-center px-1 lg:px-4 py-2 gap-1 lg:gap-2 border border-themeone rounded-lg text-sm lg:text-size-2 cursor-pointer">
                     <div>Account ID :</div>
                     <div className="text-themeone">{loggedInUser.qr_code.slice(0, 10)}</div>
                  </div>
               )}
               {isUser && (
                  <Link href={'/user/account/add-credit'} className="flex items-center px-1 lg:px-4 py-2 gap-1 lg:gap-2 border border-themeone rounded-lg text-sm lg:text-size-2 cursor-pointer">
                     <div>Add Credit</div>
                     <div className="text-themeone">
                        <FontAwesomeIcon size="sm" icon={faPlus} />
                     </div>
                  </Link>
               )}
               <Menu>
                  <MenuButton className="">
                     <div className="flex items-center lg:gap-4 lg:pr-16 text-size-2 cursor-pointer">
                        <div>
                           <img className="max-h-[30px]" src={loggedInUser.image === '' ? "/assets/dashboard/profile-pic.svg" : loggedInUser.image} alt="" />
                        </div>
                        <div className="text-themeone hidden lg:flex">{loggedInUser.name}</div>
                        <div className="hidden lg:flex">
                           <FontAwesomeIcon size="sm" icon={faChevronDown} />
                        </div>
                     </div>
                  </MenuButton>
                  <MenuItems anchor="bottom" className="w-[100px] lg:w-[230px] bg-white py-2 lg:py-4 rounded-xl mt-1 flex flex-col">
                     <MenuItem as="div">
                        {isUser && ( 
                           <Link href="/user/profile" className="text-xs w-full flex lg:text-size-1 border-b border-gray-100 py-5 px-4 lg:px-8 hover:bg-gray-100">Profile</Link>
                        )}
                        {isAdmin && ( 
                           <button type="button" onClick={handleAdminProfile} className="text-xs w-full flex lg:text-size-1 border-b border-gray-100 py-5 px-4 lg:px-8 hover:bg-gray-100">Profile</button>
                        )}
                     </MenuItem>
                     {/*<MenuItem>
                        <Link href="/admin/notifications" className="text-xs lg:text-size-1 border-b border-gray-100 py-5 px-4 lg:px-8 hover:bg-gray-100 whitespace-nowrap">Notifications (3)</Link>
                     </MenuItem>*/}
                     {isUser && (
                        <MenuItem>
                           <Link href={"/contact-us"} className="text-xs lg:text-size-1 border-b border-gray-100 py-5 px-4 lg:px-8 cursor-pointer hover:bg-gray-100 whitespace-nowrap">Contact Us</Link>
                        </MenuItem>
                     )}
                     {isAdmin && (
                        <MenuItem as="div">
                           <button type="button" onClick={handleChangePassword} className="text-xs w-full flex lg:text-size-1 border-b border-gray-100 py-5 px-4 lg:px-8 hover:bg-gray-100">Change Password</button>
                        </MenuItem>
                     )}
                     <MenuItem>
                        <div className="text-xs lg:text-size-1 text-theme-error border-b border-gray-100 py-5 px-4 lg:px-8 cursor-pointer hover:bg-gray-100" onClick={handleLogoutModal}>Logout</div>
                     </MenuItem>
                  </MenuItems>
               </Menu>
            </div>
         </div>

         <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen}>
            <SideBarMenu />
         </Drawer>

         <Modal open={profileModal} onClose={() => setProfileModal(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[1000px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Profile</div>
                  <div onClick={() => setProfileModal(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                     <div className="flex gap-12 px-8 py-6">
                        <div className="flex flex-col gap-6 items-center">
                           <div className="relative">
                              <button type="button" className="absolute top-2 -right-1 bg-themetwo rounded-full w-[30px] h-[30px] flex items-center justify-center">
                                 <FontAwesomeIcon size="1x" icon={faPencil} className="text-white" />
                              </button>
                              <img className="rounded-full w-[120px] h-[120px] border-[2px]" src="/assets/images/cat-3.svg" alt="" />
                           </div>
                           <button type="button" className="text-themetwo rounded-lg px-3 py-2 border-[2px] border-themetwo text-size-4 font-medium whitespace-nowrap">Choose Photo</button>
                        </div>
                     </div>
                     <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">First Name</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input onChange={(e) => setLoggedInUser((prevUser) => ({...prevUser, firstName: e.target.value}))} className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" value={loggedInUser.firstName} />
                           </div>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">Last Name</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input onChange={(e) => setLoggedInUser((prevUser) => ({...prevUser, lastName: e.target.value}))} className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" value={loggedInUser.lastName} />
                           </div>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">Email ID</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded h-[40px] px-3 py-2">{loggedInUser.email}</div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center ml-auto mt-12 gap-6">
                     <button onClick={() => setProfileModal(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button onClick={saveProfile} className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Save</button>
                  </div>
               </div>
            </div>
         </Modal>
         
         <Modal open={changePasswordModal} onClose={() => setChangePasswordModal(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[1000px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Change Password</div>
                  <div onClick={() => setChangePasswordModal(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                     <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">Current Password</div>
                           <div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input onChange={(e) => setChangePassword((prev) => ({...prev, currentPassword: e.target.value}))} className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="password" value={changePassword.currentPassword} />
                              </div>
                              {errors.currentPasswordError != '' && (
                                 <div className="text-red-600">{errors.currentPasswordError}</div>
                              )}
                           </div>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">New Password</div>
                           <div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input onChange={(e) => setChangePassword((prev) => ({...prev, newPassword: e.target.value}))} className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="password" value={changePassword.newPassword} />
                              </div>
                              {errors.newPasswordError != '' && (
                                 <div className="text-red-600">{errors.newPasswordError}</div>
                              )}
                           </div>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">Confirm Password</div>
                           <div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input onChange={(e) => setChangePassword((prev) => ({...prev, passwordConfirmation: e.target.value}))} className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="password" value={changePassword.passwordConfirmation} />
                              </div>
                              {errors.passwordConfirmationError != '' && (
                                 <div className="text-red-600">{errors.passwordConfirmationError}</div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center ml-auto mt-12 gap-6">
                     <button onClick={() => setChangePasswordModal(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button onClick={updatePassword} className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Save</button>
                  </div>
                  {errors.apiError != '' && (
                     <div className="text-red-600 w-fit ml-auto">{errors.apiError}</div>
                  )}
               </div>
            </div>
         </Modal>
         
         <Modal open={logoutModal} onClose={() => setLogoutModal(false)}>
            <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
               <div className="text-darkone font-medium text-head-3">Logout</div>
               <div className="text-darkone text-size-4">Are you sure you want to logout?</div>
               <div className="flex items-center gap-6 mt-3">
                  <button onClick={() => setLogoutModal(false)} className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded">Cancel</button>
                  <button onClick={() => logout()} className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Yes</button>
               </div>
            </div>
         </Modal>

         { success !== '' && 
            <Notification message="Success" description={success} type='success'  close={() => {setSuccess('')}} />  
         }
      </>
   )
}
