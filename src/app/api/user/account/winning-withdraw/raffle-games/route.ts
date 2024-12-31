import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import mongoose from "mongoose";
import Winner from "@/models/WinnerModel";
import { total_records_limit } from "@/libs/common";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        var platform_type = searchparams.get('platform_type') + '';
        var limit = total_records_limit;
        var skip = 0;
        if(platform_type === 'web') {
            limit = parseInt(searchparams.get('limit') + '');
            skip = parseInt(searchparams.get('skip') + '');
        }
        const winners = await Winner
              .aggregate([
                  {
                      $match: { 
                        //user_id: new mongoose.Types.ObjectId(user_id), game_id: {$ne: null}
                        $and: [
                            {user_id: new mongoose.Types.ObjectId(user_id)}, 
                            {game_id: {$ne: null}}
                        ]
                      },
                  },
                  {
                      $lookup: {
                         from: "products",
                         localField: "product_id",
                         foreignField: "_id",
                         as: "productInWinner",
                      },
                  },
                  {
                        $lookup: {
                            from: "draws",
                            localField: "draw_id",
                            foreignField: "_id",
                            as: "drawInWinner",
                        },
                   },
                   {
                        $lookup: {
                            from: "invoices",
                            localField: "invoice_id",
                            foreignField: "_id",
                            as: "invoiceInWinner",
                        },
                   },
                   {
                        $lookup: {
                            from: "games",
                            localField: "game_id",
                            foreignField: "_id",
                            as: "gameInWinner",
                        },
                    }
              ]).sort({'createdAt': -1}).skip(skip).limit(limit);

            if(winners && winners.length > 0) {
            return NextResponse.json({
                message: "query successful ....",
                winners: winners
            }, {status: 200});
            
            } else {
                return NextResponse.json({
                    message: "winners not found ....",
                }, {status: 500});
            }
      } catch (error) {
          return NextResponse.json({
            message: "error query ....",
            error: error
          }, {status: 500});
      }
  }

  export async function OPTIONS(request: NextRequest) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        const winner_count = await Winner.find({
            $and: [
                {user_id: new mongoose.Types.ObjectId(user_id)}, 
                {game_id: {$ne: null}}
            ]
        }).countDocuments()

        return NextResponse.json({
            message: "query successful ....",
            winner_count: winner_count
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            message: "query successful ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
  }