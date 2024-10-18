import { NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongoosdb"
import Winner from "@/models/WinnerModel"

export async function GET(request: Request) {
   try {
        
      await connectMongoDB()
      const url = new URL(request.url)
      const searchparams = new URLSearchParams(url.searchParams)
      const pipeline = [
         {
            $lookup: {
               from: "invoices",
               localField: "invoice_id",
               foreignField: "_id",
               as: "WinnerInvoice",
            },
         },
         {
            $lookup: {
               from: "tickets",
               localField: "ticket_id", 
               foreignField: "_id",
               as: "TicketDetails",
            },
         },
         {
            $lookup: {
               from: "products",
               localField: "product_id", 
               foreignField: "_id",
               as: "ProductDetails",
            },
         },
         {
            $lookup: {
               from: "prizes",
               localField: "prize_id", 
               foreignField: "_id",
               as: "PrizeDetails",
            },
         }
      ]

      const winners = await Winner.aggregate(pipeline)

      if(winners && winners.length > 0) {
         var ids = []
         for(var i = 0; i < winners.length; i++) {
            ids.push(winners[i]._id)
         }

         return NextResponse.json({
            messge: "Query success ....",
            winners: winners,
         }, {status: 200})

      } else {
         return NextResponse.json({
            messge: "Query success ....",
            winners: [],
         }, {status: 200})
      }

   } catch (error) {
      return NextResponse.json({
         messge: "Query error ....",
         error: JSON.stringify(error)
      }, {status: 500})
   }
}

export async function DELETE(request: Request) {
   try {
       await connectMongoDB()
       var url = new URL(request.url)
       var searchparams = new URLSearchParams(url.searchParams)
       var id: any = searchparams.get('id') + ''
       var deleteRecord = await Winner.deleteOne({_id: id})
       if(deleteRecord) {
           return NextResponse.json({
               messge: "Winner record deleted successfully ....",
               deletedRecord: deleteRecord
           }, {status: 200})
       } else {
           return NextResponse.json({
               messge: "Record could not be deleted ....",
           }, {status: 500})
       }
   } catch(error) {
       return NextResponse.json({
           messge: "Record could not be deleted ....",
       }, {status: 500})
   }
} 