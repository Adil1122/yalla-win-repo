"use client"

import React, { useState, useEffect, useRef } from "react";
import TicketCard from "@/components/ticket-card";
import QRCode from "react-qr-code";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/libs/common'

type InvoiceTab = 'invoice' | 'ticket';

interface CheckoutWithFreeGameProps {
   id: string;
 }
 
 const CheckoutWithFreeGame: React.FC<CheckoutWithFreeGameProps> = ({ id }) => {

   const [activeInvoiceTab, setInvoiceActiveTab] = useState<InvoiceTab>('invoice')

   const handleInvoiceTabChange = (tab: InvoiceTab) => {
      setInvoiceActiveTab(tab)
   }
   const componentRef:any = useRef();
   
   const handlePrint = useReactToPrint({
     content: () => componentRef.current,
   });

   var [product, setProduct] = useState({
      name: "",
      price: 0,
      currency: "",
      vat: "",
      image: "",
      stock: ""
   });

   var [invoice, setInvoice] = useState({
      invoice_number: "", 
      vat: "",
      total_amount: 0,
      invoice_date: "",
      invoice_status: ""
   })

   var [tickets, setTickets] = useState([])

   var [quantity, setQuantity] = useState(1);
   var [qty_multiple, setQtyMultiple] = useState(1);
   var [step, setStep] = useState(1);
   var [game_name, setGameName] = useState('');
   var [game_id, setGameId] = useState('');
   var [total_amount, setTotalAmount] = useState(0);
   var [server_error, setServerError] = useState('');
   const router = useRouter();


   useEffect(() => {
      if(localStorage.getItem("yalla_logged_in_user") !== null) {
         var user = JSON.parse(localStorage.getItem("yalla_logged_in_user") + '')
         if(user.role === 'user') {
            getPageContents();
         } else {
            router.push('/');
         }
       } else {
           router.push('login');
       }
   }, []);

   const resetValues = () => {
      setQuantity(1);
      setTotalAmount(product.price);
   }

   const changeQuantity = (plus_minus: String) => {
      if(plus_minus == '+') {
         setQuantity(quantity + 1);
         setTotalAmount(product.price * (quantity + 1));
      } else if(quantity > 1) {
         setQuantity(quantity - 1);
         setTotalAmount(product.price * (quantity - 1));
      }
   }

   const stepOne = () => {
      for(var i = 1; i <= 20; i++) {
         if(localStorage.getItem('ticket_number_' + i) !== null) {
            localStorage.removeItem('ticket_number_' + i);
         }
         if(localStorage.getItem('game_type_' + i) !== null) {
            localStorage.removeItem('game_type_' + i);
         }
      }
      setStep(1);
   }

   function hasDuplicates(array: any) {
      var valuesSoFar = [];
      for (var i = 0; i < array.length; ++i) {
         var value = array[i];
         if (valuesSoFar.indexOf(value) !== -1) {
            return true;
         }
         valuesSoFar.push(value);
      }
      return false;
   }

   function validateTickets() {
      var validated = true;

      for(var i = 1; i <= quantity; i++) {
         
         var ticket_number: any = localStorage.getItem('ticket_number_' + i);
         if(ticket_number !== null) {
            ticket_number = JSON.parse(ticket_number);
            var ticket_number_splitted: any = ticket_number.ticket_number_splitted;
            console.log('ticket_number_splitted :', ticket_number_splitted)
            console.log('length :', ticket_number_splitted.length)
            for(var j = 0; j < ticket_number_splitted.length; j++) {
               if(ticket_number_splitted[j] === '') {
                  alert('All tickets should be filled');
                  validated = false;
                  break;
               }
            }

            if(game_name === 'Yalla 6' && hasDuplicates(ticket_number_splitted)) {
               alert('Ticket numbers digits must be unique');
               validated = false;
               break;
            }
         } else {
            alert('All tickets should be filled');
            validated = false;
            break;
         }

         if(game_name === 'Yalla 3' || game_name === 'Yalla 4') {
            var game_type: any = localStorage.getItem('game_type_' + i);
            if(game_type === null) {
               alert('Game type must be selected for all the tickets')
               validated = false;
               break;
            }
         } 
      }
      return validated;
   }

   const stepThree = async() => {

      var validated: any = validateTickets();

      if(localStorage.getItem('yalla_logged_in_user') !== null && validated) {
         try {

            var logged_in_user = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '');

            console.log(logged_in_user._id);



            let response = await fetch("/api/website/check-wallet?user_id=" + logged_in_user._id + "&total_amount=" + total_amount, {
               method: "GET",
               });
               const content = await response.json();
               console.log(content)
   
               if(!response.ok) {
                  setServerError(content.message);
               } else {
                  if(response.status === 200) {
                     //alert(content.message)
                     //setStep(3);
                     var ticket_details:any = [];
                     for (var i = 1; i <= quantity*qty_multiple; i++) {
                        var localStorageDetails = JSON.parse(localStorage.getItem('ticket_number_' + i) + '');
                        var ticket_type = localStorage.getItem('game_type_' + i);
                        var ticket_detail = {
                           ticket_number: localStorageDetails.ticket_number + '',
                           ticket_splitted: localStorageDetails.ticket_number_splitted,
                           ticket_type: ticket_type
                        }
                        ticket_details.push(ticket_detail)
                     }
                     var qr_code = Date.now() + Math.random();
                     var invoiceAndTicketsDocument = {
                        game_id: game_id,
                        product_id: id,
                        user_id: logged_in_user._id,
                        invoice_number: qr_code,
                        invoice_date: new Date(),
                        vat: product.vat,
                        total_amount: total_amount,
                        invoice_status: 'in-progress',
                        ticket_details: ticket_details,
                        platform: 'web'
                     }

                     console.log('before free game')

                     let response_2 = await fetch("/api/website/place-free-game-order", {
                        method: "POST",
                        headers: {
                           "Content-Type": "application/json",
                        },
                        body: JSON.stringify(invoiceAndTicketsDocument)
                     });

                     const content_2 = await response_2.json();
                     console.log('second content: ', content_2);

                     if(!response_2.ok) {
                     } else {
                        if(response_2.status === 200) {
                           var invoice_result = content_2.invoiceResult;
                           var ticket_result = content_2.ticketResult;
                           setInvoice({
                              invoice_number: invoice_result.invoice_number, 
                              vat: invoice_result.vat,
                              total_amount: invoice_result.total_amount,
                              invoice_date: invoice_result.invoice_date,
                              invoice_status: invoice_result.invoice_status
                           });
                           setTickets(ticket_result);
                           for(var i = 1; i <= quantity; i++) {
                              localStorage.removeItem("ticket_number_" + i);
                              localStorage.removeItem("game_type_" + i);
                           }
                           setStep(3);
                        }
                     }



                  } else {
                     alert(content.message);
                  }
               }
            
         } catch (error) {
            
         }
         //setStep(3);
      } else if(localStorage.getItem('yalla_logged_in_user') === null) {
         alert('You are not logged in. Please login first ...')
      }
      
   }



   const stepTwo = () => {
      setStep(2);
   }

   const getPageContents = async () => {
      try {

         for(var i = 1; i <= 20; i++) {
            if(localStorage.getItem('ticket_number_' + i) !== null) {
               localStorage.removeItem('ticket_number_' + i);
            }
            if(localStorage.getItem('game_type_' + i) !== null) {
               localStorage.removeItem('game_type_' + i);
            }
         }

         let response = await fetch("/api/website/buy-free-game-product?id=" + id, {
            method: "GET",
            });
            const content = await response.json();
            console.log(content)

            if(response.ok) {
               var game_product_quantity = parseInt(localStorage.getItem('game_product_quantity') + '');
               setQuantity(game_product_quantity);
               setGameName(content.result[0].productWithGame[0].name);
               setGameId(content.result[0].productWithGame[0]._id);
               setTotalAmount(content.result[0].price * game_product_quantity);
               setQtyMultiple(content.offer && content.offer.length > 0 ? content.offer[0].qty_multiple : 1)
               setProduct((prev) => {
                  return {...prev, ...content.result[0]};
                });
                
            } else {

            }
         
      } catch (error) {
         
      }
   }

   const ticket_rows = [];
   for (let i = 0; i < quantity*qty_multiple; i++) {
      ticket_rows.push(
         <TicketCard key={i} gameName={game_name} productPrice={product.price} quantity={quantity} s_no={i+1} />
      );
   }


   return (

      <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo overflow-x-hidden">
         <section className="flex flex-col items-center gap-12 py-8 lg:py-16 px-8 lg:px-16">
            
            {/* step wizard starts */}
            <div className="flex flex-col text-white w-full max-w-md gap-2 px-8 lg:px-0">
               <div className="flex flex-row items-center justify-between">
                  <div>Step 1</div>
                  <div>Step 2</div>
                  <div>Step 3</div>
               </div>
               <div className="flex flex-row items-center text-white">
                  <div className="w-[35px] h-[35px] lg:w-[40px] lg:h-[40px] rounded-full bg-white flex items-center justify-center">
                     <div className="w-[31px] h-[31px] lg:w-[35px] lg:h-[35px] rounded-full bg-themetwo m-[2px]"></div>
                  </div>
                  <div className="flex-1 h-[7px] bg-white relative">
                     {/* uncomment this on step 2 */}
                     {(step == 2 || step == 3) && (<div className="h-[3px] bg-themetwo absolute top-[2px] -left-[3px] w-[105%]"></div>)}
                  </div>
                  <div className="w-[35px] h-[35px] lg:w-[40px] lg:h-[40px] rounded-full bg-white flex items-center justify-center">
                     {/* uncomment this on step 2 */}
                     {(step == 2 || step == 3) && (<div className="w-[31px] h-[31px] lg:w-[35px] lg:h-[35px] rounded-full bg-themetwo m-[2px]"></div>)}
                  </div>
                  <div className="flex-1 h-[7px] bg-white relative">
                     {/* uncomment this on step 3 */}
                     {step == 3 && (<div className="h-[3px] bg-themetwo absolute top-[2px] -left-[3px] w-[105%]"></div>)}
                  </div>
                  <div className="w-[35px] h-[35px] lg:w-[40px] lg:h-[40px] rounded-full bg-white flex items-center justify-center">
                     {/* uncomment this on step 3 */}
                     {step == 3 && (<div className="w-[31px] h-[31px] lg:w-[35px] lg:h-[35px] rounded-full bg-themetwo m-[2px]"></div>)}
                  </div>
               </div>
               <div className="flex flex-row items-center justify-between font-medium">
                  <div className="-ml-8 extra-small:text-center">Select Quantity</div>
                  <div className="mr-4 extra-small:text-center extra-small:mr-6">Select Number</div>
                  <div className="-mr-8 text-center">Pay Amount</div>
               </div>
            </div>
            {/* step wizard ends */}

            {/* step 1 starts */}
            {step == 1 && (
            <div className="flex flex-col md:flex-row bg-white w-full rounded-standard py-6 lg:py-12 px-6 md:px-12 gap-4 md:gap-12">
               
               <div className="flex-1">
                  <img src={product.image} alt="" />
               </div>
               <div className="flex flex-col flex-1">
                  <div className="text-theme-gradient text-head-3 xl:text-large-head font-bold">Buy a {product.name} for {product.price} AED</div>
                  <div className="text-black text-size-4 xl:text-head-4 font-light">The more you purchase the more chances to win</div>
                  <div className="flex flex-row items-center gap-4 mt-2 xl:mt-8">
                     <div className="text-black font-light text-size-4 xl:text-size-4 xl:text-head-2">Select Quantity:</div>
                     <div className="flex flex-row items-center bg-[#E4E4E4] rounded px-4">
                        <div className="font-noto-sans-bold text-head-2 text-black cursor-pointer py-2" onClick={() => changeQuantity("-")}>-</div>
                        <div className="text-themeone text-head-2 text-center px-3 mx-3 border-r border-l border-gray-300 py-2">{quantity}</div>
                        <div className="font-noto-sans-bold text-head-2 font- text-black cursor-pointer py-2" onClick={() => changeQuantity("+")}>+</div>
                     </div>
                  </div>
                  <div className="flex flex-row gap-6 mt-4 lg:mt-8 text-black">
                     <div className="text-size-4 xl:text-head-4 font-light">Total:</div>
                     <div className="font-bold text-size-4 xl:text-head-4">{total_amount} AED </div>
                  </div>
                  <div className="flex flex-row gap-6 mt-4 lg:mt-8 text-black">
                     <button className="text-center text-white bg-themeone font-medium xl:font-semibold shadow-custom-1 rounded-full py-2 xl:py-3 px-10 xl:px-16 w-fit" onClick={() => resetValues()}>Reset</button>
                     <button className="text-center text-white bg-themeone font-medium xl:font-semibold shadow-custom-1 rounded-full py-2 xl:py-3 px-6 xl:px-10 w-fit" onClick={() => stepTwo()} >Add to Cart</button>
                  </div>
               </div>
            </div>
            )}
            {/* step 1 ends */}

            {/* step 2 starts */}
            {step == 2 && (
            <div className="flex flex-col bg-white w-full rounded-standard py-8 lg:py-8 px-8 lg:px-32 gap-0 lg:gap-16">
               <div className="text-theme-gradient font-semibold text-head-4 xl:text-big-five text-center">Choose Your Number</div>
               <div className="flex flex-row items-center justify-between">
                  <div className="text-black text-center w-full md:w-fit lg:text-left font-light text-size-2 lg:text-head-4 mt-1 lg:mt-0">Terms & Conditions applied</div>
                  <div className="hidden md:flex flex-row gap-2 text-black">
                     <div className="lg:text-head-4 text-size-4 font-light">Total:</div>
                     <div className="lg:font-bold text-size-4 lg:text-head-4">{total_amount} USD </div>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 xl:gap-24 xl:w-[70%] w-full xl:mx-auto">
               {ticket_rows}
               </div>
               <div className="md:hidden flex flex-row gap-2 mt-8">
                  <div className="text-size-4 font-light">Total:</div>
                  <div className="font-medium text-size-4">{total_amount} USD </div>
               </div>
               <div className="flex flex-row justify-between lg:mt-0 mt-4">
                  <button className="text-center text-white bg-themeone font-medium lg:font-semibold shadow-custom-1 rounded-full py-2 lg:py-3 px-10 lg:px-16 w-fit" onClick={() => stepOne()}>Back</button>
                  <button className="text-center text-white bg-themeone font-medium lg:font-semibold shadow-custom-1 rounded-full py-2 lg:py-3 px-6 lg:px-10 w-fit" onClick={() => stepThree()}>Pay Now</button>
               </div>
            </div>
            )}
            {/* step 2 ends */}

            {/* invoice starts */}
            {step == 3 && (
            <div className="flex flex-col gap-2 lg:gap-4 w-full">
               <div className="text-white text-center text-head-4 lg:text-big-three font-noto-sans uppercase tracking-tight">Invoice and Ticket</div>
               <div className="text-white text-size-2 lg:text-size-4 font-light text-center">Please find your invoice below</div>
               <div className="flex flex-row gap-4 text-white text-size-3 lg:text-size-4 mx-auto text-center">
                  <div className={`cursor-pointer ${activeInvoiceTab === 'invoice' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('invoice')}>Invoice</div>
                  <div className={`cursor-pointer ${activeInvoiceTab === 'ticket' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('ticket')}>Ticket</div>
               </div>
               <div className="bg-white w-full lg:w-1/2 mx-auto mt-4 py-4 lg:py-8" ref={componentRef}>
               
                  {activeInvoiceTab == 'invoice' && (
                     <>
                        <div className="mx-auto w-fit">
                           <img src="/assets/images/logo.svg" alt="" />
                        </div>
                        <div className="bg-custom-purple text-darkone font-noto-sans-black text-head-3 lg:text-big-four uppercase text-center py-2 lg:py-4 mt-4">Invoice</div>
                        <div className="flex flex-col px-8 lg:px-12 font-light text-sm lg:text-size-2 text-black my-4 lg:my-8 gap-2 lg:gap-4">
                           <div className="flex justify-between">
                              <div>Game Name</div>
                              <div>{game_name}</div>
                           </div>
                           
                           <div className="flex justify-between">
                              <div>Order Number</div>
                              <div>{invoice.invoice_number}</div>
                           </div>
                           {/*<div className="flex justify-between">
                              <div>Ticket Price</div>
                              <div>4.45 AED</div>
                           </div>*/}
                           <div className="flex justify-between">
                              <div>Game Name</div>
                              <div>{game_name}</div>
                           </div>
                           <div className="flex justify-between">
                              <div>VAT %</div>
                              <div>{product.vat}</div>
                           </div>
                           <div className="flex justify-between">
                              <div>Total Amount</div>
                              <div>{total_amount} AED</div>
                           </div>
                           <div className="flex justify-between">
                              <div>Order Date</div>
                              <div>{formatDate(invoice.invoice_date)}{/*28 July, 2024 8:22 PM*/}</div>
                           </div>
                           <div className="flex justify-between">
                              <div>Order Status</div>
                              <div className="text-success">{invoice.invoice_status}</div>
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
                  
                  {activeInvoiceTab == 'ticket' && (
                     <>
                        <div className="mx-auto w-fit">
                           <img src="/assets/images/logo.svg" alt="" />
                        </div>
                        <div className="bg-custom-purple text-darkone font-noto-sans-black text-head-3 lg:text-big-four uppercase text-center py-2 lg:py-4 mt-4">{game_name}</div>
                        <div className="flex flex-col px-8 lg:px-12 font-light text-sm lg:text-size-2 text-black my-4 lg:my-8 gap-6">
                           <div className="w-fit mx-auto">
                              <img className="max-h-[100px] lg:max-h-[200px]" src="/assets/images/keychain.svg" alt="" />
                           </div>
                           <div className="flex flex-col gap-2 lg:gap-4">
                              <div className="flex justify-between">
                                 <div>Order Number</div>
                                 <div>{invoice.invoice_number}</div>
                              </div>
                              {/*<div className="flex justify-between">
                                 <div>Ticket Price</div>
                                 <div>4.45 AED</div>
                              </div>*/}
                              <div className="flex justify-between">
                                 <div>Game Name</div>
                                 <div>{game_name}</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>VAT %</div>
                                 <div>{product.vat}</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Total Amount</div>
                                 <div>{total_amount} AED</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Order Date</div>
                                 <div>{formatDate(invoice.invoice_date)}{/*28 July, 2024 8:22 PM*/}</div>
                              </div>
                              <div className="flex justify-between">
                                 <div>Order Status</div>
                                 <div className="text-success">Active</div>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-4 lg:grid-cols-4 mt-4 lg:text-size-1 text-xs">
                              <div className="flex flex-col gap-2 items-center">
                                 <div className="font-medium lg:font-bold uppercase">Numbers</div>
                                 { tickets.map((ticket: any) => (
                                    <div key={ticket.ticket_number} className="font-light">{ticket.ticket_number}</div>
                                 ))}
                              </div>
                              <div className="flex flex-col gap-2 items-center">
                                 <div className="font-medium lg:font-bold uppercase">Straight</div>
                                 { tickets.map((ticket: any) => (
                                    <div key={ticket.ticket_number} className="font-light">{ticket.ticket_type === 'Straight' ? "1" : "0"}</div>
                                 ))}
                              </div>
                              <div className="flex flex-col gap-2 items-center">
                                 <div className="font-medium lg:font-bold uppercase">Rumble</div>
                                 { tickets.map((ticket: any) => (
                                    <div key={ticket.ticket_number} className="font-light">{ticket.ticket_type === 'Rumble' ? "1" : "0"}</div>
                                 ))}
                              </div>
                              <div className="flex flex-col gap-2 items-center">
                                 <div className="font-medium lg:font-bold uppercase">Chance</div>
                                 { tickets.map((ticket: any) => (
                                    <div key={ticket.ticket_number} className="font-light">{ticket.ticket_type === 'Chance' ? "1" : "0"}</div>
                                 ))}
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

export default CheckoutWithFreeGame;
