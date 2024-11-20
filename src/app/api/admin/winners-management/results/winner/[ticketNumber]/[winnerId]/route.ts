import { NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongoosdb"
import mongoose from "mongoose"
import WinnerModel from "@/models/WinnerModel"

export async function GET(request: Request, { params }: { params: { ticketNumber: string; winnerId: string } }) {

   try {
      
      await connectMongoDB()

      const { ticketNumber, winnerId } = params
      const winner = await WinnerModel.aggregate(getPipeline(winnerId))
      return NextResponse.json({winner: winner}, {status: 200})
   } catch (error) {
      return NextResponse.json({message: error}, {status: 500})
   }
}

const getPipeline = (winnerId: string) => {

   let pipeline : any = []

   pipeline = [
      {
         $lookup: {
            from: "tickets",
            localField: "ticket_id",
            foreignField: "_id",
            as: "TicketDetails",
         }
      },
      {
         $unwind: "$TicketDetails",
      },
      {
         $lookup: {
            from: "games",
            localField: "game_id",
            foreignField: "_id",
            as: "GameDetails",
         }
      },
      {
         $unwind: {
            path: "$GameDetails",
         }
      },
      {
         $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "UserDetails",
         },
      },
      {
         $unwind: "$UserDetails",
      },
      {
         $match: {
            _id: new mongoose.Types.ObjectId(winnerId),
         },
      },
      {
         $project: {
            _id: 1,
            animation_video: 1,
            createdAt: 1,
            prize_amount: 1,
            "GameDetails.name": 1,
            "UserDetails.first_name": 1,
            "UserDetails.last_name": 1,
            "UserDetails.image": 1,
            "TicketDetails.ticket_number": 1,
            "TicketDetails.ticket_splitted": 1
         }
      }
   ]

   return pipeline
}