"use client"

import React, { useEffect, useState, useRef } from "react"
import CartItem from "@/components/cart-item";
import { useRouter } from 'next/navigation';
import QRCode from "react-qr-code";
import { useReactToPrint } from 'react-to-print';
import { formatDate } from '@/libs/common'

type InvoiceTab = 'invoice' | 'ticket'
 const Cart = () => {

   const [activeInvoiceTab, setInvoiceActiveTab] = useState<InvoiceTab>('invoice')

   const handleInvoiceTabChange = (tab: InvoiceTab) => {
      setInvoiceActiveTab(tab)
   }

   const componentRef:any = useRef();
   
   const handlePrint = useReactToPrint({
     content: () => componentRef.current,
   });

   const router = useRouter();

   var [cart, setCart] = useState({
      items: [],
   });
   
   var [draws, setDraws] = useState([])

   var [invoice, setInvoice] = useState({
      user_id: "", 
      user_name: "",
      user_email: "",
      user_phone: "",
      invoice_number: "", 
      invoice_date: "", 
      total_amount: 0, 
      invoice_status: "",
      product_details: []
   });

   var [step, setStep] = useState(1);
   var [total_amount, setTotalAmount] = useState(0);

   useEffect(() => {
    if(localStorage.getItem("yalla_logged_in_user") !== null) {
      var user = JSON.parse(localStorage.getItem("yalla_logged_in_user") + '')
      if(user.role === 'user') {
         getUserBasket();
      } else {
         router.push('/');
      }
    } else {
        router.push('login');
    }

   }, []);

   const getUserBasket = async() => {
      try {

         var user = JSON.parse(localStorage.getItem("yalla_logged_in_user") + '');
         let response = await fetch("api/website/basket?user_id=" + user._id, {
            method: "GET",
            });
            const content = await response.json();
            //console.log(content)

            if(!response.ok) {
               
            } else {
               resetCart(content.result);
               setDraws(content.draws);
                console.log('content.draws: ', content.draws)
            }
         
      } catch (error) {
         
      }
   }

   async function deleteCartItem(e: any) {
      
      console.log(e.currentTarget.id)
      var user = JSON.parse(localStorage.getItem("yalla_logged_in_user") + '');
      let response = await fetch("api/website/basket?id=" + e.currentTarget.id + "&user_id=" + user._id, {
      method: "DELETE",
      });
      const content = await response.json();
      console.log(content)

      if(!response.ok) {
         alert(content.message)
      } else {
         resetCart(content.result);
      }
   }

   function resetCart(result: any) {
      setCart((prev) => {
         return { ...prev, ...{
            items: result
         } };
       });

       var total = 0;

       var product_details:any = [];
       for(var i = 0; i < result.length; i++) {
         total = total + (result[i].quantity * result[i].productInBasket[0].price);
         product_details.push({
            product_id: result[i].productInBasket[0]._id,
            product_name: result[i].productInBasket[0].name,
            product_image: result[i].productInBasket[0].image,
            product_quantity: result[i].quantity,
            product_price: result[i].productInBasket[0].price,
            total_amount: result[i].quantity * result[i].productInBasket[0].price,

            prize_id: result[i].prizeInBasket[0]._id,
            prize_name: result[i].prizeInBasket[0].name,
            prize_image: result[i].prizeInBasket[0].image,
            prize_price: result[i].prizeInBasket[0].price,
         })
       }

       var qr_code = Date.now() + Math.random() + '';
       var user = JSON.parse(localStorage.getItem("yalla_logged_in_user") + '');
       setInvoice({
         user_id: user._id, 
         user_name: user.first_name + ' ' + user.last_name,
         user_email: user.email,
         user_phone: user.mobile,
         invoice_number: qr_code, 
         invoice_date: new Date() + '',
         total_amount: total, 
         invoice_status: "in-progress",
         product_details: product_details
      });

      setTotalAmount(total);
   }

   async function placeOrder() {

      console.log(cart.items.length)
      try {
         if(cart.items.length > 0) {
            //invoice['draws'].push(draws);
            console.log(invoice)

            let response = await fetch("/api/website/place-raffle-product-order", {
                method: "POST",
                headers: {
                   "Content-Type": "application/json",
                },
                body: JSON.stringify({
                     invoice: invoice,
                     draws: draws,
                     platform: 'web'
                  })
                });
                const content = await response.json();
    
                if(!response.ok) {
                  alert('Insufficient Funds in Your Wallet..');
                } else {
                   setStep(2);
                }
             } else {
               alert('your cart is empty');
             }

      } catch (error) {
         
      }

   }

   const updateQuantity = async (e: any) => {

      console.log('cart_id')
      var cart_id = e.currentTarget.getAttribute('data-item-id');
      var quantity = e.currentTarget.getAttribute('data-quantity');
      var operation = e.currentTarget.getAttribute('data-operation');
      var user = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '');
      try {
         let response = await fetch("/api/website/basket?id=" + cart_id + "&quantity=" + quantity + "&operation=" + operation + "&user_id=" + user._id, {
               method: "PATCH",
               });
               const content = await response.json();
   
               if(!response.ok) {
                  alert(content.messaage);
               } else {
                  resetCart(content.result);
                  console.log('result: ', content.result)
               }

      } catch (error) {
         console.log('error', error)
      }

   }

   return (

      <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo overflow-x-hidden">
         <section className="flex flex-col gap-8 lg:gap-16 py-8 lg:py-16 px-8 lg:px-16">
            <h1 className="text-head-9 lg:text-extra-large-head text-center uppercase text-white font-noto-sans lg:font-noto-sans-black">Cart Details</h1>
            { step === 1 && (
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-32">
               <div className="lg:w-[60%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                  {
                     cart.items.map((item: any) => (
                        item.productInBasket.length > 0 && (
                           <CartItem key={item._id} item_id={item._id} item_name={item.productInBasket[0].name} item_quantity={item.quantity} item_date={item.createdAt} item_image={item.productInBasket[0].image} deleteCartItem={deleteCartItem} updateQuantity={updateQuantity}/>
                        )
                     ))
                  }
               </div>
               <div className="lg:w-[40%] flex flex-col text-white gap-8">
                  <div className="flex flex-row items-center gap-2">
                     <div className="text-head-4 lg:text-head-8 font-bold">My Shopping Cart</div>
                     <div className="text-size-2 lg:text-head-4 font-light">{cart.items.length > 1 ? '(' + cart.items.length + ' items)' : '(' + cart.items.length + ' item)'}</div>
                  </div>
                  <div className="flex flex-col gap-1 lg:gap-3 text-size-4 lg:text-head-4 font-light">
                     {
                        cart.items.map((item: any) => (
                           item.productInBasket.length > 0 && (
                           <div key={item._id} className="flex flex-row justify-between">
                              <div key={item._id + item.productInBasket[0]._id}>{item.productInBasket[0].name}</div>
                              <div key={item.productInBasket[0]._id + item._id} className="">{item.quantity * item.productInBasket[0].price}</div>
                           </div>
                           )
                        ))
                     }
                     <div className="flex flex-row justify-between">
                        <div>Total</div>
                        <div className="font-bold">{total_amount + ''} AED</div>
                     </div>
                  </div>
                  <div>
                     <button className="text-themeone bg-white rounded-full w-full text-center shadow-custom-1 py-2 lg:py-3 font-medium text-size-3 lg:text-head-2 mt-3 lg:mt-6" onClick={() => placeOrder()}>Check Out</button>
                  </div>
               </div>
            </div>
            )}

            {/* invoice starts */}
            { step === 2 && (
            <div className="flex flex-col gap-2 lg:gap-4 w-full" ref={componentRef}>
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
                           <div>Billed to: {invoice.user_name}</div>
                           <div>Order Number: {invoice.invoice_number}</div>
                           <div>Order Date: {formatDate(invoice.invoice_date)}</div>
                           <div>Total Amount: {total_amount} AED</div>
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
                        { 
                        invoice.product_details.map((product: any) => (
                           <div key={product.product_id} className="grid grid-cols-5 items-center mx-auto w-full lg:mx-4 mt-2 text-sm lg:text-size-3 font-light">
                              <div className="flex items-center justify-center">
                                 <img className="max-h-[100px]" src={product.product_image} alt="" />
                              </div>
                              <div className="text-center">{product.product_name}</div>
                              <div className="text-center">{product.product_quantity}</div>
                              <div className="text-center">{product.product_price} AED</div>
                              <div className="text-center">{product.total_amount} AED</div>
                           </div>
                        ))
                        }
                        <div className="flex flex-col items-center gap-2 mt-4">
                           {/*<img src="/assets/images/barcode.svg" alt="" />*/}
                           <QRCode 
                           value={invoice.invoice_number}
                           style={{ height: "auto", width: "100px" }}
                            />
                           <div className="font-light text-sm lg:text-size-2">{invoice.invoice_number}</div>
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
                              {/*<div className="flex justify-between">
                                 <div>Product Name</div>
                                 <div>Keychain</div>
                              </div>*/}
                              <div className="flex justify-between">
                                 <div>Customer Name</div>
                                 <div>{invoice.user_name}</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Customer Email</div>
                                 <div>{invoice.user_email}</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Phone Number</div>
                                 <div>{invoice.user_phone}</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Order Date</div>
                                 <div>{formatDate(invoice.invoice_date)}</div>
                              </div>
                              {/*<div className="flex justify-between">
                                 <div>Raffle Draw Price</div>
                                 <div>Samsung Galaxy Tab</div>
                              </div>*/}
                              <div className="flex justify-between">
                                 <div>Order Number</div>
                                 <div>1234356789</div>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-4">
                           {/*<img src="/assets/images/barcode.svg" alt="" />*/}
                           <QRCode 
                           value={invoice.invoice_number}
                           style={{ height: "auto", width: "100px" }}
                            />
                           <div className="font-light text-sm lg:text-size-2">{invoice.invoice_number}</div>
                        </div>
                     </>
                  )}
               </div>
               <button className="text-center text-themeone bg-white mx-auto mt-8 font-medium shadow-custom-1 rounded-full py-3 px-16 w-fit" onClick={handlePrint}>Print</button>
            </div>
            )}

            {/* invoice ends */}

         </section>
      </div>
   )
}

export default Cart;
