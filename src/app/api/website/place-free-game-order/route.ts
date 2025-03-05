//import Product from "@/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
//import mongoose from "mongoose";
import Invoice from "@/models/InvoiceModel";
import Ticket from "@/models/TicketModel";
import Draw from "@/models/DrawModel";
import User from "@/models/UserModel";
import Wallet from "@/models/WalletModel";
import mongoose from "mongoose";
import { getTimeOfTimezone, getSalesCloseTime, convertToDubaiTime } from "@/libs/common";
export async function POST(request: NextRequest) {

  //try {
    await connectMongoDB();

    const currentDateTime = getTimeOfTimezone()
    const [hours, minutes] = currentDateTime.split("T")[1].split(":").map(Number)
    const salesCloseTime = await getSalesCloseTime() 
    const [salesCloseHours, salesCloseMinutes] = salesCloseTime.split(":").map(Number)
    
    let {
        game_id, 
        product_id,
        user_id, 
        invoice_number, 
        invoice_date, 
        vat, 
        total_amount, 
        invoice_status,
        ticket_details,
        platform,
    } = await request.json();

    var user_condition = {_id: user_id}

    try {

    let draw = await Draw.find(
      {
         game_id: game_id,
         draw_type: 'games'
      },
      {
         _id: 1,           
         date_only: 1,
         time_only: 1     
      }
    ).sort({'draw_date': -1}).limit(1);

    let user = await User.findOne(user_condition).select(['_id', 'city', 'country', 'role'])

    if(draw && draw.length > 0) {

      console.log(draw[0])
      console.log(currentDateTime)
      let draw_id = draw[0]._id.toString();
      let draw_date = `${draw[0].date_only}T${draw[0].time_only}:00Z`;
      let invoiceDateObj = new Date(currentDateTime);
      let drawDateObj = new Date(draw_date);
      const [currentDatePart, currentTimePart] = currentDateTime.split("T");

      console.log(draw_date)
      const originalDrawTimePart = draw[0].time_only; 
      const [drawHours, drawMinutes] = originalDrawTimePart.split(":").map(Number);
      
      if (hours > drawHours || (hours === drawHours && minutes > drawMinutes)) {
         
         drawDateObj.setDate(drawDateObj.getDate() + 1);
         //invoiceDateObj.setDate(invoiceDateObj.getDate() + 1);
      }

      const updatedDrawDatePart = drawDateObj.toISOString().split("T")[0];
      draw_date = `${updatedDrawDatePart}T${originalDrawTimePart}`;

      let updatedInvoiceDatePart = invoiceDateObj.toISOString().split("T")[0];
      invoice_date = `${updatedInvoiceDatePart}T${currentTimePart}:00.000Z`; 
      const created_at = invoice_date;

      console.log(invoice_date)

      let invoiceDocument = {
         game_id: game_id,
         product_id: product_id, 
         user_id: user._id.toString(), 
         draw_id: draw_id,
         draw_date: convertToDubaiTime(draw_date),
         invoice_number: invoice_number, 
         invoice_date: invoice_date, 
         vat: vat, 
         total_amount: total_amount, 
         invoice_status: invoice_status,
         invoice_type: 'game',
         user_city: user.city,
         user_country: user.country,
         platform: platform,
         createdAt: created_at
      }
      console.log(invoiceDocument)

      let invoiceResult = await Invoice.create(invoiceDocument);

      console.log(invoiceResult)

      if(invoiceResult && invoiceResult._id) {

         for(var i = 0; i < ticket_details.length; i++) {
               ticket_details[i]["invoice_id"] = invoiceResult._id
               ticket_details[i]["createdAt"] = currentDateTime + ":00.000Z"
         }

         let ticketResult = await Ticket.insertMany(ticket_details);

         if(user && user.role !== 'merchant') {
               let query = { user_id: user._id };
               let walletResult = await Wallet.find(query);
               const updates = {
                  $set: {
                     amount: walletResult[0].amount - total_amount,
                  },
               };
               let walletUpdateResult = await Wallet.updateMany(query, updates);
               if(!walletUpdateResult) {
                  return NextResponse.json({
                     message: "User wallet could not be updated ....",
                     invoiceResult: invoiceResult
                  }, {status: 500});
               }
         }

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
      console.log(error)
        return NextResponse.json({
          message: "error query exception ....",
          error: JSON.stringify(error)
        }, {status: 500});
    }
}

