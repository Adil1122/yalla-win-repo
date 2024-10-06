import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
//import mongoose from "mongoose";
import mongoose from "mongoose";
import Wallet from "@/models/WalletModel";
import Transaction from "@/models/TransactionModel";
import connectMongoDB from "@/libs/mongoosdb";

export async function GET(request: NextRequest) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        var amount = searchparams.get('amount') + '';
        let query = { user_id: new mongoose.Types.ObjectId(user_id + '') };
        let walletResult = await Wallet.find(query);
        if(walletResult && walletResult.length > 0) {
            const updates = {
                $set: {
                    amount: parseFloat(walletResult[0].amount) + parseFloat(amount),
                },
            };
            var walletUpdateResult = await Wallet.updateOne(query, updates);
        } else {
            const newDoc = {
                user_id: user_id,
                amount: amount
            }
            walletUpdateResult = await Wallet.create(newDoc);
        }

        walletResult = await Wallet.find(query);

        if(walletResult && walletResult.length > 0) {
            var transactionDoc = {
                user_id: user_id,
                payment_type: 'deposit',
                via: 'card',
                card_details: 'Card Details could not be revealed',
                amount: amount,
                date: new Date(),
                closing_balance: walletResult[0].amount,
                note: 'Amount Added Via Card'
            }
            var TransactionDetails = await Transaction.create(transactionDoc);
        }
        return NextResponse.json({
            message: "Amount successfully added in wallet ....",
            walletUpdateResult: walletUpdateResult,
            TransactionDetails: TransactionDetails
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({
            message: "Amount could not be added in wallet ....",
        }, {status: 500});
    }
}