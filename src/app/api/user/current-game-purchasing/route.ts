import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Invoice from "@/models/InvoiceModel";
import mongoose from "mongoose";
import Ticket from "@/models/TicketModel";

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
              .aggregate([
                  {
                      $match: {
                        $and: [
                            {invoice_type: 'game'},
                            {
                                createdAt: {
                                    $gte : new Date(today), 
                                    $lt: new Date(tomorrow)
                                }
                            },
                            {user_id: new mongoose.Types.ObjectId(user_id)}
                        ]

                      },
                  },
                  {
                      $lookup: {
                          from: "games",
                          localField: "game_id",
                          foreignField: "_id",
                          as: "gameInInvoice",
                      },
                  },
                  {
                    $lookup: {
                        from: "products",
                        localField: "product_id",
                        foreignField: "_id",
                        as: "productInInvoice",
                    },
                  },
                  {
                    $lookup: {
                        from: "draws",
                        localField: "draw_id",
                        foreignField: "_id",
                        as: "drawInInvoice",
                    },
                  }
              ]).sort({'createdAt': -1}).limit(100);

        
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
                      $match: {
                        $and: [
                            {invoice_type: 'game'},
                            {_id: new mongoose.Types.ObjectId(id)}
                        ]
                      },
                  },
                  {
                      $lookup: {
                          from: "games",
                          localField: "game_id",
                          foreignField: "_id",
                          as: "gameInInvoice",
                      },
                  },
                  {
                    $lookup: {
                        from: "products",
                        localField: "product_id",
                        foreignField: "_id",
                        as: "productInInvoice",
                    },
                  },
                  {
                    $lookup: {
                        from: "draws",
                        localField: "draw_id",
                        foreignField: "_id",
                        as: "drawInInvoice",
                    },
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

        if(invoice && invoice.length > 0) {
            const tickets = await Ticket.find({invoice_id: id});
            return NextResponse.json({
                message: "query successful ....",
                invoice: invoice,
                tickets: tickets
              }, {status: 200});

        } else {
            return NextResponse.json({
                message: "invoice not found ....",
              }, {status: 500});
        }  

    } catch (error) {
        return NextResponse.json({
            message: "query error ....",
          }, {status: 500});
    }
}