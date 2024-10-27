//import Product from "@/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
//import mongoose from "mongoose";
import Invoice from "@/models/InvoiceModel";
import mongoose from "mongoose";
import Basket from "@/models/BasketModel";
import Wallet from "@/models/WalletModel";
import User from "@/models/UserModel";
export async function POST(request: NextRequest) {

  try {
    await connectMongoDB();
    let {
        invoice,
        draws,
        platform
    } = await request.json();

    let user = await User.findOne({_id: invoice.user_id}).select(['_id', 'city', 'country', 'role'])

    let invoiceDocument = {
        //product_id: product_id, 
        user_id: invoice.user_id, 
        invoice_number: invoice.invoice_number, 
        invoice_date: invoice.invoice_date, 
        //vat: vat, 
        total_amount: invoice.total_amount, 
        invoice_status: invoice.invoice_status,
        //quantity: quantity
        cart_product_details: JSON.stringify(invoice.product_details),
        draws: JSON.stringify(draws),
        invoice_type: 'prize',
        user_city: user.city,
        user_country: user.country,
        platform: platform
    }

    let query = { user_id: new mongoose.Types.ObjectId(invoice.user_id + '') };
    let walletResult = await Wallet.find(query);

    if((walletResult && walletResult.length) > 0 || (user && user.role === 'merchant')) {

        if(user && user.role !== 'merchant' && walletResult[0].amount < invoice.total_amount) {
            return NextResponse.json({
                message: "Insufficient funds available in your wallet ....",
            }, {status: 500});
        }

        console.log('invoiceDocument', invoiceDocument)

        let invoiceResult = await Invoice.create(invoiceDocument);

        if(invoiceResult && invoiceResult._id) {
            let deleteResult = await Basket.deleteMany(query);

            if(deleteResult) {

                if(user && user.role !== 'merchant') {
                    const updates = {
                        $set: {
                            amount: walletResult[0].amount - invoice.total_amount,
                        },
                    };
                    let walletUpdateResult = await Wallet.updateMany(query, updates);
                    if(!walletUpdateResult) {
                        return NextResponse.json({
                            message: "User wallet could not be updated ....",
                            invoiceResult: invoiceResult
                        }, {status: 500});
                    }
                }

                return NextResponse.json({
                    message: "query successful ....",
                    invoiceResult: invoiceResult
                }, {status: 200});
                
            } else {
                return NextResponse.json({
                    message: "cart items could not be deleted ....",
                    invoiceResult: invoiceResult
                }, {status: 500});
            }
        }

    } else {
        return NextResponse.json({
            message: "wallet not found ....",
          }, {status: 500});
    }

    } catch (error) {
        return NextResponse.json({
          message: "error query ....",
          error: error
        }, {status: 500});
    }
}

