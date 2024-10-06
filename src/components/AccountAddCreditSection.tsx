import React from 'react'
import AccountDetailsInfoCard from './AccountDetailsInfoCard'

const AccountAddCredit: React.FC<any> = ({ data } : any) => {
   return (
      <div className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo overflow-x-hidden">
         <section className="flex flex-col mt-8 lg:mt-20 gap-8 lg:gap-12">
            <h2 className="font-noto-sans-black text-center uppercase text-white text-head-6 px-4 lg:text-large-head">How to add credit</h2>
            <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center relative py-8 lg:py-20 px-8 lg:px-24 bg-light-background backdrop-blur-64">
               {data.map((item: any, index: any) => (
                  <AccountDetailsInfoCard key={index} number={item.number} title={item.title} description={item.description} />
               ))}
            </div>
         </section>
      </div>
   )
}

export default AccountAddCredit
