'use client';
import Link from 'next/link';
import React, { MouseEventHandler } from 'react'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { priceExclusiveVat } from '@/libs/common';

interface ProductGameCardProps {
   productId: String; 
  name: string;
  gameName: string;
  price: string;
  vat: string;
  buyLink: string;
  productImageLink: String;
  quantity: Number;
  setGameProductQuantity: MouseEventHandler
}

const ProductGameCard: React.FC<ProductGameCardProps> = ({ productId, name, gameName, price, vat, buyLink, productImageLink, quantity, setGameProductQuantity }) => {
   const router = useRouter();
   const buyProceed = (e: any) => {
      localStorage.setItem('game_product_quantity', e.currentTarget.getAttribute('data-quantity'));
      router.push(e.currentTarget.getAttribute('data-buy-link'));
   }
   
   return (
      <>
         <div className="flex flex-col bg-white gap-5 lg:gap-10 rounded-standard shadow-custom-1 pb-5 lg:pb-8">
         <div className={`w-full h-[150px] lg:h-[200px] bg-center bg-cover bg-no-repeat rounded-standard shadow-custom-1`} style={{backgroundImage: `url(${productImageLink})`}}></div>
            <div className="flex flex-col gap-1 px-10">
               <div className="flex flex-row gap-2">
                  <div className="font-semibold text-themetwo text-head-3 xl:text-head-5 2xl:text-head-8">Free Game:</div>
                  <div className="font-semibold text-themeone text-head-3 xl:text-head-5 2xl:text-head-8">{gameName}</div>
               </div>
               <div className="text-darkone text-size-2 xl:text-size-4 2xl:text-head-2 font-medium">{name}</div>
               <div className="flex flex-row gap-2">
                  <div className="text-darkone text-size-2 xl:text-size-4 2xl:text-head-2">Price:</div>
                  <div className="font-medium text-themeone text-size-2 xl:text-size-4 2xl:text-head-2">AED {priceExclusiveVat(price, vat)}</div>
               </div>
               <div className="flex flex-row gap-2">
                  <div className="text-darkone text-size-2 xl:text-size-4 2xl:text-head-2">VAT:</div>
                  <div className="text-themeone text-size-2 xl:text-size-4 2xl:text-head-2">{vat}</div>
               </div>
               <div className="flex flex-row gap-2">
                  <div className="text-darkone text-size-2 xl:text-size-4 2xl:text-head-2">Select Quantity:</div>
                  <div className="flex flex-row items-center ml-auto bg-[#E4E4E4] rounded px-4">
                     <div className="font-noto-sans-bold text-size-2 text-black cursor-pointer">
                        <FontAwesomeIcon size="sm" data-product-id={productId} data-operation="-" icon={faMinus} onClick={(e) => setGameProductQuantity(e) } />
                     </div>
                     <div className="text-themeone text-head-2 text-center px-3 mx-3 border-r border-l border-gray-300">{quantity + ''}</div>
                     <div className="font-noto-sans-bold text-size-2 text-black cursor-pointer">
                        <FontAwesomeIcon size="sm" data-product-id={productId} data-operation="+" icon={faPlus} onClick={(e) => setGameProductQuantity(e) } />
                     </div>
                  </div>
               </div>
               <button className="capitalize text-white text-size-2 whitespace-nowrap xl:text-size-3 2xl:text-head-1 text-center rounded-full bg-themeone px-20 py-2 lg:py-3 mt-5 lg:mt-8 w-fit mx-auto cursor-pointer" data-quantity={quantity} data-buy-link={buyLink} onClick={(e) => buyProceed(e)}>Buy Now</button>
            </div>
         </div>
      </>
   )
}

export default ProductGameCard;