'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from "next/image"
import { faArrowLeft, faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import visaIcon from '@/../public/assets/images/visa-icon.svg'
import mastecardIcon from '@/../public/assets/images/mastercard-icon.svg'
import Link from 'next/link'
import Notification from "@/components/notificationWidget";
import { formatISODate } from '@/libs/common';

import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

type PaymentMode = 'card' | 'coupon'
// Load your public Stripe API key
const stripePromise = loadStripe('pk_test_1WSZXWQosixBn4v6GuszWmBl'); // Use your Stripe public key


const UserAccountAddCredit = () => {

   const [toggled, setToggled] = useState(false)
   const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode>('card')
   const paymentModes = [
      {id: 'card', name: 'Pay Via Card'},
      //{id: 'coupon', name: 'Pay Via Coupon'},
   ]

   const handleToggle = () => {
      setToggled(!toggled)
   }

   const handlePaymentMode = (value: PaymentMode) => {
      setSelectedPaymentMode(value)
   }

    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [card_holder_name, setCardHolderName] = useState('');

    const stripe = useStripe();
    const elements = useElements();
    const [activeCoupons, setActiveCoupons] = useState([]);
    const [purchasedCoupons, setPurchasedCoupons] = useState([]);
    const [coupon_code, setCouponCode] = useState('');
    const [settings, setSettings] = useState<any>({});
    var card_element: any = null;

    useEffect(() => {
      getActiveCoupons()
      card_element = document.getElementById('cardNumberElement');
      console.log(card_element)
    }, [])

    const getActiveCoupons = async () => {
         var user = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '');
         const response = await fetch('/api/user/account/add-credit/via-coupon-code?type=website&user_id=' + user._id, {
            method: 'PATCH',
         });
         const content = await response.json();
         if(!response.ok) {
         } else {
            var temp: any = content.activeCoupons;
            for(var i = 0; i < temp.length; i++) {
               temp[i].date = formatISODate(new Date(temp[i].date)).formatedDateOnly;
               temp[i]['quantity_to_select'] = 1;
            }
            setActiveCoupons(temp)

            temp = content.purchasedCoupons;
            for(var i = 0; i < temp.length; i++) {
               temp[i].date = formatISODate(new Date(temp[i].date)).formatedDateOnly;
            }
            setPurchasedCoupons(temp)
            setSettings(content.settings)
         }
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if(amount > 0 && card_holder_name !== '') {

         if (!stripe || !elements) return;

         try {
               const res = await fetch('/api/user/account/add-credit/get-stripe-payment-intent', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ amount }),
               });

               const { clientSecret } = await res.json();
               console.log('elements: ', elements.getElement(CardNumberElement))

               var elem: any = elements.getElement(CardNumberElement);
               elem = elem !== null ? elem : {};

               const { error } = await stripe.confirmCardPayment(clientSecret, {
                  payment_method: {
                     card: elem,
                     billing_details: {
                        name: card_holder_name,
                     },
                  }
               });

               console.log('error: ', error)

               if (error) {
                  setError(error.message + '');
                  //alert(error.message + '')
               } else {

                  var user = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '');
                  const res2 = await fetch('/api/user/account/add-credit/add-to-wallet?user_id=' + user._id + '&amount=' + amount, {
                     method: 'GET',
                  });

                  if(!res2.ok) {
                     setSuccess('');
                     setError('Amount could not be added in user wallet');
                  } else {
                     setSuccess('Payment successful!');
                     setError('');
                     setAmount(0);
                  }
               }
         } catch (error: any) {
               setError('Payment failed: ' + error.message);
         }
      } else if(amount <= 0) {
         setError('Please enter an amount to pay.');
      } else {
         setError('Please enter Card Holder Name');
      }
    };
    
    const validateCouponCode = () => {
      var error = false;
      console.log(isNumber(coupon_code))
      if(!isNumber(coupon_code) || coupon_code.length !== 12) {
         setError('Coupon Code must be 12 Digits Number');
         error = true;
      } else {
         setError('')
         error = false;
      }
      return error;
    }

    function isNumber(value: any) {
      if (isNaN(value)) {
        return false;
      }
      return true;
    }

    const addViaCouponCode = async () => {
      try {
         if(!validateCouponCode()) {
            var user = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '');
            const response = await fetch('/api/user/account/add-credit/via-coupon-code?user_id=' + user._id + '&coupon_code=' + coupon_code, {
               method: 'POST',
            });
            //var content = await response.json();
            if(!response.ok) {
               setSuccess('')
               setError('Credit could not be added via Coupon Code');
            } else {
               setError('')
               setSuccess('Credit Successfully added via Coupon Code');
            }
         }
         
      } catch (error) {
         
      }
    }

    const setCouponQuantity = (e: any) => {
      var operation = e.currentTarget.getAttribute('data-operation');
      var coupon_id = e.currentTarget.getAttribute('data-coupon-id');
      var temp: any = activeCoupons;
      for(var i = 0; i < temp.length; i++) {
         if(temp[i]._id === coupon_id) {
            if(operation === '+') {
               temp[i].quantity_to_select++;
            } else if(temp[i].quantity_to_select > 1) {
               temp[i].quantity_to_select--;
            }
         }
      }
      setActiveCoupons((prev) => {
         return [...prev];
      });
    }

    const buyCoupon = async (e: any) => {
      try {
            var quantity = e.currentTarget.getAttribute('data-quantity');
            var coupon_id = e.currentTarget.getAttribute('data-coupon-id');
            var current_coupon_code = e.currentTarget.getAttribute('data-coupon-code');
            var id = e.currentTarget.getAttribute('data-id');
            
            var user = JSON.parse(localStorage.getItem('yalla_logged_in_user') + '');
            const response = await fetch('/api/user/account/add-credit/via-coupon-code?user_id=' + user._id + '&coupon_code=' + current_coupon_code + '&quantity=' + quantity + '&id=' + id, {
               method: 'GET',
            });
            //var content = await response.json();
            if(!response.ok) {
               setSuccess('')
               setError('Coupon could not be Purchased');
            } else {
               /*var temp: any = activeCoupons;
               for(var i = 0; i < temp.length; i++) {
                  if(temp[i]._id === coupon_id) {
                     temp[i].purchased = 1;
                  }
               }
               setActiveCoupons((prev) => {
                  return [...prev];
               });*/
               getActiveCoupons()

               setError('')
               setSuccess('Coupon purchased successfully');
            }
         
      } catch (error) {
         
      }
    }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow gap-6 lg:gap-12 lg:px-12 py-12 lg:py-20 flex flex-col">
         <button type="button" className="flex flex-row items-center gap-3 text-white w-fit px-6">
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
            <div className="font-bold text-head-2 lg:text-head-4">Add Credit</div>
         </button>

         {/* options start */}
         <div className="flex flex-col gap-5 bg-light-background-two backdrop-blur-64 lg:bg-transparent lg:py-0 py-6 lg:gap-8 px-6">
            <h2 className="text-white font-bold text-size-4 lg:text-head-4">Choose Payment Method</h2>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-16">
            {paymentModes.map((item, index) => (
               (item.id == 'card' || (item.id == 'coupon' && settings.show_coupons_web === '1')) && (
                  <div key={index} onClick={() => handlePaymentMode(item.id as PaymentMode)} className="flex flex-row items-center gap-4 lg:gap-6 cursor-pointer">
                     <div className="w-[15px] h-[15px] lg:w-[25px] lg:h-[25px] rounded-full ring-[2px] lg:ring-[3px] ring-white flex items-center justify-center">
                        {item.id == selectedPaymentMode && (
                           <div className="w-[11px] h-[11px] lg:w-[20px] lg:h-[20px] rounded-full bg-white"></div>
                        )}
                     </div>
                     <div className="text-white font-medium text-size-3 lg:text-head-1">{item.name}</div>
                  </div>
               )

            ))}
            </div>   
         </div>
         {/* options end */}
         {selectedPaymentMode == 'card' && (
            <>
               {/* pay via card step 1 starts */}
               <div className="flex flex-col gap-6 lg:gap-12 lg:w-1/2">
                  <div className="flex flex-col gap-5 bg-light-background-two backdrop-blur-64 lg:bg-transparent px-6 lg:py-0 py-6">
                     <h2 className="text-white font-bold text-size-4 lg:text-head-4">Enter Amount</h2>
                     <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3" min="0" type="number" placeholder="Amount in AED" onChange={(e) => setAmount(parseFloat(e.target.value))} />
                     <div className="flex items-center gap-5 justify-end">
                        <div className="px-2 py-4 bg-white rounded-lg flex items-center justify-center w-fit">
                           <Image alt="Dream draw icon" className="hidden lg:flex" width={70} src={visaIcon}></Image>
                           <Image alt="Dream draw icon" className="lg:hidden" width={40} src={visaIcon}></Image>
                        </div>
                        <Image alt="Dream draw icon" className="lg:hidden" width={50} src={mastecardIcon}></Image>
                        <Image alt="Dream draw icon" className="hidden lg:flex" width={60} src={mastecardIcon}></Image>
                     </div>
                     <button className="bg-white rounded-lg text-size-2 lg:text-size-4 text-themetwo font-medium py-3 lg:py-4 px-16 lg:w-fit" style={{display: 'none'}}>Add Now</button>
                  </div>
               </div>
               {/* pay via card step 1 ends */}
               {/* pay via card step 2 starts */}
               <div className="flex flex-col gap-6 lg:gap-12 lg:w-1/2">
                  <div className="flex flex-col gap-5 bg-light-background-two backdrop-blur-64 lg:bg-transparent lg:py-0 py-6 lg:gap-8 px-6">
                     <h2 className="text-white font-bold text-size-4 lg:text-head-4">Choose Payment Method</h2>
                     <div className="flex flex-col gap-4 lg:gap-8">
                        <div className="flex flex-row items-center gap-4 lg:gap-6 cursor-pointer">
                           <div className="rounded border border-[2px] lg:border-[3px] border-white w-[20px] h-[20px] lg:w-[25px] lg:h-[25px] flex items-center justify-center">
                              {/* add this when checked */}
                              <FontAwesomeIcon className="text-white ml-[1px]" size="1x" icon={faCheck} />
                           </div>
                           <div className="text-white font-medium text-size-3 lg:text-head-1">Credit/Debit Card</div>
                        </div>
                        <div className="flex flex-row items-center gap-4 lg:gap-6 cursor-pointer" style={{display: 'none'}}>
                           <div className="rounded border border-[2px] lg:border-[3px] border-white w-[20px] h-[20px] lg:w-[25px] lg:h-[25px] flex items-center justify-center">
                              {/* add this when checked */}
                              {/* <FontAwesomeIcon className="text-white ml-[1px]" size="1x" icon={faCheck} /> */}
                           </div>
                           <div className="text-white font-medium text-size-3 lg:text-head-1">Pay By Pay</div>
                        </div>
                        <div className="flex flex-row items-center gap-4 lg:gap-6 cursor-pointer" style={{display: 'none'}}>
                           <div className="rounded border border-[2px] lg:border-[3px] border-white w-[20px] h-[20px] lg:w-[25px] lg:h-[25px] flex items-center justify-center">
                              {/* add this when checked */}
                              {/* <FontAwesomeIcon className="text-white ml-[1px]" size="1x" icon={faCheck} /> */}
                           </div>
                           <div className="text-white font-medium text-size-3 lg:text-head-1">BOTIM Pay</div>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col gap-5 bg-light-background-two backdrop-blur-64 lg:bg-transparent lg:py-0 py-6 lg:gap-8 px-6">
                     <h2 className="text-white font-bold text-size-4 lg:text-head-4">Enter Card Details</h2>

                     <div className="flex flex-col gap-6">
                        <div className="w-full">
                           <CardNumberElement className="placeholder-lighttwo text-white bg-transparent flex items-center justify-center border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" />
                           {/*<input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="Enter Card Details" />*/}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4">
                           <div className="flex-1">
                              <CardCvcElement className="placeholder-lighttwo text-white bg-transparent flex items-center justify-center border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" />
                              {/*<input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="CVV" />*/}
                           </div>
                           <div className="flex-1">
                              <CardExpiryElement className="placeholder-lighttwo text-white bg-transparent flex items-center justify-center border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" />
                              {/*<input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="MM/YY" />*/}
                           </div>
                        </div>
                        <div className="w-full">
                           <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full" type="text" placeholder="Card Holder Name ..." onChange={(e) => setCardHolderName(e.target.value)} />
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                           <div className="flex items-center gap-3">      
                              <div className="rounded border border-[2px] lg:border-[3px] border-white w-[20px] h-[20px] flex items-center justify-center">
                                 {/* add this when checked */}
                                 <div className="text-white ml-[1px]">
                                    <FontAwesomeIcon  size="sm" icon={faCheck} />
                                 </div>
                              </div>
                              <div className="text-white text-sm lg:text-size-1">
                                 I agree to the payment and <Link className="underline" href="/terms-and-conditions">terms & conditions</Link>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 lg:gap-3 mr-auto lg:mr-0 mt-5 lg:mt-0">
                              <div className="order-2 lg:order-1 text-white text-sm lg:text-size-1">Save Card</div>
                              <div className="order-1 lg:order-2 w-[25px] h-[16px] lg:w-[35px] lg:h-[23px] relative rounded-xl border-[2px] lg:border-[3px] border-white flex items-center justify-center cursor-pointer" onClick={handleToggle}>
                                 <div className={`border-[2px] lg:border-[3px] border-white w-[6px] h-[6px] lg:w-[11px] lg:h-[11px] rounded-full transform transition-all duration-500 ease-in-out ${toggled ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                              </div>
                           </div>
                        </div>
                        <button className="bg-white rounded-lg text-size-2 lg:text-head-1 text-themetwo font-semibold py-3 lg:py-4 px-16 lg:mt-6" onClick={handleSubmit}>
                           Pay AED {amount}
                        </button>
                     </div>
                  </div>
               </div>
               {/* pay via card step 2 starts */}
            </>
         )}

         {selectedPaymentMode == 'coupon' && (
            <>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-5 bg-light-background-two backdrop-blur-64 lg:bg-transparent lg:w-1/2 px-6 lg:py-0 py-6">
                     <h2 className="text-white font-bold text-size-4 lg:text-head-4">Enter Coupon Code</h2>
                     <input className="placeholder-lighttwo text-white bg-transparent border-[2px] lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3" type="text" placeholder="12 Digit Code" onChange={(e) => setCouponCode(e.target.value)} />
                     <button className="bg-white rounded-lg text-size-2 lg:text-size-4 text-themetwo font-medium py-3 lg:py-4 px-16 lg:w-fit lg:mt-3" onClick={() => addViaCouponCode()}>Add Now</button>
                  </div>
                  <div className="flex flex-col gap-6 lg:gap-8 mt-6 bg-light-background-two backdrop-blur-64 lg:bg-transparent px-6 lg:py-0 py-6">
                     <h2 className="text-white font-bold text-size-4 lg:text-head-4">Buy Coupons</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {
                           activeCoupons.map((coupon: any) => (
                              coupon.purchased === 0 &&
                              <div key={coupon._id} className="border-[2px] lg:border-[3px] border-white rounded-lg flex flex-col gap-2 lg:gap-4">
                                 <div className="flex flex-col text-white px-6 py-4 gap-1 lg:gap-3">
                                    <div className="font-semibold text-head-2 lg:text-head-4">{coupon.price} AED</div>
                                    <div className="font-semibold text-head-2 lg:text-head-4">{'**********'}</div>
                                    <div className="text-head-1 lg:text-head-3">{coupon.date}</div>
                                    <div className="flex items-center justify-between">
                                       <div className="text-head-2 font-light">Quantity</div>
                                       <div className="flex flex-row items-center bg-white rounded px-4">
                                          <div className="font-noto-sans-bold text-size-2 text-black cursor-pointer">
                                             <FontAwesomeIcon size="sm" data-operation="-" data-coupon-id={coupon._id} icon={faMinus} onClick={(e) => setCouponQuantity(e)} />
                                          </div>
                                          <div className="text-themeone text-head-2 text-center py-1 px-3 mx-3 border-r border-l border-gray-300">{coupon.quantity_to_select}</div>
                                          <div className="font-noto-sans-bold text-size-2 font- text-black cursor-pointer">
                                             <FontAwesomeIcon size="sm" data-operation="+" data-coupon-id={coupon._id} icon={faPlus} onClick={(e) => setCouponQuantity(e)} />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <button className="text-themetwo font-bold text-head-2 lg:text-head-4 text-center py-2 lg:py-3 bg-white" data-quantity={coupon.quantity_to_select} data-coupon-id={coupon._id} data-coupon-code={coupon.coupon_code} data-id={coupon._id} onClick={(e) => buyCoupon(e)}>Buy Now</button>
                              </div>
                           ))
                        }

                     </div>
                  </div>

                  <div className="flex flex-col gap-6 lg:gap-8 mt-6 bg-light-background-two backdrop-blur-64 lg:bg-transparent px-6 lg:py-0 py-6">
                     <h2 className="text-white font-bold text-size-4 lg:text-head-4">Already Purchased Coupons</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {
                           purchasedCoupons.map((coupon: any) => (
                              <div key={coupon._id} className="border-[2px] lg:border-[3px] border-white rounded-lg flex flex-col gap-2 lg:gap-4">
                                 <div className="flex flex-col text-white px-6 py-4 gap-1 lg:gap-3">
                                    <div className="font-semibold text-head-2 lg:text-head-4">{coupon.price} AED</div>
                                    <div className="font-semibold text-head-2 lg:text-head-4">{coupon.coupon_code}</div>
                                    <div className="text-head-1 lg:text-head-3">{coupon.date}</div>
                                    <div className="flex items-center justify-between">
                                       
                                    </div>
                                 </div>
                                 
                              </div>
                           ))
                        }

                     </div>
                  </div>

               </div>
            </>
         )}
         {/* option-2 pay via coupon ends */}

         { error !== '' && 
            <Notification message="Payment Error" description={error} type='error' close={() => {setError('')}}  />  
         }

         { success !== '' && 
            <Notification message="Payment Success" description={success} type='success' close={() => {setSuccess('')}} />  
         }
      </section>
   )
}

const App = () => (
   <Elements stripe={stripePromise}>
       <UserAccountAddCredit />
   </Elements>
);

export default App;
