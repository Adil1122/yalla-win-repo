import { NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongoosdb"
import mongoose, { PipelineStage } from "mongoose"
import WinnerTodayModel from "@/models/WinnerTodayModel"

export async function GET(request: Request) {
   try {
        await connectMongoDB()

         const today = new Date();
         today.setUTCHours(0, 0, 0, 0); // Start of today in UTC
         const tomorrow = new Date(today);
         tomorrow.setUTCDate(today.getUTCDate() + 1); // Start of tomorrow in UTC

         const pipeline: PipelineStage[] = getPipeline(today, tomorrow)
         const winners = await WinnerTodayModel.aggregate(pipeline)

         return NextResponse.json({
               message: "Query successful ....",
               items: winners,
               date: today + ":" + tomorrow
         }, {status: 200})

   } catch (error) {
      console.log(error)
       return NextResponse.json({
           message: "Query error ....",
           error: JSON.stringify(error)
       }, {status: 500})
   }
}

const getPipeline = (today: any, tomorrow: any): PipelineStage[] => {
   
   return [
      {
         $match: {
            "winning_date": { $gte: today, $lt: tomorrow }, // Winners for today
            "game_id": { $exists: true, $ne: null } // Ensure game_id is not null
         }
      } as PipelineStage,
      {
         $lookup: {
            from: "games",
            localField: "game_id",
            foreignField: "_id",
            as: "GameDetails",
         }
      } as PipelineStage, 
      { $unwind: "$GameDetails" } as PipelineStage,
      { $sort: { winning_date: -1 } } as PipelineStage, // Sort by latest winner
      {
         $group: {
            _id: "$game_id", // Group by game_id
            latestWinner: { $first: "$$ROOT" } // Pick the latest winner per game
         }
      } as PipelineStage,
      {
         $replaceRoot: { newRoot: "$latestWinner" } // Flatten the structure
      } as PipelineStage,
      {
         $project: {
            _id: 1,
            game_id: 1,
            winning_date: 1,
            winning_number: 1,
            "GameDetails.name": 1, // Game Name
         }
      } as PipelineStage
   ]
}
