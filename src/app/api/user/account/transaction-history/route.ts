import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Transaction from "@/models/TransactionModel";
import { total_records_limit } from "@/libs/common";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        var platform_type = searchparams.get('platform_type') + '';
        var limit = total_records_limit;
        var skip = 0;
        if(platform_type === 'web') {
            limit = parseInt(searchparams.get('limit') + '');
            skip = parseInt(searchparams.get('skip') + '');
        }

        const transactions = await Transaction.find({user_id: user_id}).sort({'createdAt': -1}).skip(skip).limit(limit);
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

export async function OPTIONS(request: NextRequest) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';

        const transaction_count = await Transaction.find({user_id: user_id}).countDocuments();
        return NextResponse.json({
            message: "query successful ....",
            transaction_count: transaction_count
            }, {status: 200});
    } catch (error) {
        return NextResponse.json({
            message: "query error ....",
            error: JSON.stringify(error)
            }, {status: 200});
    }
}