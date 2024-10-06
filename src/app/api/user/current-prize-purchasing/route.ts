import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import mongoose from "mongoose";
import Invoice from "@/models/InvoiceModel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        let today = new Date().toISOString().slice(0, 10)
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        var tomorrow = tomorrowDate.toISOString().slice(0, 10);
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';

        const invoices = await Invoice
              .find(
                  {
                        $and: [
                            {invoice_type: 'prize'},
                            {
                                createdAt: {
                                    $gte : new Date(today), 
                                    $lt: new Date(tomorrow)
                                }
                            },
                            {user_id: new mongoose.Types.ObjectId(user_id)}
                        ]
                  }
              ).sort({'createdAt': -1}).limit(100);

        
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
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';

        const invoice = await Invoice
              .aggregate([
                  {
                      $match: {_id: new mongoose.Types.ObjectId(id)},
                  },
                  {
                      $lookup: {
                          from: "users",
                          localField: "user_id",
                          foreignField: "_id",
                          as: "userInInvoice",
                      },
                  }
              ]).sort({'createdAt': -1}).limit(1);

        return NextResponse.json({
            message: "query successful ....",
            invoice: invoice
        }, {status: 200});        
        
    } catch (error) {
        return NextResponse.json({
            message: "query error ....",
        }, {status: 500});
    }
}

