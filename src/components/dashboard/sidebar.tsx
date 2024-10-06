'use client';

import React, { useEffect, useState } from 'react'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useAuth } from '@/components/AuthContext'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardSideBar() {

   const { setLoggedIn } = useAuth()
   const router = useRouter()
   const pathname = usePathname()

   const isUser = pathname.startsWith('/user')
   const isAdmin = pathname.startsWith('/admin')

   const logout = () => {
      setLoggedIn(false);
      localStorage.removeItem('yalla_logged_in_user');
      router.push('/');
   }

   useEffect(() => {
      if(isUser)
      setUserMenuSelected()
   }, [])

   function setUserMenuSelected() {
      console.log('pathname: ', pathname)
      console.log('userMenu: ', userMenu[2])
      var menu = userMenu;
      var index = 0;
      var sub_index = 0;

      if(pathname === '/user/dashboard') {
         menu[index].active = true;
      }
      if(pathname === '/user/current-purchasing/raffle-games') {
         index = 2;
         sub_index = 0;
         menu[index].active = true;
         menu[index].children[sub_index].active = true;
      }
      if(pathname === '/user/current-purchasing/raffle-prizes') {
         index = 2;
         sub_index = 1;
         menu[index].active = true;
         menu[index].children[sub_index].active = true;
      }
      if(pathname === '/user/upcoming-draw/raffle-games') {
         index = 3;
         sub_index = 0;
         menu[index].active = true;
         menu[index].children[sub_index].active = true;
      }
      if(pathname === '/user/upcoming-draw/raffle-prizes') {
         index = 3;
         sub_index = 1;
         menu[index].active = true;
         menu[index].children[sub_index].active = true;
      }
      if(pathname === '/user/draw-history/raffle-games') {
         index = 4;
         sub_index = 0;
         menu[index].active = true;
         menu[index].children[sub_index].active = true;
      }
      if(pathname === '/user/draw-history/raffle-prizes') {
         index = 4;
         sub_index = 1;
         menu[index].active = true;
         menu[index].children[sub_index].active = true;
      }
      if(pathname === '/user/account/add-credit') {
         index = 5;
         sub_index = 0;
         menu[index].active = true;
         menu[index].children[sub_index].active = true;
      }
      if(pathname === '/user/account/winning-withdraw/raffle-games' || pathname === '/user/account/winning-withdraw/raffle-prizes') {
         index = 5;
         sub_index = 1;
         menu[index].active = true;
         menu[index].children[sub_index].active = true;
      }
      if(pathname === '/user/account/transaction-history') {
         index = 5;
         sub_index = 2;
         menu[index].active = true;
         menu[index].children[sub_index].active = true;
      }
      if(pathname === '/user/favourite-draw-numbers') {
         index = 6;
         menu[index].active = true;
      }
      
      for (var i = 0; i < userMenu.length; i++) {
         if(i !== index) {
            menu[i].active = false;
            if(menu[i].children.length > 0) {
               for(var j = 0; j < menu[i].children.length; j++) {
                  if(menu[i].children[j].name !== 'Winning/Withdraw') {
                     menu[i].children[j].active = false;
                  }
               }
            } 
         } 
      }
      setUserMenu((prev) => {
         return [...prev];
      });
   }

   function menuItemClicked(item: any, index: any) {
      if(isAdmin) {
         adminMenuItemClicked(item, index)
      } else {
         var temp: any = userMenu;
         for (var i = 0; i < userMenu.length; i++) {
            if(i === index) {
               temp[i] = userMenu[i];
               temp[i].active = true;
            } else if(userMenu[i].active){
               temp[i] = userMenu[i];
               temp[i].active = false;
            }
         }

         setUserMenu((prev) => {
            return [...prev];
         });
      }
   }

   function adminMenuItemClicked(item: any, index: any) {
      var temp: any = adminMenu;
      for (var i = 0; i < adminMenu.length; i++) {
         if(i === index) {
            temp[i] = adminMenu[i];
            temp[i].active = true;
         } else if(adminMenu[i].active){
            temp[i] = adminMenu[i];
            temp[i].active = false;
         }
      }

      setAdminMenu((prev) => {
         return [...prev];
      });
   }

   const [userMenu, setUserMenu] = useState([
      {name : 'Dashboard', active: false, href: '/user/dashboard', icon: 'dashboard', children: []},
      {name : 'Buy Product', active: false, href: null, icon: 'cart', children: [
         {name: 'With Raffle Game', href: '/shop', active: false},
         {name: 'With Raffle Prize', href: '/shop', active: false},
      ]},
      {name : 'Current Purchasing', active: false, href: null, icon: 'c-purchasing', children: [
         {name: 'Raffle Game', href: '/user/current-purchasing/raffle-games', active: false},
         {name: 'Raffle Mega Prize', href: '/user/current-purchasing/raffle-prizes', active: false},
      ]},
      {name : 'Upcoming Draw', active: false, href: null, icon: 'u-draw', children: [
         {name: 'Raffle Game', href: '/user/upcoming-draw/raffle-games', active: false},
         {name: 'Raffle Mega Prize', href: '/user/upcoming-draw/raffle-prizes', active: false},
      ]},
      {name : 'My Draw History', active: false, href: null, icon: 'd-history', children: [
         {name: 'Raffle Game', href: '/user/draw-history/raffle-games', active: false},
         {name: 'Raffle Mega Prize', href: '/user/draw-history/raffle-prizes', active: false},
      ]},
      {name : 'Accounts', active: false, href: null, icon: 'accounts', children: [
         {name: 'Add Credit', href: '/user/account/add-credit', active: false},
         {name: 'Winning/Withdraw', href: '/user/account/winning-withdraw/raffle-games', active: true, children: [
            {name: 'Raffle Game', href: '/user/account/winning-withdraw/raffle-games', active: false},
            {name: 'Raffle Mega Prize', href: '/user/account/winning-withdraw/raffle-prizes', active: false},
         ]},
         {name: 'Transaction History', href: '/user/account/transaction-history', active: false},
      ]},
      {name : 'Favourite Draw Numbers', active: false, href: '/user/favourite-draw-numbers', icon: 'f-draw', children: []},
   ])
   
   const [adminMenu, setAdminMenu] = useState([
      {name : 'Dashboard', active: false, href: '/admin/dashboard', icon: 'dashboard', children: []},
      {name : 'User Management', active: false, href: '/admin/user-management', icon: 'user', children: []},
      {name : 'Game/Product Management', active: false, href: '/admin/game-product-management', icon: 'game', children: []},
      {name : 'Upcoming Draws', active: true, href: '/admin/upcoming-draws', icon: 'up-draws', children: []},
      {name : 'Merchant Management', active: false, href: '/admin/merchant-management', icon: 'users', children: []},
      {name : 'Shop Management', active: false, href: '/admin/shop-management', icon: 'shop', children: []},
      {name : 'Machine Management', active: false, href: '/admin/machine-management', icon: 'machine', children: []},
      {name : 'Coupon Management', active: false, href: null, icon: 'coupon', children: [
         {name: 'Available Coupons', href: '/admin/coupon-management/available-coupons', active: false },
         {name: 'Purchase History', href: '/admin/coupon-management/purchase-history', active: false },
      ]},
      {name : 'Updates', active: false, href: '/admin/updates', icon: 'updates', children: []},
      {name : 'Winners Management', active: false, href: null, icon: 'winners', children: [
         {name: 'Select Winners', href: '/admin/winners-management/select-winners', active: false},
         {name: 'Winners History', href: '/admin/winners-management/winners-history', active: false},
         {name: 'results', href: '/admin/winners-management/results', active: false},
      ]},
      {name : 'Notifications', active: false, href: '/admin/notifications', icon: 'notif', children: []},
   ])

   const menu = isAdmin ? adminMenu : (isUser ? userMenu : [])

   return (
      <div className="flex flex-col flex-grow h-full max-h-screen overflow-y-auto">
         <div className="flex items-center justify-center my-5 lg:my-9">
            <img className="max-h-[80px] lg:max-h-auto" src="/assets/images/logo.svg" alt="" />   
         </div>
         <div className="flex flex-col">
            
         {menu.map((item: any, index: any) => (
            <div key={index} className={`flex flex-col gap-6 border-b border-lighttwo w-full cursor-pointer`}>
               <div className={`flex items-center gap-6 py-4 px-8 ${item.active ? "bg-gradient-to-r from-themeone to-themetwo text-white" : "text-darkone"}`} onClick={() => menuItemClicked(item, index)}>
                  <img className="max-w-[25px]" src={`/assets/dashboard/${item.icon}${item.active ? '-active' : ''}.svg`} alt="" />
                  {item.href === null && (
                     <div className="font-medium text-sm lg:text-size-1 xl:text-size-2">{item.name}</div>
                  )}
                  {item.href !== null && (
                     <Link href={item.href} className="font-medium text-sm lg:text-size-2 xl:text-size-2">{item.name}</Link>
                  )}
                  {item.children.length > 0 && (
                     <div className="ml-auto">
                        <FontAwesomeIcon size="lg" icon={faChevronDown} />
                     </div>
                  )}
               </div>

               {/* Children start */}
               {item.children.length > 0 && item.active == true && (
                  <div className="flex flex-col">
                  {item.children.map((child: any, childIndex: any) => (
                     <div key={childIndex} className="flex flex-col">
                        <div className={`flex items-center ${childIndex === 0 ? "pb-5" : "py-5" } px-8 gap-6 ${childIndex !== item.children.length - 1 ? "border-b border-lighttwo" : ""}`}>
                           <div className="w-[25px]"></div>
                           <div className="flex items-center gap-4 font-medium text-sm lg:text-size-1 xl:text-size-2">
                              <div className={`w-[5px] h-[5px] rounded-full ${child.active ? "bg-themeone" : "bg-black"}`}></div>
                              <Link href={child.href} className={`${child.active ? "text-themeone" : "text-darkone"}`}>
                                 {child.name}
                              </Link>
                           </div>
                        </div>
                        {/* Sub-Children start */}
                        {child.children?.length && child.active === true && (
                           <div className="flex flex-col">
                              {child.children.map((subChild: any, subChildIndex: number) => (
                                 <div key={subChildIndex} className={`flex items-center py-5 px-8 gap-6 border-b border-lighttwo`}>
                                    <div className="w-[50px]"></div>
                                    <div className="flex items-center gap-4 font-medium text-sm lg:text-size-1 xl:text-size-2">
                                       <div className={`w-[5px] h-[5px] rounded-full ${subChild.active ? "bg-themeone" : "bg-black"}`}></div>
                                       <Link href={subChild.href} className={`${subChild.active ? "text-themeone" : "text-darkone"}`}>
                                          {subChild.name}
                                       </Link>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                        {/* Sub-Children end */}
                     </div>
                  ))}
                  </div>
               )}
               {/* Children end */}
            </div>
         ))}
         </div>
         <div className="mt-12 mx-auto w-fit">
            <button onClick={() => logout()} className="flex items-center gap-2 border border-themetwo rounded-full px-6 py-2 text-md mb-8">
               <img src="/assets/dashboard/logout.svg" alt="" />
               <div className="font-medium text-lg">Logout</div>
            </button>
         </div>
      </div>
   )
}
