"use client"

import React from "react"
import CheckoutWithFreeGame from "@/components/CheckoutWithFreeGame";

export default function BuyProduct({ params } : {params: { type: string; id: string; }}) {

   return (
      <>
         {params.type == 'game' && (
            <CheckoutWithFreeGame id={params.id} />
         )}
      </>
   )
}
