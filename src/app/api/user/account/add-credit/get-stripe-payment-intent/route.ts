import { NextRequest, NextResponse } from "next/server";
//import connectMongoDB from "@/libs/mongoosdb";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY + '');
export async function POST(request: NextRequest) {
    let {amount} = await request.json();
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // amount in cents
            currency: 'usd',
        });

        return NextResponse.json({
            message: "payment intent successfully created ....",
            clientSecret: paymentIntent.client_secret
            }, {status: 200});
        
    } catch (error) {
        return NextResponse.json({
            message: "payment intent could not be created ....",
            }, {status: 200});
    }
}