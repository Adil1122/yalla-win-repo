import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Basket from "@/models/BasketModel";
import mongoose from "mongoose";
import Draw from "@/models/DrawModel";
import Invoice from "@/models/InvoiceModel";
import { total_records_limit, getStartEndDates } from "@/libs/common";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        let today = new Date().toISOString().slice(0, 10)
        //var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        //var tomorrow = tomorrowDate.toISOString().slice(0, 10);
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var platform_type = searchparams.get('platform_type') + '';
        var limit = total_records_limit;
        var skip = 0;
        if(platform_type === 'web') {
            limit = parseInt(searchparams.get('limit') + '');
            skip = parseInt(searchparams.get('skip') + '');
        }

        const invoices = await Invoice
              .find(
                  {
                        $and: [
                            {invoice_type: 'prize'},
                            {
                                createdAt: {
                                    $lt : new Date(today), 
                                    //$lt: new Date(tomorrow)
                                }
                            },
                            {cart_product_details: {$ne: null}}
                        ]
                  }
              ).sort({'createdAt': -1}).skip(skip).limit(limit);

        
        return NextResponse.json({
            message: "query successful ....",
            invoices: invoices
            }, {status: 200});
        

    } catch(error) {
        return NextResponse.json({
            message: "query error ....",
          }, {status: 500});
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectMongoDB();
        let today = new Date().toISOString().slice(0, 10)
        //var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        //var tomorrow = tomorrowDate.toISOString().slice(0, 10);
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var schedule = searchparams.get('schedule') + '';
        var dates: any = getStartEndDates(schedule)
        var start_date = dates['start_date']
        var end_date = dates['end_date']
        var user_id = searchparams.get('user_id') + ''

        console.log(today)

        const invoices = await Invoice
              .find(
                  {
                        $and: [
                            {invoice_type: 'prize'},
                            {
                                createdAt: {
                                    $gte : new Date(start_date), 
                                    $lt: new Date(end_date)
                                }
                            },
                            {cart_product_details: {$ne: null}},
                            {user_id: new mongoose.Types.ObjectId(user_id)}
                        ]
                  }
              ).sort({'createdAt': -1}).skip(0).limit(total_records_limit);

        
        return NextResponse.json({
            message: "query successful ....",
            invoices: invoices
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
        let today = new Date().toISOString().slice(0, 10)
        const invoice_count = await Invoice.find({
            $and: [
                {invoice_type: 'prize'},
                {
                    createdAt: {
                        $lt : new Date(today), 
                        //$lt: new Date(tomorrow)
                    }
                },
                {cart_product_details: {$ne: null}}
            ]
        }).countDocuments()

        return NextResponse.json({
            message: "query successful ....",
            invoice_count: invoice_count
            }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            message: "query error ....",
            error: JSON.stringify(error)
            }, {status: 500}); 
    }
}