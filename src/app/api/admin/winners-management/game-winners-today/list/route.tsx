import { NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongoosdb"
import mongoose, { PipelineStage } from "mongoose"
import Winner from "@/models/WinnerModel"

export async function GET(request: Request) {
   try {
        await connectMongoDB()

        const url = new URL(request.url)
        const searchparams = new URLSearchParams(url.searchParams)
        const gameId : string = searchparams.get('game') + ''

        var startDate = new Date().toISOString().slice(0, 10)
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        var endDate = tomorrowDate.toISOString().slice(0, 10)

        const pipeline = [
            {
                $lookup: {
                    from: "games",
                    localField: "game_id",
                    foreignField: "_id",
                    as: "GameDetails",
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
                $match: {
                    game_id: new mongoose.Types.ObjectId(gameId),
                    winning_date: { $gte: new Date(startDate), $lt: new Date(endDate) } 
                }
            }
        ]

        const winners = await Winner.aggregate(pipeline).sort({'winning_date': 'desc'})
        
        return NextResponse.json({
            message: "Query successful ....",
            items: winners
        }, {status: 200})

   } catch (error) {
      console.log(error)
       return NextResponse.json({
           message: "Query error ....",
           error: JSON.stringify(error)
       }, {status: 500})
   }
}
