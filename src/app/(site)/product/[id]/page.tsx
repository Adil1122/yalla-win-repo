"use client"

import UpcomingDrawCard from "@/components/upcoming-draw-card"
import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

type Tab = 'product' | 'prize'

export default function Product({ params } : {params: { id: string; }}) {

   const [activeTab, setActiveTab] = useState<Tab>('product')
   const router = useRouter()
   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }

   var [product, setProduct] = useState({
      id: "",
      name: "",
      price: 0,
      image: "",
      vat: "",
      stock: 0,
      description: "",
      sold: 0
   });
   var [prize, setPrize] = useState({
      name: "",
      image: "",
      price: 0,
      specifications: []
   });

   var [game_draws, setGameDraws] = useState([]);
   var [prize_draws, setPrizeDraws] = useState([]);

   useEffect(() => {
      getDetails();
   }, []);

   var getDetails = async() => {
      try {

         let response = await fetch("/api/website/product?id=" + params.id, {
            method: "GET",
            });
            const content = await response.json();
            console.log(content)

            if(!response.ok) {
            } else {
               var productObject: any = {
                  name: content.product_with_prize[0].name,
                  price: content.product_with_prize[0].price,
                  image: content.product_with_prize[0].image,
                  vat: content.product_with_prize[0].vat,
                  description: content.product_with_prize[0].description,
                  stock: content.product_with_prize[0].stock,
                  sold: content.product_with_prize[0].sold,
               }

               var prizeObject: any = {
                  name: content.product_with_prize[0].productWithPrize[0].name,
                  image: content.product_with_prize[0].productWithPrize[0].image,
                  price: content.product_with_prize[0].productWithPrize[0].price,
                  specifications: JSON.parse(content.product_with_prize[0].productWithPrize[0].specifications)
               }
               setProduct(productObject);
               setPrize(prizeObject);
               setGameDraws(content.game_draws);
               setPrizeDraws(content.prize_draws);
            }
         
      } catch (error) {
         
      }
   }

   const addToBasket = async () => {
      if(localStorage.getItem("yalla_logged_in_user") !== null) {
         var user = JSON.parse(localStorage.getItem("yalla_logged_in_user") + '');
         var user_id = user._id;

         let response = await fetch("/api/website/basket", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               user_id: user_id,
               product_id: params.id,
               quantity: 1
            })
         });

         const content = await response.json();
         console.log('content: ', content);
         if(!response.ok) {
            alert('error')
         } else {
            router.push('/cart')
         }
      } else {
         alert('Please login first to Add to Cart.')
      }

   }

   return (
      <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo overflow-x-hidden">
         <section className="flex flex-col lg:flex-row gap-12 lg:gap-10 py-6 lg:py-16">
            <div className="flex flex-col gap-6 lg:gap-12 px-8 lg:pl-16 lg:w-[63%]">
               <div className="bg-white rounded-standard w-full h-full flex flex-col xl:flex-row items-center gap-6 xl:gap-16 py-8 xl:py-0 px-8 xl:px-16">
                  <div className="flex flex-col gap-3 lg:gap-6">
                     <div className="text-theme-gradient font-semibold text-big-four leading-tight xl:leading-normal xl:text-extra-large-head">Win {prize.name} +</div>
                     <div className="text-medium text-head-5 leading-tight xl:leading-normal">Buy {product.name} and make your dream true!</div>
                     <button onClick={addToBasket} className="hidden xl:block mt-12 text-center text-white xl:mt-24 bg-themeone font-semibold shadow-custom-1 rounded-full py-3 px-16 w-fit">Buy Now</button>
                  </div>
                  <div>
                     <img className="max-w-[200px] lg:max-w-auto" src={prize.image} alt="" />
                  </div>
                  <button onClick={addToBasket} className="xl:hidden text-center text-white lg:mt-24 bg-themeone font-semibold shadow-custom-1 rounded-full py-3 px-16 w-fit">Buy Now</button>
               </div>
               <div className="flex gap-2 mx-auto"></div>
            </div>
            <div className="flex flex-col gap-6 lg:gap-12 lg:pr-16 lg:w-[35%]">
            {
               (game_draws.length > 0 && prize_draws.length > 0) &&
               <UpcomingDrawCard game_draws={game_draws} prize_draws={prize_draws} />
            }
            </div>
         </section>
         
         <section className="flex flex-col gap-6 lg:gap-12">
            <div className="py-8 lg:py-20 px-8 lg:px-16 bg-light-background backdrop-blur-64">
               <div className="flex flex-col items-center lg:items-start flex-grow bg-white rounded-standard p-8 lg:p-12 gap-8 lg:gap-12">
                  <div className="flex flex-row items-center justify-center gap-2 lg:gap-16 text-size-4 lg:text-head-7 text-themeone w-full">
                     <div className={`cursor-pointer ${activeTab === 'product' ? 'font-extra-bold underline' : 'font-medium'}`} onClick={() => handleTabChange('product')}>
                        Product Details
                     </div>
                     <div className={`cursor-pointer ${activeTab === 'prize' ? 'font-extra-bold underline' : 'font-medium'}`} onClick={() => handleTabChange('prize')}>
                        Prize Details
                     </div>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 w-full">
                     {activeTab == 'product' && (
                        <>
                           <div className="text-size-4 lg:text-head-2 font-regular text-darkone w-full lg:w-[60%]">
                              <p>
                                 {product.description}
                              </p>
                              
                           </div>
                           <div className="flex flex-col items-center w-full lg:w-[40%] gap-10">
                              <img className="lg:max-w-96 max-w-48" src={product.image} alt="" />
                              <div className="flex flex-col gap-8 bg-themeone p-6 text-white rounded-3xl w-full">
                                 <h4 className="font-medium text-head-7">Details</h4>
                                 <div className="flex flex-col gap-2 text-size-1">
                                    <div className="flex flex-row justify-between">
                                       <div>Product Name</div>
                                       <div>{product.name}</div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                       <div>Product Price</div>
                                       <div>AED {product.price}</div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                       <div>Sold Tickets</div>
                                       <div>{ Math.round((product.sold/product.stock) * 100)}% Sold</div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                       <div>Prize</div>
                                       <div>{prize.name} or AED {prize.price}</div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </>
                     )}

                     {activeTab == 'prize' && (
                        <>
                           <div className="flex flex-col w-full lg:w-[60%] gap-8">
                              <h4 className="text-theme-gradient font-semibold text-head-7">Technical Details</h4>
                              <div className="flex flex-col gap-2">
                                 {
                                    prize.specifications.map((specification: any) => (
                                       <div key={specification.key + '0'} className="flex flex-row items-center justify-between">
                                          <div key={specification.key + '1'} className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">{specification.key}</div>
                                          <div key={specification.key + '2'} className="text-size-1 lg:text-size-2 lg:w-1/2">{specification.value}</div>
                                       </div>
                                    ))
                                 }
                                 {/*<div className="flex flex-row items-center justify-between overflow-x-hidden">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Batteries</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">1 Lithium Ion batteries required. (included)</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Item model number</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">SM-X210NZAEEUE</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Manufacturer</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">Samsung</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Series</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">Galaxy Tab A9+</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Color</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">Gray</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Standing screen display size</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">11 inches</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Screen Resolution</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">1920 x 1200 pixels</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Processor Brand</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">Samsung</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Computer Memory Type</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">DDR3 SDRAM</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Graphics Card Description</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">Integrated</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Connectivity Type</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">Bluetooth</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Wireless Type</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">802.11ac</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Rear Webcam Resolution</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">8 MP</div>
                                 </div>
                                 <div className="flex flex-row items-center justify-between">
                                    <div className="font-medium text-size-2 lg:text-size-4 lg:w-1/2">Front Webcam Resolution</div>
                                    <div className="text-size-1 lg:text-size-2 lg:w-1/2">5 MP</div>
                                 </div>*/}
                              </div>
                           </div>
                           <div className="flex flex-col lg:w-[40%] w-full gap-10 items-center">
                              <img className="lg:max-w-96 max-w-48" src={prize.image} alt="" />
                              <div className="flex flex-col gap-8 bg-themeone p-6 text-white rounded-3xl w-full">
                                 <h4 className="font-medium text-head-7">Details</h4>
                                 <div className="flex flex-col gap-2 text-size-1">
                                    <div className="flex flex-row justify-between">
                                       <div>Prize Name</div>
                                       <div>{prize.name}</div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                       <div>prize Price</div>
                                       <div>AED {prize.price}</div>
                                    </div>
                                    
                                 </div>
                              </div>
                           </div>
                        </>
                     )}
                  </div>
                  <div>
                     <button onClick={addToBasket} className="text-center text-white lg:mt-12 bg-themeone font-semibold shadow-custom-1 rounded-full py-3 px-16 w-fit">Buy Now</button>
                  </div>
               </div>
            </div>
         </section>
      </div>
   )
}
