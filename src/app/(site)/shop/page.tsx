'use client'

import ResultsSection from "@/components/results-section"
import Link from "next/link"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useEffect, useState, lazy, Suspense } from "react"
import MultiRangeSlider from '@/components/multi-range-slider';
const ProductGameCard = lazy(() => import("@/components/product-with-game-card"));
const ProductPrizeCard = lazy(() => import("@/components/product-with-prize-card"));

export default function ShopPage() {


   const [section, setSection] = useState({
      game_winners: [],
      product_winners: [],
      products_with_game: [],
      products_with_prize: [],
      yalla_3_top_winner: [],
      yalla_4_top_winner: [],
      prize_draw_ids: [],
      game_draw_ids: [],
      yalla_6_top_winner: []
    });

    var [game_sort_text, setGameSortText] = useState('Best Selling');
    var [prize_sort_text, setPrizeSortText] = useState('Best Selling');

    var game_min_max = {
      min: 0, 
      max: 500
    }

    var prize_min_max = {
      min: 0, 
      max: 500
    }

    function setGameMinMax(min_max: any) {
      game_min_max = min_max;
      //console.log(game_sort_text)
    }

    function setPrizeMinMax(min_max: any) {
      prize_min_max = min_max;
    }



    var game_sort = {
      sort_by: "sold",
      sort_order: -1
    };

    var prize_sort = {
      sort_by: "sold",
      sort_order: -1
    };

    const [category, setCategory] = useState('all');

    function setProductCategory(type: any) {
      setCategory(type);
    }

    function setGameSortAndApplyFilters(sort: any, sort_text: any) {
      game_sort = sort;
      setGameSortText(sort_text)
      applyGameFilters();
    }

    function setPrizeSortAndApplyFilters(sort: any, sort_text: any) {
      prize_sort = sort;
      setPrizeSortText(sort_text)
      applyPrizeFilters();
    }

    async function applyGameFilters() {
      console.log(game_sort)
      try {

         let response = await fetch("api/website/shop/game-products?min_price=" + game_min_max.min + "&max_price=" + game_min_max.max + "&sort_by=" + game_sort.sort_by + "&sort_order=" + game_sort.sort_order, {
            method: "GET",
            });
            const content = await response.json();
            console.log(content)

            if(response.ok) {

               var productsWithGame: any = Array.from(content.products_with_game);
                for(var i = 0; i < productsWithGame.length; i++) {
                  productsWithGame[i]['quantity_to_select'] = 1;
                }

               setSection((prev) => {
                  return { ...prev, ...{
                     products_with_game: productsWithGame
                  } };
                });
            } else {

            }
         
      } catch (error) {
         
      }

    }

    async function applyPrizeFilters() {
      
      try {

         let response = await fetch("api/website/shop/prize-products?min_price=" + prize_min_max.min + "&max_price=" + prize_min_max.max + "&sort_by=" + prize_sort.sort_by + "&sort_order=" + prize_sort.sort_order, {
            method: "GET",
            });
            const content = await response.json();
            console.log(content)

            if(response.ok) {
               var productsWithPrize: any = Array.from(content.products_with_prize);
                for(var i = 0; i < productsWithPrize.length; i++) {
                  productsWithPrize[i]['quantity_to_select'] = 1;
                }

               setSection((prev) => {
                  return { ...prev, ...{
                     products_with_prize: productsWithPrize
                  } };
                });
            } else {

            }
         
      } catch (error) {
         
      }
    }

   const shopAllProducts = async () => {
      try {

         let response = await fetch("api/website/shop", {
            method: "GET",
            });
            const content = await response.json();
            console.log(content)

            if(response.ok) {

               var productsWithGame: any = Array.from(content.products_with_game);
               var productsWithPrize: any = Array.from(content.products_with_prize);
                for(var i = 0; i < productsWithGame.length; i++) {
                  productsWithGame[i]['quantity_to_select'] = 1;
                }

                for(var i = 0; i < productsWithPrize.length; i++) {
                  productsWithPrize[i]['quantity_to_select'] = 1;
                }

                var game_draws_object: any = Array.from(content.game_draws)
                var prize_draws_object: any = Array.from(content.prize_draws)
                var game_draw_ids: any = []
                var prize_draw_ids: any = []
                for(var i = 0; i < game_draws_object.length; i++) {
                  game_draw_ids.push(game_draws_object[i].product_id)
                }

                for(var i = 0; i < prize_draws_object.length; i++) {
                  prize_draw_ids.push(prize_draws_object[i].product_id)
                }

               setSection((prev) => {
                  return { ...prev, ...{
                     game_winners: Array.from(content.game_winners),
                     product_winners: Array.from(content.product_winners),
                     products_with_game: productsWithGame,
                     products_with_prize: productsWithPrize,
                     yalla_3_top_winner: Array.from(content.yalla_3_top_winner),
                     yalla_4_top_winner: Array.from(content.yalla_4_top_winner),
                     yalla_6_top_winner: Array.from(content.yalla_6_top_winner),
                     game_draw_ids: Array.from(game_draw_ids),
                     prize_draw_ids: Array.from(prize_draw_ids)
                  } };
                });
            } else {

            }
         
      } catch (error) {
         
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

   useEffect(() => {
      shopAllProducts()
   }, [])


   return (
      <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo overflow-x-hidden">
         <section className="flex flex-col my-12 md:my-24 md:gap-24">
            <h2 className="font-noto-sans-black text-center uppercase text-white text-big-five lg:text-large-head">Categories</h2>
            <div className="md:bg-light-background md:backdrop-blur-64">
               <div className="flex flex-col md:flex-row py-8 gap-10 md:gap-12 md:w-2/3 mx-auto">
                  <button className="flex flex-col gap-2 md:gap-4 items-center justify-between flex-1" onClick={() => setProductCategory('game')}>
                     <div>
                        <img className="w-[140px] md:w-auto" src="/assets/images/cat-1.svg" alt="" />
                     </div>
                     <div className="flex flex-row md:flex-col text-center text-white font-semibold text-head-2 lg:text-head-4 gap-1 md:gap-0">
                        <div>Products with</div>
                        <div>Free Games</div>
                     </div>
                  </button>
                  <button className="flex flex-col gap-2 md:gap-4 items-center justify-center flex-1" onClick={() => setProductCategory('prize')}>
                     <div>
                        <img className="w-[140px] md:w-auto" src="/assets/images/cat-2.svg" alt="" />
                     </div>
                     <div className="flex flex-row md:flex-col text-center text-white font-semibold text-head-2 lg:text-head-4 gap-1 md:gap-0">
                        <div>Products with</div>
                        <div>Free Prize</div>
                     </div>
                  </button>
                  <button className="flex flex-col gap-2 md:gap-4 items-center justify-center flex-1" onClick={() => setProductCategory('all')}>
                     <div>
                        <img className="w-[140px] md:w-auto" src="/assets/images/cat-3.svg" alt="" />
                     </div>
                     <div className="flex flex-row md:flex-col text-center text-white font-semibold text-head-2 lg:text-head-4 gap-1 md:gap-0">
                        <div>Shop All</div>
                        <div>Products</div>
                     </div>
                  </button>
               </div>
            </div>
         </section>
         { 
         (category === 'all' || category === 'game') && (
         <section className="flex flex-col gap-6 md:gap-12" style={{marginBottom: '80px'}}>
            <h2 className="font-noto-sans-black text-center uppercase text-white text-big-five lg:text-large-head">Buy products with free raffle games</h2>
            <div className="flex flex-col px-8 md:px-24 gap-12">
               <div className="flex flex-col md:flex-row items-end gap-10 md:gap-0 md:items-center md:justify-between">
                  <div className="flex flex-row gap-8 items-center">
                     <div className="flex flex-row items-center gap-8 text-white">
                        <div className="hidden md:block font-medium">Price: </div>
                        <div>
                           <MultiRangeSlider min={0} max={500} onChange={({ min, max }) => setGameMinMax({min: min, max: max})} />
                        </div>
                     </div>
                     <button type="button" className="mt-1 text-center text-themeone bg-white font-semibold shadow-custom-1 rounded-full py-2 px-12" onClick={applyGameFilters}>Apply</button>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                     <div className="text-white font-medium">Sort By:</div>
                     <div className="relative">
                        <Menu>
                           <MenuButton className="text-center text-themeone bg-white font-semibold shadow-custom-1 rounded-full py-2 px-12">{game_sort_text}</MenuButton>
                           <MenuItems anchor="bottom" className="bg-white py-4 rounded-xl mt-1">
                              <MenuItem>
                                 <div className="border-b border-gray-100 py-2 px-8 cursor-pointer hover:bg-gray-100" onClick={() => setGameSortAndApplyFilters({sort_by: 'sold', sort_order: -1}, 'Best Selling')}>Best Selling</div>
                              </MenuItem>
                              <MenuItem>
                                 <div className="border-b border-gray-100 py-2 px-8 cursor-pointer hover:bg-gray-100" onClick={() => setGameSortAndApplyFilters({sort_by: 'name', sort_order: 1}, 'A-Z (Ascending)')}>A-Z (Ascending)</div>
                              </MenuItem>
                              <MenuItem>
                                 <div className="border-b border-gray-100 py-2 px-8 cursor-pointer hover:bg-gray-100" onClick={() => setGameSortAndApplyFilters({sort_by: 'name', sort_order: -1}, 'Z-A (Descending)')}>Z-A (Descending)</div>
                              </MenuItem>
                           </MenuItems>
                        </Menu>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
               <Suspense>   
               { 
                  section.products_with_game.map((product: any) => (
                     // @ts-ignore
                     product.productWithGame.length > 0 && section.game_draw_ids.includes(product._id) && (
                        <ProductGameCard key={product._id + product.productWithGame[0]._id} productId={product._id} name={product.name} gameName={ product.productWithGame[0].name } price={'AED ' + product.price} vat={product.vat} buyLink={"/buy/product/game/" + product._id} productImageLink={product.image} quantity={product.quantity_to_select} setGameProductQuantity={setGameProductQuantity} />
                     )
                  ))
               }
               </Suspense>
               </div>
            </div>
         </section>
         )}

         { 
         (category === 'all' || category === 'prize') && (
         <section className="flex flex-col gap-6 my-12 md:my-24 md:gap-12">
            <h2 className="font-noto-sans-black text-center uppercase text-white text-big-five lg:text-large-head">Buy products with free mega prize</h2>
            <div className="flex flex-col px-8 md:px-24 gap-12">
            <div className="flex flex-col md:flex-row items-end gap-10 md:gap-0 md:items-center md:justify-between">
                  <div className="flex flex-row gap-8 items-center">
                     <div className="flex flex-row items-center gap-8 text-white">
                        <div className="hidden md:block font-medium">Price: </div>
                        <div>
                           <MultiRangeSlider min={0} max={500} onChange={({ min, max }) => setPrizeMinMax({min: min, max: max})} />
                        </div>
                     </div>
                     <button type="button" className="mt-1 text-center text-themeone bg-white font-semibold shadow-custom-1 rounded-full py-2 px-12" onClick={applyPrizeFilters}>Apply</button>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                     <div className="text-white font-medium">Sort By:</div>
                     <div className="relative">
                        <Menu>
                           <MenuButton className="text-center text-themeone bg-white font-semibold shadow-custom-1 rounded-full py-2 px-12">{prize_sort_text}</MenuButton>
                           <MenuItems anchor="bottom" className="bg-white py-4 rounded-xl mt-1">
                              <MenuItem>
                                 <div className="border-b border-gray-100 py-2 px-8 cursor-pointer hover:bg-gray-100" onClick={() => setPrizeSortAndApplyFilters({sort_by: 'sold', sort_order: -1}, 'Best Selling')}>Best Selling</div>
                              </MenuItem>
                              <MenuItem>
                                 <div className="border-b border-gray-100 py-2 px-8 cursor-pointer hover:bg-gray-100" onClick={() => setPrizeSortAndApplyFilters({sort_by: 'name', sort_order: 1}, 'A-Z (Ascending)')}>A-Z (Ascending)</div>
                              </MenuItem>
                              <MenuItem>
                                 <div className="border-b border-gray-100 py-2 px-8 cursor-pointer hover:bg-gray-100" onClick={() => setPrizeSortAndApplyFilters({sort_by: 'name', sort_order: -1}, 'Z-A (Descending)')}>Z-A (Descending)</div>
                              </MenuItem>
                           </MenuItems>
                        </Menu>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-2 gap-8 md:gap-12">
               <Suspense> 
               { 
                  section.products_with_prize.map((product: any) => (
                     // @ts-ignore
                     product.productWithPrize.length > 0 && section.prize_draw_ids.includes(product._id) && (
                        <ProductPrizeCard key={product._id + product.productWithPrize[0]._id} name={product.name} prizeName={product.productWithPrize.name} price={'AED' + product.price} vat={product.vat} detailLink={"/product/" + product._id} checkoutLink={"/buy/product/prize/" + product._id} productImageLink={product.image} prizeImageLink={product.productWithPrize[0].image} productId={product._id} quantity={product.quantity_to_select} setPrizeProductQuantity={setPrizeProductQuantity}/>
                     )
                  ))
               }
               </Suspense>
               </div>
               <Link style={{display: 'none'}} href="" className="text-center text-themeone md:mt-6 bg-white font-semibold shadow-custom-1 rounded-full py-4 px-12 mx-auto">Explore More</Link>
            </div>
         </section>
         )}

         <div className="bg-light-background backdrop-blur-64 py-12 md:py-0">
         <ResultsSection yalla_3_top_winner={section.yalla_3_top_winner} yalla_4_top_winner={section.yalla_4_top_winner} yalla_6_top_winner={section.yalla_6_top_winner} game_winners={section.game_winners} product_winners={section.product_winners} />
         </div>
      </div>
   )
}