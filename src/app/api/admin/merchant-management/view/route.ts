import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Invoice from "@/models/InvoiceModel";
import Transaction from "@/models/TransactionModel";
import Message from "@/models/MessageModel";
import mongoose from "mongoose";
import Shop from "@/models/ShopModel";
import User from "@/models/UserModel";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var type = searchparams.get('type') + '';
        var count = searchparams.get('count') + '';
        if(count === '0') {
            if(type === 'details') {
                return getShops(request)
            }
            if(type === 'communication') {
                return getMessages(request)
            } 
        } else if(count === '1') {
            return getTotalRecordsCountAndRecord(request)
        }
        
    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}

async function getShops(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');

        const records = await Shop
            .find(
                { merchant_id: id }
            ).sort({'createdAt': -1}).skip(skip).limit(limit);

        return NextResponse.json({
            messge: "Query successful ....",
            records: records
        }, {status: 200});

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
        var id = searchparams.get('id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        const records = await Message
        .aggregate([
            { $match:
                {
                    $or: [ 
                        {sender_id: new mongoose.Types.ObjectId(id) },
                        {receiver_id: new mongoose.Types.ObjectId(id)}
                    ]
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "sender_id",
                    foreignField: "_id",
                    as: "senderWithMessage",
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "receiver_id",
                    foreignField: "_id",
                    as: "receiverWithMessage",
                }
            }
        ]).sort({'createdAt': -1}).skip(skip).limit(limit);

        return NextResponse.json({
            messge: "Query successful ....",
            records: records
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}

async function getTotalRecordsCountAndRecord(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var search = searchparams.get('search') + '';
        var type = searchparams.get('type') + '';
        var record = await User.findOne({_id: id})
        /*const invoices_details = await Invoice
            .aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(id) 
                    },
                },
                {
                    $group :
                      {
                        _id : "$user_id",
                        totalSaleAmount: { $sum: "$total_amount" },
                        count: { $sum: 1 }
                      }
                },
            ]);*/

        var total_records_count = 0;

        if(type === 'details') {
            total_records_count = await Shop
            .find(
                { merchant_id: id }
            ).countDocuments();
        }

        if(type === 'communication') {
            total_records_count = await Message
            .find({ 
                $or: [ 
                    {sender_id: new mongoose.Types.ObjectId(id) },
                    {receiver_id: new mongoose.Types.ObjectId(id)}
                ]
            }).countDocuments();
        }

        return NextResponse.json({
            messge: "Query successful ....",
            total_records_count: total_records_count,
            record: record,
            //invoices_details: invoices_details
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}


