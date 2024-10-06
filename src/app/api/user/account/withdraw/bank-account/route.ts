// pages/api/payment.js
import Stripe from 'stripe';
import { NextRequest, NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY + '');
export async function POST(request: NextRequest) {
    try {
      let {amount, currency, bankAccountNumber} = await request.json();
      let type:any = 'bank_transfer';
        // Example of creating a payment intent
        
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_data: {
          type: type,
          //@ts-ignore
          us_bank_account: {
            account_number: bankAccountNumber,
            // Additional fields might be required based on the bank and country
          },
        },
      });

      return NextResponse.json({
        message: "payment intent successfully created ....",
        clientSecret: paymentIntent.client_secret
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            message: "payment intent error ....",
            error: error 
            }, {status: 500});
    }
}