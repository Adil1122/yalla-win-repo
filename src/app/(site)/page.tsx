"use client"

//import ProductGameCard from "@/components/product-with-game-card"
//import ProductPrizeCard from "@/components/product-with-prize-card"
//import ResultsSection from "@/components/results-section"
import UpcomingDrawCard from "@/components/upcoming-draw-card"
import WinnerCard from "@/components/winner-card"
import Link from "next/link"
import React, { lazy, Suspense, useEffect, useRef, useState } from "react"
import Swiper from "swiper"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import AccountCard from "@/components/account-card"
const ProductGameCard = lazy(() => import("@/components/product-with-game-card"));
const ProductPrizeCard = lazy(() => import("@/components/product-with-prize-card"));
const ResultsSection = lazy(() => import("@/components/results-section"));
import Modal from '@/components/modal'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

export default function Home() {

   const swiperMainRef = useRef(null)
   const swiperDrawRef = useRef(null)
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [animationFile, setAnimationFile] = useState<string>('')
   const [iframeSrc, setIframeSrc] = useState<string>('')

   const checkAnimationTime = (winner: any, game: string) => {
      
      if (game == '3') {
         const now = new Date()
         if (now.getHours() === 22 && now.getMinutes() === 0) {
            setAnimationFile(winner.animation_video)
         }
      } else if (game == '4') {
         const now = new Date()
         if (now.getHours() === 22 && now.getMinutes() === 5) {
            setAnimationFile(winner.animation_video)
         }
      } else if (game == '6') {
         const now = new Date()
         if (now.getHours() === 22 && now.getMinutes() === 10) {
            setAnimationFile(winner.animation_video)
         }
      }
   }

   useEffect(() => {
      if (modalIsOpen && animationFile && animationFile != '') {
         
         setIframeSrc(`https://drive.google.com/file/d/${animationFile}/preview`)
      }
   }, [modalIsOpen])

   useEffect(() => {

      if (animationFile) {

         setModalIsOpen(true)
      }
   }, [animationFile])

   const [section, setSection] = useState({
      //upcoming_draws: {},
      game_draws: [],
      prize_draws: [],
      game_winners: [],
      product_winners: [],
      products_with_game: [],
      products_with_prize: [],
      yalla_3_top_winner: [],
      yalla_4_top_winner: [],
      yalla_6_top_winner: [],
      home_page_banners: [],
      game_winners_today: [],
      todayWinners: 0,
      previousWinners: 0
    });

    var [start, setStart] = useState(0);

   useEffect(() => {

      if (swiperMainRef.current) {
         new Swiper(swiperMainRef.current, {
            modules: [Navigation, Pagination],
            spaceBetween: 10,
            navigation: {
               nextEl: ".swiper-button-next",
               prevEl: ".swiper-button-prev",
            },
            pagination: {
               el: ".swiper-pagination",
               clickable: true,
               bulletClass: 'swiper-pagination-bullet bg-pale-white',
               bulletActiveClass: 'swiper-pagination-bullet-active bg-white',
               renderBullet: (index, className) => {
                  return `<div class="${className} h-[10px] w-[10px] rounded-full cursor-pointer"></div>`
               },
            },
         })
      }
      
      if (swiperDrawRef.current) {
         new Swiper(swiperDrawRef.current, {
            modules: [Pagination],
            pagination: {
               el: ".swiper-pagination-draw",
               clickable: true,
               bulletClass: 'swiper-pagination-bullet bg-pale-white',
               bulletActiveClass: 'swiper-pagination-bullet-active bg-white',
               renderBullet: (index, className) => {
                  return `<div class="${className} h-[10px] w-[10px] rounded-full cursor-pointer"></div>`
               },
            },
         })
      }

      if(start === 0) {
         setStart(1);
         getSections();
      }
      
   }, [section.home_page_banners])

   const getSections = async () => {
      try {

         let search = localStorage.getItem('yalla_search') !== null ? localStorage.getItem('yalla_search') : '';
         let response = await fetch("api/website/home?search=" + search, {
            method: "GET",
            });
            const content = await response.json();
            //console.log(content)

            if(response.ok) {

               var productsWithGame: any = Array.from(content.products_with_game);
               var productsWithPrize: any = Array.from(content.products_with_prize);
                for(var i = 0; i < productsWithGame.length; i++) {
                  productsWithGame[i]['quantity_to_select'] = 1;
                }

                for(var i = 0; i < productsWithPrize.length; i++) {
                  productsWithPrize[i]['quantity_to_select'] = 1;
                }

                //console.log('productsWithPrize: ', productsWithPrize)

               setSection((prev) => {
                  return { ...prev, ...{
                     //upcoming_draws: Array.from(content.upcoming_draws),
                     game_draws: Array.from(content.game_draws),
                     prize_draws: Array.from(content.prize_draws),
                     game_winners: Array.from(content.game_winners),
                     product_winners: Array.from(content.product_winners),
                     products_with_game: productsWithGame,
                     products_with_prize: productsWithPrize,
                     yalla_3_top_winner: Array.from(content.yalla_3_top_winner),
                     yalla_4_top_winner: Array.from(content.yalla_4_top_winner),
                     yalla_6_top_winner: Array.from(content.yalla_6_top_winner),
                     todayWinners: content.todayWinners,
                     previousWinners: content.previousWinners,
                     home_page_banners: Array.from(content.home_page_banners),
                     game_winners_today: Array.from(content.game_winners_today)
                  } };
                });
                localStorage.setItem('yalla_search', '')

                const todayWinners = Array.from(content.game_winners_today)
                if (todayWinners.length) {

                  todayWinners.forEach((winner: any) => {
                     
                     if (winner && winner.winnersWithGames && winner.winnersWithGames.length && winner.winnersWithGames[0].name == 'Yalla 3') {
                        setInterval(() => {
                           checkAnimationTime(winner, '3')
                        }, 60000)
                     } else if (winner && winner.winnersWithGames && winner.winnersWithGames.length && winner.winnersWithGames[0].name == 'Yalla 4') {
                        setInterval(() => {
                           checkAnimationTime(winner, '4')
                        }, 60000)
                     } else if (winner && winner.winnersWithGames && winner.winnersWithGames.length && winner.winnersWithGames[0].name == 'Yalla 6') {
                        setInterval(() => {
                           checkAnimationTime(winner, '6')
                        }, 60000)
                     }
                  })
                }
            } else {
               localStorage.setItem('yalla_search', '')
            }
         
      } catch (error) {
         localStorage.setItem('yalla_search', '')
      }
   }

   const setGameProductQuantity = (e: any) => {
      var operation = e.currentTarget.getAttribute('data-operation');
      var product_id = e.currentTarget.getAttribute('data-product-id');

      var productsWithGame: any = section.products_with_game;
      
      for(var i = 0; i < productsWithGame.length; i++) {

         if(productsWithGame[i]._id === product_id) {
            if(operation == '+') {
               productsWithGame[i]['quantity_to_select']++;
            } else if(productsWithGame[i]['quantity_to_select'] > 1){
               productsWithGame[i]['quantity_to_select']--;
            }
         }
      }
      setSection((prev) => {
         return { ...prev, ...{products_with_game: productsWithGame} };
       });
   }

   const setPrizeProductQuantity = (e: any) => {
      var operation = e.currentTarget.getAttribute('data-operation');
      var product_id = e.currentTarget.getAttribute('data-product-id');

      var productsWithPrize: any = section.products_with_prize;
      
      for(var i = 0; i < productsWithPrize.length; i++) {

         if(productsWithPrize[i]._id === product_id) {
            if(operation == '+') {
               productsWithPrize[i]['quantity_to_select']++;
            } else if(productsWithPrize[i]['quantity_to_select'] > 1){
               productsWithPrize[i]['quantity_to_select']--;
            }
         }
      }
      setSection((prev) => {
         return { ...prev, ...{products_with_prize: productsWithPrize} };
       });
   }

   return (
      <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo pb-12 overflow-x-hidden">
         <section className="w-full lg:h-[60px] lg-mid:h-[90px] lg:px-4 lg-mid:px-16 py-1 bg-white/50 backdrop-blur-3xl hidden lg:flex items-center justify-center">
            <div className="uppercase lg:text-[1.8rem] xl:text-[2.2rem] 2xl:text-[2.5rem] text-themeone marquee font-bold tracking-widest -mt-1 whitespace-nowrap">
               Buy our products and get a chance to win big everyday
            </div>
         </section>
         
         <section className="flex flex-col lg:flex-row gap-12 lg:gap-10 py-6 lg:py-16">
            <div className="flex flex-col gap-6 lg:gap-12 px-8 lg:pl-16 lg:w-[63%]">
               <div className="relative">
                  <div ref={swiperMainRef} className="swiper-custom">
                     <div className="swiper-wrapper">
                     { 
                        section.home_page_banners.map((banner: any) => (
                        <div className="swiper-slide" key={banner._id}>
                           <div className={`relative h-[320px] lg:h-[500px] bg-center bg-cover bg-no-repeat rounded-3xl lg:rounded-standard`} style={{backgroundImage: `url(${banner.file_url})`}}></div>
                        </div>
                        ))
                     }
                     </div>
                     <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 z-20">
                        <div className="flex items-center justify-center rounded-full h-[35px] w-[35px] cursor-pointer swiper-button-prev">
                           <img src="/assets/images/back-icon.svg" />
                        </div>   
                        <div className="flex items-center justify-center rounded-full h-[35px] w-[35px] cursor-pointer swiper-button-next">
                           <img src="/assets/images/next-icon.svg" />
                        </div> 
                     </div>
                  </div>
               </div>
               <div className="flex gap-2 mx-auto swiper-pagination"></div>
            </div>
            <div className="flex flex-col gap-6 lg:gap-12 lg:pr-16 lg:w-[35%]">
               {
                  (section.game_draws.length > 0 && section.prize_draws.length > 0) &&
                  <UpcomingDrawCard game_draws={section.game_draws} prize_draws={section.prize_draws} />
               }
            </div>
         </section>

         <ResultsSection yalla_3_top_winner={section.yalla_3_top_winner} yalla_4_top_winner={section.yalla_4_top_winner} yalla_6_top_winner={section.yalla_6_top_winner} game_winners={section.game_winners} product_winners={section.product_winners} />
         
         <section className="flex flex-col mb-6 mt-12 lg:my-12 gap-12">
            <h2 className="font-noto-sans-black text-center uppercase text-white text-big-five lg:text-large-head">Lets get you started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative py-8 lg:py-20 px-8 lg:px-24 bg-light-background backdrop-blur-64 gap-6 lg:gap-12">
               <AccountCard title="How to enter and win" subTitle="Start dreaming with us and win prizes" iconImage="/assets/images/trophy.svg" detailsLink="/accounts/how-to-enter-and-win" />
               <AccountCard title="How to shop" subTitle="Fill your carts and make your dreams come true" iconImage="/assets/images/shopping-cart-boxes.svg" detailsLink="/accounts/how-to-shop" />
               <AccountCard title="How to add credit" subTitle="Top up your account and make your life easy" iconImage="/assets/images/pencil.svg" detailsLink="/accounts/how-to-add-credit" />
               <AccountCard title="How to withdraw" subTitle="Congrutations! Learn how to withdraw" iconImage="/assets/images/withdraw.svg" detailsLink="/accounts/how-to-withdraw" />
               <img className="absolute -top-[2%] lg:top-[10%] left-[2%]" src="/assets/images/star.svg" alt="" />
               <img className="absolute top-[0%] left-[40%]" src="/assets/images/star.svg" alt="" />
               <img className="absolute top-[0%] left-[60%]" src="/assets/images/star.svg" alt="" />
               <img className="absolute bottom-[1%] left-[50%]" src="/assets/images/star.svg" alt="" />
               <img className="absolute top-[30%] right-[2%]" src="/assets/images/star.svg" alt="" />
               <img className="absolute -top-[2%] left-[25%]" src="/assets/images/crooked-star.svg" alt="" />
            </div>
         </section>
         { section.products_with_game.length > 0 && (
            <section className="flex flex-col m-0 lg:my-12 gap-6 lg:gap-12">
               <h2 className="font-noto-sans-black text-center uppercase text-white text-big-five lg:text-large-head">Buy products with free raffle games</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative py-8 lg:py-20 px-8 lg:px-24 bg-light-background backdrop-blur-64 gap-8 lg:gap-12">
               <Suspense>   
                  { 
                     section.products_with_game.map((product: any) => (
                        product.productWithGame.length > 0 && (
                           <ProductGameCard key={product._id + product.productWithGame[0]._id} productId={product._id} name={product.name} gameName={ product.productWithGame[0].name } price={'AED ' + product.price} vat={product.vat} buyLink={"/buy/product/game/" + product._id} productImageLink={product.image} quantity={product.quantity_to_select} setGameProductQuantity={setGameProductQuantity} />
                        )
                     ))
                  }
               </Suspense>
               </div>
            </section>
         )}
         
         { section.products_with_prize.length > 0 && (
            <section className="flex flex-col my-6 gap-6 lg:gap-12">
               <h2 className="font-noto-sans-black text-center uppercase text-white text-big-five lg:text-large-head">Buy products with free mega prize</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-2 relative py-8 lg:py-20 px-8 lg:px-24 gap-8 lg:gap-12 bg-light-background backdrop-blur-64">
               <Suspense> 
                  { 
                     section.products_with_prize.map((product: any) => (
                        product.productWithPrize.length > 0 && (
                           <ProductPrizeCard key={product._id + product.productWithPrize[0]._id} name={product.name} prizeName={product.productWithPrize.name} price={'AED' + product.price} vat={product.vat} detailLink={"/product/" + product._id} checkoutLink={"/buy/product/prize/" + product._id} productImageLink={product.image} prizeImageLink={product.productWithPrize[0].image} productId={product._id} quantity={product.quantity_to_select} setPrizeProductQuantity={setPrizeProductQuantity}/>
                        )
                     ))
                  }
               </Suspense>
               </div>
            </section>
         )}

         { (section.game_winners.length > 0 || section.product_winners.length > 0) && (
            <section className="flex flex-col mt-0 mb-6 lg:my-12 gap-6 lg:gap-12">
               <h2 className="font-noto-sans-black text-center uppercase text-white text-big-five lg:text-large-head">Latest Winners</h2>
               <div className="flex flex-col items-center bg-light-background backdrop-blur-64 pb-8 lg:py-12">
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 relative py-8 lg:py-12 px-8 lg:px-36 gap-8 lg:gap-12 w-full">
                     
                        { 
                        section.game_winners.map((winner: any) => (
                           winner.winnersWithUsers.length > 0 && winner.winnersWithGames.length > 0 && winner.winnersWithTickets.length > 0 && (
                                 <WinnerCard key={winner._id + winner.winnersWithUsers[0]._id} name={winner.winnersWithUsers[0].first_name + ' ' + winner.winnersWithUsers[0].last_name} prizeAmount={winner.prize_amount} ticketNumber={winner.winnersWithTickets[0].ticket_number} date={winner.winning_date} href="" type="game_winner" prizeName="" winnerImage={winner.winnersWithUsers[0].image} />
                              )
                           ))
                        }

                        { 
                        section.product_winners.map((winner: any) => (
                           winner.winnersWithUsers.length > 0 && winner.winnersWithPrizes.length > 0 && (
                                 <WinnerCard key={winner._id + winner.winnersWithUsers[0]._id} name={winner.winnersWithUsers[0].first_name + ' ' + winner.winnersWithUsers[0].last_name} prizeAmount={winner.prize_amount} ticketNumber="" date={winner.winning_date} href="" type="product_winner" prizeName={winner.winnersWithPrizes[0].name} winnerImage={winner.winnersWithUsers[0].image} />
                              )
                           ))
                        }
                     
                     
                  </div>
                  <Link href="/winners" className="capitalize text-themeone font-medium bg-white rounded-full text-head-3 text-center w-fit px-12 py-3">View all</Link>
               </div>
            </section>
         )}

         <section className="flex flex-col my-12 gap-8 lg:gap-12 relative">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 relative bg-light-background backdrop-blur-64 py-8 lg:py-16 px-8 lg:px-24 gap-12 lg:gap-24 xl:gap-36 2xl:gap-48 w-full">
               <div className="flex flex-col items-center justify-center bg-white rounded-standard py-8">
                  <div className="mb-6">
                     <img src="/assets/images/trophy-filled-icon.svg" alt="" />
                  </div>
                  <div className="text-themeone font-medium text-head-8">{section.todayWinners}</div>
                  <button className="capitalize underline text-darkone text-size-4">Today Winners</button>
               </div>
               <div className="flex flex-col items-center justify-center bg-white rounded-standard py-8">
                  <div className="mb-6">
                     <img src="/assets/images/faq-icon.svg" alt="" />
                  </div>
                  <div className="text-themeone font-medium text-head-8">FAQs</div>
                  <Link href="/faqs" className="capitalize underline text-darkone text-size-4">Read more</Link>
               </div>
               <div className="flex flex-col items-center justify-center bg-white rounded-standard py-8">
                  <div className="mb-6">
                     <img src="/assets/images/trophy-filled-icon.svg" alt="" />
                  </div>
                  <div className="text-themeone font-medium text-head-8">{section.previousWinners}</div>
                  <button className="capitalize underline text-darkone text-size-4">Previous results</button>
               </div>
            </div>
            <img className="absolute top-[10%] left-[2%]" src="/assets/images/star.svg" alt="" />
            <img className="absolute top-[0%] left-[30%]" src="/assets/images/star.svg" alt="" />
            <img className="absolute -bottom-[8%] left-[60%]" src="/assets/images/star.svg" alt="" />
            <img className="absolute top-[30%] right-[2%]" src="/assets/images/star.svg" alt="" />
         </section>

         {modalIsOpen && (
            <Modal open={true} onClose={() => setModalIsOpen(false)}>
               <div className="flex flex-col justify-center gap-12 px-12 w-full lg:min-w-[800px] h-[700px]">
                  <div className="flex items-center justify-between w-full">
                     <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] ml-auto rounded-full flex items-center justify-center">
                        <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                     </div>
                  </div>
                  <div className="flex flex-col gap-6 h-full flex-grow bg-black">
                     <iframe width="100%" height="100%" frameBorder="0" allow="autoplay" title="Video" className="w-full h-full" src={iframeSrc}></iframe>
                  </div>
               </div>
            </Modal>
         )}
      </div>
   )
}
