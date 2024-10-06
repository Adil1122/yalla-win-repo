import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Draw from "@/models/DrawModel";
import Wallet from "@/models/WalletModel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        var wallet = await Wallet.findOne({'user_id': user_id});

        var yalla_3_draw = await Draw.find({
            game_name: 'Yalla 3',
            draw_date: {
                $gt : new Date()
            }
        }).select('draw_date').sort({'draw_date': -1}).limit(1);

        var yalla_4_draw = await Draw.find({
            game_name: 'Yalla 4',
            draw_date: {
                $gt : new Date()
            }
        }).select('draw_date').sort({'draw_date': -1}).limit(1);
        var yalla_6_draw = await Draw.find({
            game_name: 'Yalla 6',
            draw_date: {
                $gt : new Date()
            }
        }).select('draw_date').sort({'draw_date': -1}).limit(1);

        var prize_draws = await Draw
              .aggregate([
                  {
                      $match: {
                        $and: [
                            {draw_type: 'prize'},
                            {
                                draw_date: {
                                    $gte : new Date()
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
                  {
                    $lookup: {
                        from: "prizes",
                        localField: "prize_id",
                        foreignField: "_id",
                        as: "prizeInDraw",
                    },
                  }
              ]).sort({'createdAt': -1}).limit(100);


        return NextResponse.json({
            message: "query successful ....",
            yalla_3_draw: yalla_3_draw,
            yalla_4_draw: yalla_4_draw,
            yalla_6_draw: yalla_6_draw,
            prize_draws: prize_draws,
            wallet: wallet
            }, {status: 200});
        

    } catch(error) {
        return NextResponse.json({
            message: "query error ....",
          }, {status: 500});
    }
}