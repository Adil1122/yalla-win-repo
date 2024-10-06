"use client"

import AccountCard from "@/components/account-card"
import React from "react"
export default function AccountsPage() {

   return (
      <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo overflow-x-hidden">
         <section className="flex flex-col mt-20 gap-12">
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
      </div>
   )
}
