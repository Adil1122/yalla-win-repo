'use client';
import VideoCard from '@/components/VideoCard'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function RulesPricesPage() {

   var [yalla_3_product_id, setYalla3ProductId] = useState("");
   var [yalla_4_product_id, setYalla4ProductId] = useState("");
   var [yalla_6_product_id, setYalla6ProductId] = useState("");

   useEffect(() => {
      getGameProductIds();
   }, []);

   const getGameProductIds = async() => {
      try {
         let response = await fetch("api/website/rules-and-prices", {
            method: "GET",
         });
         const content = await response.json();
         console.log(content)
         if(!response.ok) {

         } else {
            setYalla3ProductId(content.yalla_3_product_id);
            setYalla4ProductId(content.yalla_4_product_id);
            setYalla6ProductId(content.yalla_6_product_id);
         }
      } catch (error) {
         
      }
   }

   return (
      <section className="flex flex-col flex-grow px-8 lg:px-16 py-8 lg:py-16 gap-4 lg:gap-8 h-full w-full bg-gradient-to-r from-themeone to-themetwo text-white">
         <h1 className="text-head-4 lg:text-large-head font-bold uppercase lg:text-center mb-12">Rules And Prices</h1>
         <div className="flex flex-col gap-12 leading-extra-loose">
            <section className="flex flex-col gap-4">
               <h2 className="text-head-4 lg:text-big-one font-bold">How to Enter & Win</h2>
               <div className="flex flex-col">
                  <div className="text-size-1 lg:text-size-2 line-height-extra-loose">
                     <p>
                        Select the quantity of Product you want to purchase and continue your steps.Each Product adds one line in dreamdraw and increase your chance to win. 
                     </p>
                     <p>
                        Pick Any 5 numbers in the sequence of your choice per line.
                     </p>
                     <p>
                        Numbers range from 1 - 50 . You can enter multiple lines at a time
                     </p>
                     <p>
                        You can use RANDOM PICK to allow the system to select sequence for you
                     </p>
                     <p>
                        Select the type of draw & click NEXT:
                     </p>
                     <p>
                        CURRENT DRAW Allows you to enter for the immediate and upcoming draw
                     </p>
                     <p>
                        MULTIPlE UPCOMING DRAWS : Allow you to enter your selected line
                     </p>
                     <p>
                        If a sequence is unavailable, you can click CHANGE NUMBERS to use a another number sequence. Alternatively allow the system to select for you by clicking QUICK PICK
                     </p>
                     <p>
                        Once your line numbers are available, the payment options will show. You can either pay using your credit balance or using your payment card
                     </p>
                     <p>
                        A confirmation email will be sent to you for the purchase and to confirm your entry into the draw
                     </p>
                     <p>
                        Watch our live show
                     </p>
                     <p>
                        If you’re lucky enough to win, we will immediately credit any winnings to your Winning Wallet. Good luck!
                     </p>
                  </div>
               </div>
            </section>
            <section className="flex flex-col">
               <h2 className="text-white text-head-4 lg:text-large-head font-bold uppercase lg:text-center mb-12">Rules and prizes for free raffle games</h2>
               <div className="text-size-1 lg:text-size-2">
                  
                  <div className="flex flex-col lg:flex-row gap-12 lg:mt-6">
                     <div className="flex flex-col gap-4 lg:gap-8">
                        <h2 className="text-head-4 lg:text-big-one font-bold">Yalla 3:</h2>
                        <div className="flex flex-col gap-4">
                           <div>
                              <h3 className="font-bold text-size-4">Product Description:</h3>
                              <div className="">Product Name: THRILL 3</div>
                              <div>Product Prize: 5 AED</div>
                           </div>
                           <Link href={`/buy/product/game/${yalla_3_product_id}`} className="bg-white w-fit text-themeone rounded font-medium py-1 lg:py-2 px-4 text-center">Buy Now</Link>
                           <div className="w-full xl:max-w-[70%] mt-6">
                              <img src="/assets/images/yalla-3-banner.svg" alt="" />
                           </div>
                        </div>
                        <div>
                           <h3 className="font-bold text-size-4">Introduction:</h3>
                           <div>
                              THRILL 3 is an exciting and engaging numerical game that offers participants a chance to win exciting prizes by selecting 
                              three numbers from 0 to 9 and predicting the outcome of a draw. With three different play options - OPTION STRAIGHT, OPTION 
                              RUMBLE, and OPTION CHANCE - p articipants have multiple ways to increase their chances of winning. The game is easy to play 
                              and provides a thrilling experience for those seeking some fun and excitement.
                           </div>
                        </div>
                     </div>
                  </div>
                  <h3 className="font-bold text-size-4 mt-8 mb-4">How to participate:</h3>
                  <div className="flex flex-col">
                     <p>Participating in THIRILL 3 is straightforward. Here are the steps to get started</p>
                     <ul className="list-disc ml-8">
                        <li>
                           <span className="font-bold">Buy the dream draw product:</span>
                           <span> Westbad and get a free ticker and try your luck</span>
                           <img className="shadow-custom my-6" src="/assets/images/band.svg" alt="" />
                        </li>
                        <li>
                           <span className="font-bold">Pick 3 numbers from 0 to 9:</span>
                           <span>Select any three numbers from the available range of 0 to 9. These numbers will be your chosen combination for the game</span>
                        </li>
                        <li>
                           <span className="font-bold">Select your option:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>
                                    <span>OPTION STRAIGHT:</span>
                                    <span> In this option, you win if your three selected numbers are drawn in the exact order</span>
                                 </li>
                                 <li>
                                    <span>OPTION RUNBLE:</span>
                                    <span> You win in this option if your three selected numbers are drawn in any order</span>
                                 </li>
                                 <li>
                                    <span>OPTION CHANCE:</span>
                                    <span> This option allows you to win if your three numbers are drawn in the exact order from right to left, but it also offers additional chances to win with partial matches.</span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                     </ul>
                     <p>Example of Number Picked: Lets say you have picked the numbers 3-8-7.</p>
                  </div>
                  <h3 className="font-bold text-size-4 mt-8 mb-4">Options and Prizes:</h3>
                  <div>
                     <ul className="list-disc ml-8">
                        <li>
                           <span className="font-bold">OPTION STRAIGHT:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>You win if your three numbers (3-8-7) are drawn in the exact order.</li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>Your Product Price 5 AED multiplied by 700.</span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Example: </span>
                                    <span>5 x 700 = AED 3500 for 3 correct numbers (3-8-7)</span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">OPTION RUMBEL:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>You win if your three numbers (3-8-7) are drawn in any order</li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>5 X 200 times your Product Prize</span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Example: </span>
                                    <span>3-8-7 / 3-7-8 / 7-8-3 all win</span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Prize Calculation: </span>
                                    <span>5 AED X 200 = 1000</span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">OPTION CHANCE:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>You win if your three numbers (3-8-7) are drawn in the exact order from right to left</li>
                                 <li>Additional chances to win with partial matches</li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>5 AED X 400 times your Product Prize for 3 correct numbers (3-8-7)</span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>5 AED X 30 times your Product Prize for 2 correct numbers (e.g., X-8-7)</span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>5 AED X 2 times your Product Prize for 1 correct number (e.g., X-X-7)</span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">Example:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>3-8-7 wins AED 2000 (3 correct numbers)</li>
                                 <li>X-8-7wins AED 150 (2 correct numbers)</li>
                                 <li>X-X-7 wins AED 10 (1 correct number)</li>
                              </ul>
                           </span>
                        </li>
                     </ul>
                  </div>
                  <p className="mt-4">The game provides an exciting and flexible way to test your luck and potentially win big prizes. So, pick your numbers, choose your option, and join in the THRILL fun!</p>
               </div>   
               <div className="text-size-1 lg:text-size-2 mt-8">
                  <div className="flex flex-col lg:flex-row gap-12 lg:mt-6">
                     <div className="flex flex-col gap-4 lg:gap-8">
                        <h2 className="text-head-4 lg:text-big-one font-bold">Yalla 4:</h2>
                        <div>
                           <h3 className="font-bold text-size-4">Product Description:</h3>
                           <div className="">Product Name: MEGA 4</div>
                           <div className="">Pick 4 numbers from 0 to 9</div>
                           <div>Product Prize: 5 AED</div>
                        </div>
                        <Link href={`/buy/product/game/${yalla_4_product_id}`} className="bg-white w-fit text-themeone rounded font-medium py-1 lg:py-2 px-4 text-center">Buy Now</Link>
                        <div className="w-full xl:max-w-[70%] mt-6">
                           <img src="/assets/images/yalla-4-banner.svg" alt="" />
                        </div>
                        <div>
                           <h3 className="font-bold text-size-4">Introduction:</h3>
                           <div>
                              MEGA 4 is an exciting numerical game that offers participants the chance to win thrilling prizes by selecting four numbers 
                              from the range of 0 to 9. With three different play options - OPTION STRAIGHT, OPTION RUMBLE, and OPTION CHANCE - 
                              participants have multiple ways to win and increase their excitement. The game is designed to provide a fun and engaging 
                              experience for those seeking entertainment and the possibility of winning attractive prizes.
                           </div>
                        </div>
                     </div>
                  </div>
                  <h3 className="font-bold text-size-4 mt-8 mb-4">How to participate:</h3>
                  <div className="flex flex-col">
                     <p>Participating in THIRILL 3 is straightforward. Here are the steps to get started</p>
                     <ul className="list-disc ml-8">
                        <li>
                           <span className="font-bold">Buy the dream draw product:</span>
                           <span> KEYCHAIN and get a free ticket and try your luck.</span>
                           <img className="max-h-[250px] my-3" src="/assets/images/keychain.svg" alt="" />
                        </li>
                        <li>
                           <span className="font-bold">Pick 4 numbers from 0 to 9:</span>
                           <span>Choose any four numbers from the available range of 0 to 9. These numbers will constitute your selected combination for the game.</span>
                        </li>
                        <li>
                           <span className="font-bold">Select your option:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>
                                    <span>OPTION STRAIGHT:</span>
                                    <span>In this option, you win if your three selected numbers are drawn in the exact order</span>
                                 </li>
                                 <li>
                                    <span>OPTION RUNBLE:</span>
                                    <span>You win in this option if your three selected numbers are drawn in any order</span>
                                 </li>
                                 <li>
                                    <span>OPTION CHANCE:</span>
                                    <span>This option allows you to win if your three numbers are drawn in the exact order from right to left, but it also offers additional chances to win with partial matches.</span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                     </ul>
                     <p className="font-bold">Example of Number Picked:</p>
                     <ul className="list-disc ml-8">
                        <li>For instance if you pick the numbers 1-0-9-6</li>
                     </ul>
                  </div>
                  <h3 className="font-bold text-size-4 mt-8 mb-4">Options and Prizes:</h3>
                  <div>
                     <ul className="list-disc ml-8">
                        <li>
                           <span className="font-bold">OPTION STRAIGHT:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>Win if your four numbers (1-0-9-6) are drawn in the exact order.</li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>Your Product Price multiplied by X 7000</span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Example: </span>
                                    <span>5 (Product Prize) x 7000 = AED 35,000 for 4 correct numbers (1-0-9-6).</span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">OPTION CHANCE:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>Win with various combinations:</li>
                                 <li>5 X 2,000 for 4 correct numbers (1-0-9-6)</li>
                                 <li>5 X 200 for 3 correct numbers (1-0-9-6)</li>
                                 <li>5 X 20 for 2 correct numbers (1-0-9-6)</li>
                                 <li>5 X+ for 1 correct number (1-0-9-6)</li>
                                 <li>
                                    <span className="font-bold">Example: </span>
                                    <span>
                                       <ul className="list-disc ml-8">
                                          <li>4 correct numbers (1-0-9-6) win AED 10,000.</li>
                                          <li>3 correct numbers (X-0-9-6) win AED 1000.</li>
                                          <li>2 correct numbers (X-X-9-6) win AED 100</li>
                                          <li>1 correct number (X-X-X-6) win AED 10</li>
                                       </ul>
                                    </span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                        <li>Terms and Conditions (T&C) Apply. All rights reserved by Dream Draw LLC FZ.</li>
                        <li>The game promises an exhilarating experience with the chance of winning attractive prizes. So, pick your numbers, choose your option, and enjoy the MEGA 4 adventure!</li>
                     </ul>
                  </div>
                  <p className="mt-4">The game provides an exciting and flexible way to test your luck and potentially win big prizes. So, pick your numbers, choose your option, and join in the THRILL fun!</p>
               </div>   
               <div className="text-size-1 lg:text-size-2 mt-8">
                  <h2 className="text-head-4 lg:text-big-one font-bold">Yalla 6:</h2>
                  <div className="flex flex-col lg:flex-row gap-12 lg:mt-6">
                     <div className="flex flex-col gap-4 lg:gap-8">
                        <div className="flex flex-col gap-3">
                           <div>
                              <h3 className="font-bold text-size-4">Product Description:</h3>
                              <div className="">Product Name: Royal 6</div>
                              <div className="">Pick 6 numbers from 1 to 25</div>
                              <div>Product Prize: 5 AED</div>
                           </div>
                           <Link href={`/buy/product/game/${yalla_6_product_id}`} className="w-fit bg-white text-themeone rounded font-medium py-1 lg:py-2 px-4 text-center">Buy Now</Link>
                           <img className="w-full xl:w-[70%] mt-6" src="/assets/images/yalla-6-banner.svg" alt="" />
                        </div>
                        <div>
                           <h3 className="font-bold text-size-4">Introduction:</h3>
                           <div>
                              ROYAL 6 is an exciting game that gives participants the chance to win substantial prizes by selecting six numbers from 
                              the range of 1 to 25. With the opportunity to win big, ROYAL 6 offers a thrilling experience for those seeking excitement 
                              and the possibility of a significant cash prize.  
                           </div>
                        </div>
                     </div>
                  </div>
                  <h3 className="font-bold text-size-4 mt-8 mb-4">How to participate:</h3>
                  <div className="flex flex-col">
                     <ul className="list-disc ml-8">
                        <li>
                           <div>Buy the dream draw product: PENCIL and get a free ticket and try your luck</div>
                           <img className="shadow-custom my-3" src="/assets/images/pencill.svg" alt="" />
                        </li>
                        <li>Pick 6 Numbers from 1 to 25: Choose any six numbers from the range of 1 to 25 to create your unique combination.</li>
                        <li>
                           <span className="font-bold">Entry Prize: </span>
                           <span>Every participant is eligible for an entry prize of AED 5</span>
                        </li>
                        <li>
                           <span className="font-bold">Winning Criteria: </span>
                           <span>Win bigger if three or more of your selected numbers match the results in any order</span>
                        </li>
                        <li>
                           <span className="font-bold">Top Prize Sharing: </span>
                           <span>In the event of more than one winner with the top prize on six numbers, the prize will be shared equally among all the winners.</span>
                        </li>
                     </ul>
                  </div>
                  <h3 className="font-bold text-size-4 mt-8 mb-4">Prizes:</h3>
                  <div className="flex flex-col">
                     <ul className="list-disc ml-8">
                        <li>
                           <span className="font-bold">6 Correct Numbers:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>Example:If your Entry Prize is AED 5, the prize would be AED 5 x 100,000 = AED 500,000</li>
                                 <li>Prize: Your Entry Prize multiplied by X 100,000</li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">5 Correct Numbers:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>Example:If your Entry Prize is AED 5, the new prize would be AED 5 x 500 = AED 2500</li>
                                 <li>Prize: Your Entry Prize multiplied by X 500</li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">4 Correct Numbers:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>Example: If your Entry Prize is AED 5, the prize would be AED 5 x 20 = AED 100</li>
                                 <li>Prize: Your Entry Prize multiplied by X 20.</li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">3 Correct Numbers:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>Example: If your Entry Prize is AED 5, the prize would be AED 5 x 2 = AED 10</li>
                                 <li>Prize: Your Entry Prize multiplied by X 2</li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">Terms and Conditions (T&C):</span>
                        </li>
                        <li>T&C Apply. All rights reserved by Dream Draw LLC FZ.</li>
                     </ul>
                  </div>
               </div>   
            </section>
            <section className="flex flex-col">
               <h2 className="text-white text-head-4 lg:text-large-head font-bold uppercase lg:text-center mb-12">Rules and prizes for free raffle mega prize</h2>  
               <div className="text-size-1 lg:text-size-2 mt-8">
                  <h2 className="text-head-4 lg:text-big-one font-bold">Mega Prize:</h2>
                  <div className="flex flex-col lg:flex-row gap-12 lg:mt-6">
                     <div className="flex flex-col gap-4 lg:gap-8">
                        <div>
                           <h3 className="font-bold text-size-4">Product Description:</h3>
                           <div className="">Product Name: THRILL 3</div>
                           <div>Product Prize: 5 AED</div>
                        </div>
                        <div>
                           <h3 className="font-bold text-size-4">Introduction:</h3>
                           <div>
                              THRILL 3 is an exciting and engaging numerical game that offers participants a chance to win exciting prizes by selecting three numbers from 0 to 9 and predicting the outcome of a draw. With three different play options - OPTION STRAIGHT, OPTION RUMBLE, and OPTION CHANCE - p articipants have multiple ways to increase their chances of winning. The game is easy to play and provides a thrilling experience for those seeking some fun and excitement.
                           </div>
                        </div>
                     </div>
                  </div>
                  <h3 className="font-bold text-size-4 mt-8 mb-4">How to participate:</h3>
                  <div className="flex flex-col">
                     <p>Participating in THIRILL 3 is straightforward. Here are the steps to get started</p>
                     <ul className="list-disc ml-8">
                        <li>
                           <span className="font-bold">Buy the dream draw product:</span>
                           <span>KEYCHAIN and get a free ticket and try your luck.</span>
                        </li>
                        <li>
                           <span className="font-bold">Pick 3 numbers from 0 to 9:</span>
                           <span>Choose any three numbers from the available range of 0 to 9. These numbers will constitute your selected combination for the game.</span>
                        </li>
                        <li>
                           <span className="font-bold">Select your option:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>
                                    <span>OPTION STRAIGHT:</span>
                                    <span>In this option, you win if your three selected numbers are drawn in the exact order</span>
                                 </li>
                                 <li>
                                    <span>OPTION RUNBLE:</span>
                                    <span>You win in this option if your three selected numbers are drawn in any order</span>
                                 </li>
                                 <li>
                                    <span>OPTION CHANCE:</span>
                                    <span>This option allows you to win if your three numbers are drawn in the exact order from right to left, but it also offers additional chances to win with partial matches.</span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                     </ul>
                     <p>Example of Number Picked: Lets say you have picked the numbers 1-0-9-6.</p>
                  </div>
                  <h3 className="font-bold text-size-4 mt-8 mb-4">Options and Prizes:</h3>
                  <div>
                     <ul className="list-disc ml-8">
                        <li>
                           <span className="font-bold">OPTION STRAIGHT:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>You win if your three numbers (3-8-7) are drawn in the exact order.</li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>Your Product Price is multiplied by X 700</span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Example: </span>
                                    <span>5 (Product Prize) x 700 = AED 3500 for three correct numbers (3-8-7)</span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">OPTION RUMBLE:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>You win if your three numbers (3-8-7) are drawn in any order.</li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>Your Product Price is multiplied by X 200</span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Example: </span>
                                    <span>(3-8-7) / (3-7-8) / (7-8-3) all win</span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Price Calculation: </span>
                                    <span>5 AED x 200 = 1000 AED</span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">OPTION CHANCE:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>You win if your three numbers (3-8-7) are drawn in the exact order from right to left</li>
                                 <li>Additional chances to win with partial matches</li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>
                                       5 x 400 times your product price for three correct numbers (3-8-7)
                                    </span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>
                                       5 x 30 times your product price for two correct numbers e.g (X-8-7)
                                    </span>
                                 </li>
                                 <li>
                                    <span className="font-bold">Prize: </span>
                                    <span>
                                       5 x 2 times your product price for one correct numbers e.g (X-X-7)
                                    </span>
                                 </li>
                              </ul>
                           </span>
                        </li>
                        <li>
                           <span className="font-bold">Example:</span>
                           <span>
                              <ul className="list-disc ml-8">
                                 <li>3-8-7 wins AED 2000 (3 correct numbers)</li>
                                 <li>X-8-7 wins AED 150 (2 correct numbers)</li>
                                 <li>X-X-7 wins AED 10 (1 correct numbers)</li>
                                 <li>Additional chances to win with partial matches</li>
                              </ul>
                           </span>
                        </li>
                     </ul>
                  </div>
                  <p className="mt-4">The game provides an exciting and flexible way to test your luck and potentially win big prizes. So, pick your numbers, choose your option, and join in the THRILL fun!</p>
               </div>     
            </section>
         </div>
      </section>
   )
}
