import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Invoice from "@/models/InvoiceModel";
import Transaction from "@/models/TransactionModel";
import Message from "@/models/MessageModel";
import User from "@/models/UserModel";
import mongoose from "mongoose";
import Sale from "@/models/SaleModel";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var type = searchparams.get('type') + '';
        var count = searchparams.get('count') + '';
        if(count === '0') {
            if(type === 'games') {
                return getRaffleGames(request)
            }
            if(type === 'products') {
                return getRaffleProducts(request)
            }
            if(type === 'transaction') {
                return getTransactions(request)
            }
            if(type === 'sales') {
                return getSales(request)
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

async function getRaffleGames(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        var search: any = searchparams.get('search') + '';

        const records = await Invoice
            .aggregate([
                {
                    $match:
                    {
                        $and: [ 
                            { user_id: new mongoose.Types.ObjectId(id) },
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
            records: records
        }, {status: 200});

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
        var id = searchparams.get('id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        var search = searchparams.get('search') + '';
        const records = await Invoice
            .find({
                $and:[
                    { user_id: id },
                    {invoice_type: 'prize'},
                    {invoice_number: { $regex: '.*' + search + '.*', $options: 'i' }}
                ]
            }).sort({'createdAt': -1}).skip(skip).limit(limit);

        return NextResponse.json({
            messge: "Query successful ....",
            records: records
        }, {status: 200});
    } catch (error) {
        
    }
}

async function getTransactions(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        const records = await Transaction
            .find(
                { user_id: id }
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

async function getSales(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        const records = await Sale.find({merchant_id: id});

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
        /*var record = await User.findOne({_id: id})
        const invoices_details = await Invoice
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

        if(type === 'games') {
            total_records_count = await Invoice
            .find({
                $and:[
                    { user_id: id },
                    {invoice_type: 'game'},
                    {invoice_number: { $regex: '.*' + search + '.*', $options: 'i' }}
                ]
            }).countDocuments();
        }

        if(type === 'products') {
            total_records_count = await Invoice
            .find({
                $and:[
                    { user_id: id },
                    {invoice_type: 'prize'},
                    {invoice_number: { $regex: '.*' + search + '.*', $options: 'i' }}
                ]
            }).countDocuments();
        }

        if(type === 'sales') {
            total_records_count = 1;
        }

        if(type === 'communication') {
            total_records_count = await Message
            .find(
                { user_id: id }
            ).countDocuments();
        }

        return NextResponse.json({
            messge: "Query successful ....",
            total_records_count: total_records_count,
            //record: record,
            //invoices_details: invoices_details
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var sale = await Sale.findOne({_id: id});
        return NextResponse.json({
            messge: "Query successful ....",
            sale: sale
          }, {status: 200});

    } catch (error) {

        return NextResponse.json({
            messge: "Query error ....",
          }, {status: 500});

    }
}

export async function PUT(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';

        const data = await request.formData();
        var total_sales:any = data.get('total_sales');
        var total_orders:any = data.get('total_orders');
        var winning_orders: any = data.get('winning_orders');
        var merchant_percentage: any = data.get('merchant_percentage');
        var our_percentage:any = data.get('our_percentage');
        var payment_status:any = data.get('payment_status');

        var saleObj = await Sale.findOne({_id: id});
        if(saleObj) {
            const query = { _id: saleObj._id };
            let updates = {
                $set: {
                    total_sales: total_sales,
                    total_orders: total_orders,
                    winning_orders: winning_orders,
                    merchant_percentage: merchant_percentage,
                    our_percentage: our_percentage,
                    payment_status: payment_status
                }
            };
            var sale = await Sale.updateOne(query, updates);
            return NextResponse.json({
                messge: "Sale successfully updated ....",
                sale: sale
              }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Sale could not be found ....",
              }, {status: 500});
        }
        
    } catch (error) {

        return NextResponse.json({
            messge: "Sale could not be updated ....",
          }, {status: 500});
        
    }
}