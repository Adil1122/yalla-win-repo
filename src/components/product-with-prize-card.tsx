import Link from 'next/link';
import React, { MouseEventHandler } from 'react'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@headlessui/react';
import { useRouter } from 'next/navigation';

interface ProductPrizeCardProps {
  name: string;
  prizeName: string;
  price: string;
  vat: string;
  detailLink: string;
  checkoutLink: string;
  productImageLink: String;
  prizeImageLink: String;
  productId: String;
  quantity: Number;
  setPrizeProductQuantity: MouseEventHandler;
}

const ProductPrizeCard: React.FC<ProductPrizeCardProps> = ({ name, prizeName, price, vat, detailLink, checkoutLink, productImageLink, prizeImageLink, productId, quantity, setPrizeProductQuantity }) => {
   const router = useRouter();

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
               product_id: productId,
               quantity: quantity
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
      <>
         <div className="flex flex-col 2xl:flex-row bg-white gap-0 2xl:gap-6 rounded-standard shadow-custom-1">
            <div className={`w-full max-w-full 2xl:max-w-[200px] h-[150px] 2xl:h-[290px] shadow-custom-1 bg-center bg-cover bg-no-repeat rounded-tr-standard rounded-br-standard 2xl:rounded-br-none 2xl:rounded-tr-none rounded-tl-standard rounded-bl-standard  shadow-custom-1`} style={{backgroundImage: `url(${productImageLink})`}}></div>
            <div className="flex flex-row w-full 2xl:justify-center gap-0 px-5   2xl:px-0 2xl:gap-6 w-full relative">
               <div className="flex flex-col flex-1 gap-1 justify-between py-6">
                  <div className="font-semibold text-themetwo text-head-3 2xl:text-head-8">{name}</div>
                  <div className="font-semibold text-darkone text-size-4 2xl:text-head-4">{prizeName}</div>
                  <div className="flex flex-row gap-2">
                     <div className="text-darkone text-size -2 2xl:text-head-2">Price:</div>
                     <div className="font-medium text-themeone text-size-2 2xl:text-head-2">{price}</div>
                  </div>
                  <div className="flex flex-row gap-2">
                     <div className="text-darkone text-size-2 2xl:text-head-2">VAT:</div>
                     <div className="text-themeone text-size-2 2xl:text-head-2">{vat}</div>
                  </div>
                  <div className="flex flex-row gap-2">
                     <div className="text-darkone text-size-2 2xl:text-head-2">Select Quantity:</div>
                     <div className="flex flex-row items-center ml-auto bg-[#E4E4E4] rounded px-4">
                        <div className="font-noto-sans-bold text-sm text-black cursor-pointer">
                           <FontAwesomeIcon size="sm" data-product-id={productId} data-operation="-" icon={faMinus} onClick={(e) => setPrizeProductQuantity(e) } />
                        </div>
                        <div className="text-themeone text-size-4 text-center px-3 mx-3 border-r border-l border-gray-300">{quantity + ''}</div>
                        <div className="font-noto-sans-bold text-sm text-black cursor-pointer">
                           <FontAwesomeIcon size="sm" data-product-id={productId} data-operation="+" icon={faPlus} onClick={(e) => setPrizeProductQuantity(e) } />
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-row gap-3 mt-3 mx-auto">
                     <Link href={detailLink} className="capitalize text-white 2xl:text-size-4 text-center rounded-full bg-themeone px-4 py-2 w-fit mx-auto cursor-pointer whitespace-nowrap">Prize Detail</Link>
                     <Button onClick={() => addToBasket()}  className="capitalize text-white 2xl:text-size-4 text-center rounded-full bg-themeone px-4 py-2 w-fit mx-auto cursor-pointer whitespace-nowrap">Add to Cart</Button>
                  </div>
               </div>
               <div className={`w-full absolute top-7 right-5 2xl:top-0 2xl:right-0 2xl:relative max-w-[100px] h-[100px] max-h-[70px] lg:max-h-full 2xl:max-w-[200px] 2xl:h-[290px] ml-auto shadow-custom-1 bg-center bg-cover bg-no-repeat rounded 2xl:rounded-none 2xl:rounded-tr-standard 2xl:rounded-br-standard shadow-custom-1`} style={{backgroundImage: `url(${prizeImageLink})`}}></div>
            </div>
         </div>  
      </>
   )
}

export default ProductPrizeCard;