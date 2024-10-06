"use client"

import TicketCard from "@/components/ticket-card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from "react"
import CartItem from "./cart-item"

type InvoiceTab = 'invoice' | 'ticket'

interface CheckoutWithFreePrizeProps {
   id: string;
 }
 
 const CheckoutWithFreePrize: React.FC<CheckoutWithFreePrizeProps> = ({ id }) => {

   const [activeInvoiceTab, setInvoiceActiveTab] = useState<InvoiceTab>('invoice')

   const handleInvoiceTabChange = (tab: InvoiceTab) => {
      setInvoiceActiveTab(tab)
   }

   return (

      <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo overflow-x-hidden">
         <section className="flex flex-col gap-8 lg:gap-16 py-8 lg:py-16 px-8 lg:px-16">
            <h1 className="text-head-9 lg:text-extra-large-head text-center uppercase text-white font-noto-sans lg:font-noto-sans-black">Cart Details</h1>
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-32">
               <div className="lg:w-[60%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                  {/*<CartItem />
                  <CartItem />*/}
               </div>
               <div className="lg:w-[40%] flex flex-col text-white gap-8">
                  <div className="flex flex-row items-center gap-2">
                     <div className="text-head-4 lg:text-head-8 font-bold">My Shopping Cart</div>
                     <div className="text-size-2 lg:text-head-4 font-light">(3 items)</div>
                  </div>
                  <div className="flex flex-col gap-1 lg:gap-3 text-size-4 lg:text-head-4 font-light">
                     <div className="flex flex-row justify-between">
                        <div>Item 1</div>
                        <div className="">Price</div>
                     </div>
                     <div className="flex flex-row justify-between">
                        <div>Item 2</div>
                        <div>Price</div>
                     </div>
                     <div className="flex flex-row justify-between">
                        <div>Total</div>
                        <div className="font-bold">20 AED</div>
                     </div>
                  </div>
                  <div>
                     <button className="text-themeone bg-white rounded-full w-full text-center shadow-custom-1 py-2 lg:py-3 font-medium text-size-3 lg:text-head-2 mt-3 lg:mt-6">Check Out</button>
                  </div>
               </div>
            </div>

            {/* invoice starts */}
            <div className="flex flex-col gap-2 lg:gap-4 w-full">
               <div className="text-white text-center text-head-4 lg:text-big-three font-noto-sans uppercase tracking-tight">Invoice and Ticket</div>
               <div className="text-white text-size-2 lg:text-size-4 font-light text-center">Please find your invoice below</div>
               <div className="flex flex-row gap-4 text-white text-size-3 lg:text-size-4 mx-auto text-center">
                  <div className={`cursor-pointer ${activeInvoiceTab === 'invoice' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('invoice')}>Invoice</div>
                  <div className={`cursor-pointer ${activeInvoiceTab === 'ticket' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('ticket')}>Ticket</div>
               </div>
               <div className="bg-white w-full lg:w-1/2 mx-auto mt-4 py-4 lg:py-8">
                  {activeInvoiceTab == 'invoice' && (
                     <>
                        <div className="mx-auto w-fit">
                           <img src="/assets/images/logo.svg" alt="" />
                        </div>
                        <div className="flex flex-col font-light text-sm lg:text-size-2 text-black gap-3 px-6 lg:px-12 my-8">
                           <div>Payment Detail</div>
                           <div>Billed to: Mr. abc</div>
                           <div>Order Number: 123456789</div>
                           <div>Order Date: 12/08/2024</div>
                           <div>Total Amount: 5 AED</div>
                        </div>
                        <div className="bg-custom-purple text-black text-sm lg:text-size-3 font-light py-2 lg:py-4 mt-4">
                           <div className="grid grid-cols-5 mx-auto w-full lg:mx-4">
                              <div className="text-center">Product Image</div>
                              <div className="text-center">Product Name</div>
                              <div className="text-center">Quantity</div>
                              <div className="text-center">Price</div>
                              <div className="text-center">Total Amount</div>
                           </div>
                        </div>
                        <div className="grid grid-cols-5 items-center mx-auto w-full lg:mx-4 mt-2 text-sm lg:text-size-3 font-light">
                           <div className="flex items-center justify-center">
                              <img className="max-h-[100px]" src="/assets/images/keychain.svg" alt="" />
                           </div>
                           <div className="text-center">Keychain</div>
                           <div className="text-center">1</div>
                           <div className="text-center">5.00 AED</div>
                           <div className="text-center">5.00 AED</div>
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-4">
                           <img src="/assets/images/barcode.svg" alt="" />
                           <div className="font-light text-sm lg:text-size-2">123456789</div>
                        </div>
                     </>
                  )}
                  
                  {activeInvoiceTab == 'ticket' && (
                     <>
                        <div className="mx-auto w-fit">
                           <img src="/assets/images/logo.svg" alt="" />
                        </div>
                        <div className="bg-custom-purple text-darkone font-noto-sans-black text-head-3 lg:text-big-four uppercase text-center py-2 lg:py-4 mt-4">Yalla 4</div>
                        <div className="flex flex-col px-6 lg:px-12 font-light text-sm lg:text-size-2 text-black my-4 lg:my-8 gap-6">
                           <div className="w-fit mx-auto">
                              <img className="max-h-[100px] lg:max-h-[200px]" src="/assets/images/keychain.svg" alt="" />
                           </div>
                           <div className="flex flex-col gap-2 lg:gap-4">
                              <div className="flex justify-between">
                                 <div>Product Name</div>
                                 <div>Keychain</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Customer Name</div>
                                 <div>Mr. abc</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Customer Email</div>
                                 <div>customer@gmail.com</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Phone Number</div>
                                 <div>+97122334455</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Order Date</div>
                                 <div>28 July, 2024 8:22 PM</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Raffle Draw Price</div>
                                 <div>Samsung Galaxy Tab</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Order Number</div>
                                 <div>1234356789</div>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-4">
                           <img src="/assets/images/barcode.svg" alt="" />
                           <div className="font-light text-sm lg:text-size-2">123456789</div>
                        </div>
                     </>
                  )}
               </div>
               <button className="text-center text-themeone bg-white mx-auto mt-8 font-medium shadow-custom-1 rounded-full py-3 px-16 w-fit">Print</button>
            </div>
            {/* invoice ends */}

         </section>
      </div>
   )
}

export default CheckoutWithFreePrize;
