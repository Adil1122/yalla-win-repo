import Link from 'next/link';
import React from 'react'

interface CardProps {
   title: string;
   subTitle: string;
   iconImage: string;
   detailsLink: string;
}

const AccountCard: React.FC<CardProps> = ({ title, subTitle, iconImage, detailsLink }) => {
   return (
      <div className="flex flex-col bg-white items-center justify-center gap-0 xl:gap-2 rounded-standard pb-4 xl:py-16 shadow-custom-1 z-10">
         <img className="h-[160px]" src={iconImage} alt="" />
         <div className="capitalize text-theme-gradient font-semibold text-head-3 xl:text-head-8 xl:px-6 text-center">{title}</div>
         <div className="capitalize text-darkone text-size-1 xl:text-size-3 leading-tight text-center px-12 mt-1">{subTitle}</div>
         <Link href={detailsLink} className="capitalize text-white text-size-2 xl:text-head-1 text-center rounded-full bg-themeone px-12 py-2 xl:py-3 mt-5 xl:mt-8 cursor-pointer">View more</Link>
      </div>
   )
}

export default AccountCard;
