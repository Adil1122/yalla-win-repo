import React from 'react'
import AccountDetailsInfoCard from './AccountDetailsInfoCard'

const AccountEnterWin: React.FC<any> = ({ productPurchaseData, usingCouponData, howToWinData } : any) => {

   return (
      <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo overflow-x-hidden">
         <section className="flex flex-col mt-8 lg:mt-20 gap-8 lg:gap-12">
            <h2 className="font-noto-sans-black text-center uppercase text-white text-head-6 px-4 lg:text-large-head">Purchase a product</h2>
            <div className="flex flex-col md:flex-row md:flex-wrap justify-center relative py-8 md:py-20 px-8 md:px-24 bg-light-background backdrop-blur-64">
               {productPurchaseData.map((item: any, index: number) => (
                  <AccountDetailsInfoCard key={index} number={item.number} title={item.title} description={item.description} />
               ))}
            </div>
         </section>
         <section className="flex flex-col mt-8 lg:mt-20 gap-8 lg:gap-12">
            <h2 className="font-noto-sans-black text-center uppercase text-white text-head-6 px-4 lg:text-large-head">How to use your coupon code</h2>
            <div className="flex flex-col md:flex-row md:flex-wrap justify-center py-8 lg:py-20 px-8 lg:px-24 bg-light-background backdrop-blur-64">
               {usingCouponData.map((item: any, index: number) => (
                  <AccountDetailsInfoCard key={index} number={item.number} title={item.title} description={item.description} />
               ))}
            </div>
         </section>
         <section className="flex flex-col mt-8 lg:mt-20 gap-8 lg:gap-12">
            <h2 className="font-noto-sans-black text-center uppercase text-white text-head-6 px-4 lg:text-large-head">Learn how to win</h2>
            <div className="flex flex-col md:flex-row md:flex-wrap justify-center py-8 lg:py-20 px-8 lg:px-24 bg-light-background backdrop-blur-64">
               {howToWinData.map((item: any, index: number) => (
                  <AccountDetailsInfoCard key={index} number={item.number} title={item.title} description={item.description} />
               ))}
            </div>
         </section>
      </div>
   )
}

export default AccountEnterWin
