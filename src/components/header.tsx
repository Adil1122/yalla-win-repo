'use client'

import Link from "next/link"
import Image from "next/image"
import logoImg from '../../public/assets/images/logo.svg'
import logoImgResp from '../../public/assets/images/logo-resp.svg'
import cartImg from '../../public/assets/images/cart-plus-color.svg'
//import respMenuIcon from '../../public/assets/images/resp-menu-icon.svg'
import { Bars3Icon } from "@heroicons/react/24/solid"
import { useState, useEffect, useRef } from "react"
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'animate.css'
import { useAuth } from '@/components/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
   
   const [isSearching, setIsSearching] = useState<boolean>(false);
   const [showSearching, setShowSearching] = useState<boolean>(false);
   const [search, setSearch] = useState("");
   const [search_results, setSearchResults] = useState([]);
   const __ANIMATION_CLASS = 'animate__heartBeat';
   const router = useRouter();
   const pathname = usePathname();
   console.log('path: ', pathname);

   function setSearchFieldValue(value: any) {
      setSearch(value)
      setShowSearching(false);
   }

   async function updateSearch(value: any) {

      //console.log(value)

      setShowSearching(true);
      setSearch(value);
      try {
         let response = await fetch("api/website/search?search=" + value, {
            method: "GET",
            });
         const content = await response.json();
         console.log(content)
   
         if(!response.ok) {
   
         } else {
            console.log('prods: ', content.products)
            console.log('wineers: ', content.winners)
            var temp: any = [];
            for(var i = 0; i < content.products.length; i++) {
               temp.push(content.products[i].name);
            }

            for(var i = 0; i < content.winners.length; i++) {
               temp.push(content.winners[i].user_name);
            }
            setSearchResults(temp)
         }
      } catch (error) {
         
      }
   }

   const activateSearch = () => {
      if(isSearching) {
         localStorage.setItem('yalla_search', search);
         //console.log('llll', search)
         if(pathname === '/') {
            router.push('/search');
         } else {
            router.push('/');
         }
      } else {
         setIsSearching(true)
      }
   }
   
   const deactivateSearch = () => {
      setIsSearching(false)
      setShowSearching(false)
      setSearch('')
      localStorage.setItem('yalla_search', '');
   }

   const { loggedIn, setLoggedIn } = useAuth();
   const [dashboardUrl, setDashboardUrl] = useState('');

   useEffect(() => {
      // Check if user is logged in when component mounts
      if(localStorage.getItem('yalla_logged_in_user') !== null) {
         var userObject = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '');
         if(userObject.role === 'admin') {
            setDashboardUrl('/admin/dashboard');
         } else {
            setDashboardUrl('/user/dashboard');
         }
         setLoggedIn(true)
      } 
   }, [loggedIn]);
   

   const handleMouseEnter = (e: any) => e.currentTarget.classList.add(__ANIMATION_CLASS)
   const handleMouseLeave = (e: any) => e.currentTarget.classList.remove(__ANIMATION_CLASS)
   
   const activeClass = "font-medium text-themeone bg-white rounded-standard px-[24px] py-[2px]";
   const inactiveClass = "animate__animated";

   return (
      <section className="flex flex-row items-center justify-between">
         <Link href="/">
            <Image alt="Dream draw logo" quality={100} className="hidden lg:flex lg:h-[70px] lg-mid:h-[100px]" src={logoImg}></Image>
            <Image alt="Dream draw logo" quality={100} className="lg:hidden" src={logoImgResp}></Image>
         </Link>
         <div className="relative lg:flex flex-row items-center justify-between hidden lg:w-[60%] mx-auto gap-12">
            <div className="flex flex-1 flex-row items-center gap-8 bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo text-white rounded-full px-12 lg:py-2 lg-mid:py-4 lg:pr-2 lg-mid:pr-4 text-size-3">
               {!isSearching && (
                  <div className="flex items-center w-full justify-between lg:w-[90%] lg-mid:w-[70%] lg:text-size-1 lg-mid:text-size-4">
                     {/* active menu classes: font-medium text-themeone bg-white rounded-standard px-[24px] py-[2px] */}
                     <Link onMouseEnter={(e: any) => handleMouseEnter(e)} onMouseLeave={(e: any) => handleMouseLeave(e)} className={pathname === '/' ? activeClass : inactiveClass} href="/">Home</Link>
                     <Link onMouseEnter={(e: any) => handleMouseEnter(e)} onMouseLeave={(e: any) => handleMouseLeave(e)} className={pathname === '/about-us' ? activeClass : inactiveClass} href="/about-us">About</Link>
                     <Link onMouseEnter={(e: any) => handleMouseEnter(e)} onMouseLeave={(e: any) => handleMouseLeave(e)} className={pathname === '/shop' ? activeClass : inactiveClass} href="/shop">Shop</Link>
                     <Link onMouseEnter={(e: any) => handleMouseEnter(e)} onMouseLeave={(e: any) => handleMouseLeave(e)} className={pathname === '/accounts' ? activeClass : inactiveClass} href="/accounts">Accounts</Link>
                     <Link onMouseEnter={(e: any) => handleMouseEnter(e)} onMouseLeave={(e: any) => handleMouseLeave(e)} className={pathname === '/rules-and-prices' ? activeClass : inactiveClass} href="/rules-and-prices">
                        <div className="lg:hidden lg-mid:block">Rules & prices</div>
                        <div className="lg:block lg-mid:hidden">Rules</div>
                     </Link>
                     <Link onMouseEnter={(e: any) => handleMouseEnter(e)} onMouseLeave={(e: any) => handleMouseLeave(e)} className={pathname === '/winners' ? activeClass : inactiveClass} href="/winners">Winners</Link>
                  </div>
               )}
               {isSearching && (
                  <div className="flex-1 w-full">
                     <input className="placeholder-white bg-transparent w-full h-[35px] focus:outline-none pl-3 animate__animated animate__slideInRight" type="text" placeholder="Type something here..." onChange={(e) => updateSearch(e.target.value)} value={search} />
                  </div>
               )}
               <div onClick={activateSearch} className="ml-auto bg-white text-themeone rounded-full px-12 lg:py-2 lg-mid:py-3 shadow-custom-2 cursor-pointer">Search</div>
            </div>
            {isSearching && (
               <div onClick={deactivateSearch} className="absolute -left-12 top-1/2 transform -translate-y-1/2 cursor-pointer animate__animated animate__zoomIn">
                  <FontAwesomeIcon size="2xl" icon={faTimes} />
               </div>
            )}
            {
            
            showSearching &&
                  <div className="z-50 absolute top-[100%] left-1/2 transform -translate-x-1/2 bg-white flex flex-col border border-themeone w-[93%] divide-y divide-themeone">
                     {
                        search_results.map((search_result: any, i: any) => (
                           <button key={i} className="py-3 px-4 cursor-pointer" style={{'textAlign' : 'left'}} onClick={() => setSearchFieldValue(search_result)}>{search_result}</button>
                        ))
                     }
                  </div>
            }
         </div>
         <div className="hidden lg:flex flex-row items-center gap-8 lg:text-size-1 lg-mid:text-size-3">

            { loggedIn &&
            <>
               <Link href="/cart" className="flex items-center gap-2">
                  <Image alt="Dream draw logo" quality={100} className="lg:w-[50px] lg-mid:w-full" src={cartImg}></Image>
               </Link>

               <Link href={dashboardUrl} className="bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo text-white rounded-full px-6 py-3">Dashboard</Link>
            </>
            }

            { !loggedIn &&
            <>
               <Link href="/login" className="flex items-center gap-2">
                  <div className="text-black">Login</div>
               </Link>

               <Link href="/signup" className="bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo text-white rounded-full px-6 py-3">Sign Up</Link>
            </>
            }
            
         </div>
         <div className="ml-auto lg:hidden cursor-pointer">
            <Bars3Icon className="w-[45px]" />
         </div>
      </section>
   )
}