import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Invoice from "@/models/InvoiceModel";
import { total_records_limit, getStartEndDates } from "@/libs/common";
import mongoose from "mongoose";

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
        var user_id = searchparams.get('user_id') + '';
        var skip = 0;
        if(platform_type === 'web') {
            limit = parseInt(searchparams.get('limit') + '');
            skip = parseInt(searchparams.get('skip') + '');
        }

        console.log(today)

        const invoices = await Invoice
              .aggregate([
                  {
                      $match: {
                        $and: [
                            {invoice_type: 'game'},
                            { draw_date: { $ne: null } },
                            {user_id: new mongoose.Types.ObjectId(user_id)},
                            {
                              draw_date: {
                                    $lt : new Date(today)
                                }
                            }
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
              ]).sort({'createdAt': -1}).skip(skip).limit(limit);

        
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
        var user_id = searchparams.get('user_id') + '';

        //console.log('start_date: ', start_date)
        //console.log('end_date: ', end_date)

        const invoices = await Invoice
              .aggregate([
                  {
                      $match: {
                        $and: [
                            {invoice_type: 'game'},
                            {
                                createdAt: {
                                    $gte : new Date(start_date), 
                                    $lt: new Date(end_date)
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
                  },
              ]).sort({'createdAt': -1}).skip(0).limit(total_records_limit);

        
        return NextResponse.json({
            message: "query successful ....",
            invoices: invoices,
            start_date: start_date,
            end_date: end_date,
            schedule: schedule
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
        let today = new Date().toISOString().slice(0, 10)
        const count = await Invoice.aggregate([
         {
            $match: {
               $and: [
                     { invoice_type: 'game' },
                     { draw_date: { $ne: null } },
                     { user_id: new mongoose.Types.ObjectId(user_id) },
                     {
                        draw_date: {
                              $lt : new Date(today)
                          }
                      }
               ],
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
            $count: "totalCount",
         },
      ]);
      
      const invoice_count = count.length > 0 ? count[0].totalCount : 0;
     

        return NextResponse.json({
            message: "query successful ....",
            invoice_count: invoice_count
            }, {status: 200});

    } catch (error) {
      console.log(error)
        return NextResponse.json({
            message: "query error ....",
            error: JSON.stringify(error)
            }, {status: 500}); 
    }
}