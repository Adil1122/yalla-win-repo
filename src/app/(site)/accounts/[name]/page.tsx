import AccountAddCreditSection from '@/components/AccountAddCreditSection'
import AccountEnterWinSection from '@/components/AccountEnterWinSection'
import AccountWithdrawSection from '@/components/AccountWithdrawSection'
import AccountShopSection from '@/components/AccountShopSection'
import React from 'react'

export default function AccountDetailsPage({ params } : {params: { name: string; }}) {

   const productPurchaseData = [
      {number: "1", title:"Select the quantity", description:"Select the quantity of products you want to purchase and continue your steps. Each products adds one line in yalla win andn increase your chance to win"},
      {number: "2", title:"Pick 9 numbers", description:"Pick any 9 numbers in the sequence of your choice per line. Numbers range from 1-9. You can enter multiplle lines at a time. You can use RANDOM PICK to allow the system to select sequence for you"},
      {number: "3", title:"Select type of draw", description:"Select the type draw & click. Next: CURRENT DRAW allows you to enter for the immediate and upcoming draw. MULTIPLE UPCOMING DRAWS allow you to enter your selected line"},
      {number: "4", title:"Change numbers", description:"If a sequence is unavailable you can click CHANGE NUMBERS to use another number sequence. LAternatively allow the system to select for you by clicking quick pick"},
      {number: "5", title:"Pay to Proceed", description:"Once your line numbers are available, the payment options will show. You can either pay using credit balance or using your payment card"},
      {number: "6", title:"Email Confirmation", description:"A confirmation email will be sent to you for the purchase and to confirm your entry into the draw"},
      {number: "7", title:"Watch Live Show", description:"Watch our live show"},
      {number: "8", title:"Claim Rewards", description:"If you are luck enough to win, we will immediately credit any winnings to your winning wallet. Good luck!"},
   ]
   
   const addCreditData = [
      {number: "1", title:"Select the quantity", description:"Select the quantity of products you want to purchase and continue your steps. Each products adds one line in yalla win andn increase your chance to win"},
      {number: "2", title:"Pick 9 numbers", description:"Pick any 9 numbers in the sequence of your choice per line. Numbers range from 1-9. You can enter multiplle lines at a time. You can use RANDOM PICK to allow the system to select sequence for you"},
      {number: "3", title:"Select type of draw", description:"Select the type draw & click. Next: CURRENT DRAW allows you to enter for the immediate and upcoming draw. MULTIPLE UPCOMING DRAWS allow you to enter your selected line"},
      {number: "4", title:"Change numbers", description:"If a sequence is unavailable you can click CHANGE NUMBERS to use another number sequence. LAternatively allow the system to select for you by clicking quick pick"},
      {number: "5", title:"Email Confirmation", description:"A confirmation email will be sent to you for the purchase and to confirm your entry into the draw"},
      {number: "6", title:"Watch Live Show", description:"Watch our live show"},
      {number: "7", title:"Claim Rewards", description:"If you are luck enough to win, we will immediately credit any winnings to your winning wallet. Good luck!"},
   ]
   
   const usingCouponData = [
      {number: "1", title:"Select Enter Code", description:"Keep your coupons handy and select ENTER CODE"},
      {number: "2", title:"Enter the code", description:"Enter your 16 digit code per coupon"},
      {number: "3", title:"Number Sequence", description:"Based on your number of confirmed coupons the system will generate your number sequence"},
      {number: "4", title:"Email Confirmation", description:"A confirmation email will be sent"},
      {number: "5", title:"Watch Live Show", description:"Watch our live show"},
      {number: "6", title:"Claim Reward", description:"Winner will get notified by the Emirates Draw team with the winnings added to your Winning Wallet"},
   ]

   const howToWinData = [
      {number: "1", title:"Select Enter Code", description:"During the live draw show 9 balls will be drawn"},
      {number: "2", title:"Enter the code", description:"Enter your 16 digit code per coupon"},
      {number: "3", title:"Number Sequence", description:"Your numbers have to match the exact sequence starting right to left to win for the grand prize and the main draw"}
   ]

   return (
      <>
         {params.name == 'how-to-enter-and-win' && (
            <AccountEnterWinSection productPurchaseData={productPurchaseData} usingCouponData={usingCouponData} howToWinData={howToWinData}  />
         )}
         
         {params.name == 'how-to-shop' && (
            <AccountShopSection productPurchaseData={productPurchaseData} />
         )}

         {params.name == 'how-to-add-credit' && (
            <AccountAddCreditSection data={addCreditData} />
         )}
         
         {params.name == 'how-to-withdraw' && (
            <AccountWithdrawSection data={productPurchaseData} />
         )}
      </>
   )
}
