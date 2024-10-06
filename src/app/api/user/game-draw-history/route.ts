import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Invoice from "@/models/InvoiceModel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        let today = new Date().toISOString().slice(0, 10)
        //var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        //var tomorrow = tomorrowDate.toISOString().slice(0, 10);
        console.log(today)

        const invoices = await Invoice
              .aggregate([
                  {
                      $match: {
                        $and: [
                            {invoice_type: 'game'},
                            {
                                createdAt: {
                                    $lt : new Date(today), 
                                    //$lt: new Date(tomorrow)
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
                  },
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