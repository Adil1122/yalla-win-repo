import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import mongoose from "mongoose";
import Winner from "@/models/WinnerModel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        const winners = await Winner
              .aggregate([
                  {
                      $match: { user_id: new mongoose.Types.ObjectId(user_id), prize_id: {$ne: null}  },
                  },
                  {
                        $lookup: {
                            from: "prizes",
                            localField: "prize_id",
                            foreignField: "_id",
                            as: "prizeInWinner",
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
              ]).sort({'createdAt': -1}).limit(100);

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