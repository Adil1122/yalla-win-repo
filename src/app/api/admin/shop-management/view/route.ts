import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Invoice from "@/models/InvoiceModel";
import Transaction from "@/models/TransactionModel";
import Message from "@/models/MessageModel";
import mongoose from "mongoose";
import Shop from "@/models/ShopModel";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var type = searchparams.get('type') + '';
        if(type === 'raffle_games') {
            return getRaffleGames(request)
        }
        if(type === 'raffle_products') {
            return getRaffleProducts(request)
        }
        if(type === 'transactions') {
            return getTransactions(request)
        }
        if(type === 'messages') {
            return getMessages(request)
        }
        
    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}

async function getRaffleGames(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var shop_id = searchparams.get('shop_id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        var search: any = searchparams.get('search') + '';
        const shop: any = await Shop.findOne({_id: shop_id}).select(['_id', 'merchant_id']);
        

        if(shop) {
            const raffle_games_invoices = await Invoice
            .aggregate([
                {
                    $match:
                    {
                        $and: [ 
                            { user_id: new mongoose.Types.ObjectId(shop.merchant_id + '') },
                            {invoice_type: 'game'},
                            {invoice_number: { $regex: '.*' + search + '.*', $options: 'i' }}
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'games',
                        localField: "game_id",
                        foreignField: "_id",
                        as: "gameWithInvoice",
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: "product_id",
                        foreignField: "_id",
                        as: "productWithInvoice",
                    }
                }
            ]).sort({'createdAt': -1}).skip(skip).limit(limit);

            return NextResponse.json({
                messge: "Query successful ....",
                raffle_games_invoices: raffle_games_invoices
            }, {status: 200});

        } else {
            return NextResponse.json({
                messge: "Query successful ....",
                raffle_games_invoices: []
            }, {status: 200});
        }

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }

}

async function getRaffleProducts(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var shop_id = searchparams.get('shop_id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        var search = searchparams.get('search') + '';
        const shop: any = await Shop.findOne({_id: shop_id}).select(['_id', 'merchant_id']);

        if(shop) {
            const raffle_prizes_invoices = await Invoice
            .find({
                $and:[
                    { user_id: shop.merchant_id },
                    {invoice_type: 'prize'},
                    {invoice_number: { $regex: '.*' + search + '.*', $options: 'i' }}
                ]
            }).sort({'createdAt': -1}).skip(skip).limit(limit);

            return NextResponse.json({
                messge: "Query successful ....",
                raffle_prizes_invoices: raffle_prizes_invoices
            }, {status: 200});

        } else {

            return NextResponse.json({
                messge: "Query error ....",
                raffle_prizes_invoices: []
            }, {status: 200});

        }

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}

async function getTransactions(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var shop_id = searchparams.get('shop_id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        const shop: any = await Shop.findOne({_id: shop_id}).select(['_id', 'merchant_id']);
        
        if(shop) {
            const transactions = await Transaction
            .find(
                { user_id: shop.merchant_id }
            ).sort({'createdAt': -1}).skip(skip).limit(limit);

            return NextResponse.json({
                messge: "Query successful ....",
                transactions: transactions
            }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Query successful ....",
                transactions: []
            }, {status: 200});
        }
        

    } catch (error) {

        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
        
    }
}

async function getMessages(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var shop_id = searchparams.get('shop_id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        const shop: any = await Shop.findOne({_id: shop_id}).select(['_id', 'merchant_id']);

        if(shop) {
            const messages = await Message
            .find(
                { user_id: shop.merchant_id }
            ).sort({'createdAt': -1}).skip(skip).limit(limit);

            return NextResponse.json({
                messge: "Query successful ....",
                messages: messages
            }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Query successful ....",
                messages: []
            }, {status: 200});
        }
        

    } catch (error) {

        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});

    }
}


