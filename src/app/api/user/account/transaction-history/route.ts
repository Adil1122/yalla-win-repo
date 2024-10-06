import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Transaction from "@/models/TransactionModel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';

        const transactions = await Transaction.find({user_id: user_id}).sort({'createdAt': -1}).limit(100);
        return NextResponse.json({
            message: "query successful ....",
            transactions: transactions
            }, {status: 200});
            
    } catch(error) {
        return NextResponse.json({
            message: "query error ....",
          }, {status: 500});
    }
}