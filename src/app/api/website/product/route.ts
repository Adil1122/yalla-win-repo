import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";

import Product from "@/models/ProductModel";
import mongoose from "mongoose";
import Draw from "@/models/DrawModel";

export async function GET(request: any) { 

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';

        const game_draws = await Draw
              .aggregate([
                  {
                      $match: {
                        $and: [
                            {draw_type: 'game'},
                            {
                                draw_date: {
                                    $gt : new Date(), 
                                    //$lt: new Date(tomorrow)
                                }
                            }
                        ]

                      },
                  },
                  {
                    $lookup: {
                        from: "products",
                        localField: "product_id",
                        foreignField: "_id",
                        as: "productInDraw",
                    },
                  },
              ]).sort({'draw_date': -1}).limit(3);

              const prize_draws = await Draw
              .aggregate([
                  {
                      $match: {
                        $and: [
                            {draw_type: 'prize'},
                            {
                                draw_date: {
                                    $gt : new Date(), 
                                    //$lt: new Date(tomorrow)
                                }
                            }
                        ]

                      },
                  },
                  {
                    $lookup: {
                        from: "products",
                        localField: "product_id",
                        foreignField: "_id",
                        as: "productInDraw",
                    },
                  },
              ]).sort({'draw_date': -1}).limit(4);

        const product_with_prize = await Product
            .aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) },
                },
                {
                    $lookup: {
                        from: "prizes",
                        localField: "prize_id",
                        foreignField: "_id",
                        as: "productWithPrize",
                    },
                }
            ]).sort({'createdAt': -1}).limit(1);
;    
        return NextResponse.json({
            messge: "query successful ....",
            product_with_prize: product_with_prize,
            game_draws: game_draws,
            prize_draws: prize_draws
            }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: error
          }, {status: 500});
    }

}