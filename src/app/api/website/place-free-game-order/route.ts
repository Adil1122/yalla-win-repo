//import Product from "@/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
//import mongoose from "mongoose";
import Invoice from "@/models/InvoiceModel";
import Ticket from "@/models/TicketModel";
import Draw from "@/models/DrawModel";
import User from "@/models/UserModel";
export async function POST(request: NextRequest) {

  try {
    await connectMongoDB();
    let {
        game_id, 
        product_id, 
        user_id, invoice_number, 
        invoice_date, 
        vat, 
        total_amount, 
        invoice_status,
        ticket_details
    } = await request.json();

    let draw = await Draw.find(
        {game_id: game_id},
        {draw_type: 'games'}
    ).sort({'draw_date': -1}).limit(1);

    let user = await User.findOne({_id: user_id}).select(['_id', 'city', 'country'])

    if(draw && draw.length > 0) {

        let draw_id = draw[0]._id.toString();
        let invoiceDocument = {
            game_id: game_id,
            product_id: product_id, 
            user_id: user_id, 
            draw_id: draw_id,
            invoice_number: invoice_number, 
            invoice_date: invoice_date, 
            vat: vat, 
            total_amount: total_amount, 
            invoice_status: invoice_status,
            invoice_type: 'game',
            user_city: user.city,
            user_country: user.country
        }

        let invoiceResult = await Invoice.create(invoiceDocument);

        console.log(invoiceResult)

        if(invoiceResult && invoiceResult._id) {
            for(var i = 0; i < ticket_details.length; i++) {
                ticket_details[i]["invoice_id"] = invoiceResult._id;
            }

            let ticketResult = await Ticket.insertMany(ticket_details);

            return NextResponse.json({
                message: "query successful ....",
                invoiceResult: invoiceResult,
                ticketResult: ticketResult
            }, {status: 200});
        }
    } else {
        return NextResponse.json({
            message: "no draw found ....",
        }, {status: 500});
    }

    //let {ticket_details} = await request.json();


    } catch (error) {
        return NextResponse.json({
          message: "error query ....",
          error: error
        }, {status: 500});
    }
}

