import { NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongoosdb"
import Winner from "@/models/WinnerModel"
import { getStartEndDates } from "@/libs/common"

export async function GET(request: Request) {
   try {

      await connectMongoDB()
      const url = new URL(request.url)
      const searchparams = new URLSearchParams(url.searchParams)
      const winnerType : string = searchparams.get('winner_type') || 'shop'
      const winnerSubType : string = searchparams.get('winner_sub_type') || 'games'
      const schedule : string = searchparams.get('schedule') || 'daily'
      const skip : number = parseInt(searchparams.get('skip') || '0')   
      const limit : number = parseInt(searchparams.get('limit') || '5')

      var daily_start_date = new Date().toISOString().slice(0, 10)
      var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      var end_date = tomorrowDate.toISOString().slice(0, 10);
      var weekly_start_date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      var monthly_start_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      
      let startDate : any;
      if (schedule === "daily") {
         startDate = daily_start_date;
      } else if (schedule === "weekly") {
         startDate = weekly_start_date;
      } else if (schedule === "monthly") {
         startDate = monthly_start_date;
      }

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
               from: "products",
               localField: "product_id",
               foreignField: "_id",
               as: "ProductDetails",
            },
         },
         {
            $lookup: {
               from: "games",
               localField: "game_id",
               foreignField: "_id",
               as: "GameDetails",
            },
         },
         {
            $match: {
               platform_type: winnerType,
               ...(winnerSubType === "games" && { game_id: { $ne: null } }),
               ...(winnerSubType === "products" && { prize_id: { $ne: null } }),
               winning_date: { $gte: new Date(startDate), $lt: new Date(end_date) } 
            }
         }
      ]

      if (winnerSubType === "games") {
         pipeline.push(
            {
               $lookup: {
                  from: "tickets",
                  localField: "ticket_id",
                  foreignField: "_id",
                  as: "TicketDetails",
               },
            }
         )
      }
      
      if (winnerSubType === "products") {
         pipeline.push({
            $lookup: {
               from: "prizes",
               localField: "prize_id",
               foreignField: "_id",
               as: "PrizeDetails",
            },
         })
      }

      const winners = await Winner.aggregate(pipeline).sort({'winning_date': 'desc'}).skip(skip).limit(limit)

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

export async function OPTIONS(request: Request) {
   try {
      await connectMongoDB()

      const url = new URL(request.url)
      const searchparams = new URLSearchParams(url.searchParams)
      const schedule : string = searchparams.get('schedule') || 'daily'

      var daily_start_date = new Date().toISOString().slice(0, 10)
      var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      var end_date = tomorrowDate.toISOString().slice(0, 10);
      var weekly_start_date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      var monthly_start_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      
      let startDate : any;
      if (schedule === "daily") {
         startDate = daily_start_date;
      } else if (schedule === "weekly") {
         startDate = weekly_start_date;
      } else if (schedule === "monthly") {
         startDate = monthly_start_date;
      }
      
      var shop_game_winners_count = await Winner.find({
         platform_type: 'shop',
         game_id: {$ne: null},
         winning_date: { $gte: new Date(startDate), $lt: new Date(end_date) } 
      }).countDocuments()

      var shop_prize_winners_count = await Winner.find({
         platform_type: 'shop',
         prize_id: {$ne: null},
         winning_date: { $gte: new Date(startDate), $lt: new Date(end_date) } 
      }).countDocuments();

      var app_game_winners_count = await Winner.find({
         platform_type: 'app',
         game_id: {$ne: null},
         winning_date: { $gte: new Date(startDate), $lt: new Date(end_date) } 
      }).countDocuments();

      var app_prize_winners_count = await Winner.find({
         platform_type: 'app',
         prize_id: {$ne: null},
         winning_date: { $gte: new Date(startDate), $lt: new Date(end_date) } 
      }).countDocuments();
      
      var web_game_winners_count = await Winner.find({
         platform_type: 'web',
         game_id: {$ne: null},
         winning_date: { $gte: new Date(startDate), $lt: new Date(end_date) } 
      }).countDocuments();

      var web_prize_winners_count = await Winner.find({
         platform_type: 'web',
         prize_id: {$ne: null},
         winning_date: { $gte: new Date(startDate), $lt: new Date(end_date) } 
      }).countDocuments();

      return NextResponse.json({
         messge: "query successful ....",
         shop_game_winners_count: shop_game_winners_count,
         shop_prize_winners_count: shop_prize_winners_count,
         app_game_winners_count: app_game_winners_count,
         app_prize_winners_count: app_prize_winners_count,
         web_game_winners_count: web_game_winners_count,
         web_prize_winners_count: web_prize_winners_count
      }, {status: 200});

   } catch (error) {
       return NextResponse.json({
           messge: "query error ....",
           error: JSON.stringify(error)
       }, {status: 200});
   }
   
}