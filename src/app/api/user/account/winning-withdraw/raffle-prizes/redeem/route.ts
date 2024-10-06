import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
//import mongoose from "mongoose";
import mongoose from "mongoose";
import Wallet from "@/models/WalletModel";
import Transaction from "@/models/TransactionModel";
import connectMongoDB from "@/libs/mongoosdb";
import Winner from "@/models/WinnerModel";

export async function GET(request: NextRequest) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        var amount = searchparams.get('amount') + '';
        var id = searchparams.get('id') + '';
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
                payment_type: 'Deposit',
                via: 'Winning Withdrawal',
                card_details: 'No card needed',
                amount: amount,
                date: new Date(),
                closing_balance: walletResult[0].amount,
                note: 'Winning Amount withdrawan in wallet.'
            }
            var TransactionDetails = await Transaction.create(transactionDoc);
            var winner = await Winner.findOne({_id: id}).select('amount_withdrawn')
            var amount_withdrawn = parseFloat(winner.amount_withdrawn) + parseFloat(amount);
            await Winner.updateOne({_id: id}, {$set: {amount_withdrawn: amount_withdrawn}});
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

export async function PATCH(request: NextRequest) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var winner = await Winner.findOne({_id: id}).select(['prize_amount', 'amount_withdrawn']);
        console.log(winner.prize_amount - winner.amount_withdrawn)
        var amount_left = winner.prize_amount - winner.amount_withdrawn;
        return NextResponse.json({
            message: "Query successful ....",
            winner: winner,
            amount_left: amount_left
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            message: "Query error ....",
        }, {status: 500});
    }
}