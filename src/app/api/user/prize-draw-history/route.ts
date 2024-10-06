import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Basket from "@/models/BasketModel";
import mongoose from "mongoose";
import Draw from "@/models/DrawModel";
import Invoice from "@/models/InvoiceModel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        let today = new Date().toISOString().slice(0, 10)
        //var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        //var tomorrow = tomorrowDate.toISOString().slice(0, 10);

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
                            }
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