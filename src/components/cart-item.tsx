import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { MouseEventHandler } from 'react'

interface CartItemProps {
   item_id: string;
   item_name: string;
   item_date: string;
   item_quantity: Number;
   item_image: String;
   deleteCartItem: MouseEventHandler;
   updateQuantity: MouseEventHandler;
 }
 
 const CartItem: React.FC<CartItemProps> = ({ item_id, item_name, item_date, item_quantity, item_image, deleteCartItem, updateQuantity }) => {

//export default function CartItem() {
   return (
      <>
         <div className="bg-white px-6 lg:px-8 py-6 lg:py-8 flex flex-col lg:flex-row rounded-standard gap-2 lg:gap-8">
            <div className="flex lg:w-[40%]">
               <img src={item_image + ''} alt="" />
            </div>
            <div className="flex flex-row justify-between lg:items-start items-end lg:w-[60%] py-4">
               <div className="flex flex-col font-light text-black text-size-2 lg:text-head-3">
                  <div className="flex flex-row gap-1 lg:gap-2">
                     <div>Product Title:</div>
                     <div>{item_name}</div>
                  </div>
                  <div className="flex flex-row gap-1 lg:gap-2">
                     <div>Date:</div>
                     <div>{item_date}</div>
                  </div>
                  <div className="flex flex-row items-center gap-6 mt-4 lg:mt-8">
                     <div>Quantity</div>
                     <div className="flex flex-row items-center bg-[#E4E4E4] rounded px-4">
                        <div className="font-noto-sans-bold text-black cursor-pointer py-2">
                           <FontAwesomeIcon size="1x" icon={faMinus} data-item-id={item_id} data-quantity={item_quantity} data-operation={'sub'} onClick={(e) => updateQuantity(e)} />
                        </div>
                        <div className="text-themeone text-size-2 lg:text-head-3 font-medium text-center px-2 mx-2 lg:px-4 lg:mx-4 border-r border-l border-gray-300 py-2 lg:py-4">{item_quantity + ''}</div>
                        <div className="font-noto-sans-bold font- text-black cursor-pointer py-2">
                           <FontAwesomeIcon size="1x" icon={faPlus} data-item-id={item_id} data-quantity={item_quantity} data-operation={'add'} onClick={(e) => updateQuantity(e)} />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="cursor-pointer" id={item_id} onClick={(e) => deleteCartItem(e)}>
                  <div className="hidden lg:block">
                     <FontAwesomeIcon size="2xl" icon={faTrash} />
                  </div>
                  <div className="lg:hidden">
                     <FontAwesomeIcon size="lg" icon={faTrash} />
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}
export default CartItem;
