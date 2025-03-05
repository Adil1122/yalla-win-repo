import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Game from "@/models/GameModel";
import mongoose from "mongoose";
import Draw from "@/models/DrawModel";

import Product from "@/models/ProductModel";
//import Draw from "@/models/DrawModel";
import Winner from "@/models/WinnerModel";

export async function GET(request: any) {

   
    try {
        await connectMongoDB();

        var yalla_3_obj = await Game.find({name: 'Yalla 3'}).select('_id').limit(1)
        var yalla_4_obj = await Game.find({name: 'Yalla 4'}).select('_id').limit(1)
        var yalla_6_obj = await Game.find({name: 'Yalla 6'}).select('_id').limit(1)

        /*const upcoming_draws = await Draw
            .aggregate([
                {
                    $match: { draw_date: { $gte: new Date() } },
                },
                {
                    $lookup: {
                        from: 'games',
                        localField: "game_id",
                        foreignField: "_id",
                        as: "drawsWithGames",
                    }
                }
            ]).sort({'draw_date': -1}).limit(10);*/

            const game_draws = await Draw
              .aggregate([
                  {
                      $match: {
                        $and: [
                            {draw_type: 'games'},
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
                            {draw_type: 'products'},
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

        const game_winners = await Winner
        .aggregate([
            {
                $match: { game_id: { $ne: null } },
            },
            {
                $lookup: {
                    from: 'games',
                    localField: "game_id",
                    foreignField: "_id",
                    as: "winnersWithGames",
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "user_id",
                    foreignField: "_id",
                    as: "winnersWithUsers",
                }
            },
            {
                $lookup: {
                    from: 'tickets',
                    localField: "ticket_id",
                    foreignField: "_id",
                    as: "winnersWithTickets",
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "product_id",
                    foreignField: "_id",
                    as: "winnersWithProducts",
                }
            }
        ]).sort({'winning_date': -1}).limit(10);

        const product_winners = await Winner
        .aggregate([
            {
                $match: { prize_id: { $ne: null } },
            },
            {
                $lookup: {
                    from: 'prizes',
                    localField: "prize_id",
                    foreignField: "_id",
                    as: "winnersWithPrizes",
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "user_id",
                    foreignField: "_id",
                    as: "winnersWithUsers",
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "product_id",
                    foreignField: "_id",
                    as: "winnersWithProducts",
                }
            }
        ]).sort({'winning_date': -1}).limit(10);

        var products_with_game = []
        var products_with_prize = []

        if(yalla_3_obj.length > 0 && yalla_4_obj.length > 0 && yalla_6_obj.length > 0) {

           products_with_game = await Product
           .aggregate([
               {
                   $match:
                   {
   
                       $and: [ 
                           { game_id: { $ne: null } }, 
                           { status: "Active" }, 
                           {
                               game_id: {
                                   $in : [new mongoose.Types.ObjectId(yalla_3_obj[0]._id), new mongoose.Types.ObjectId(yalla_4_obj[0]._id), new mongoose.Types.ObjectId(yalla_6_obj[0]._id)], 
                               }
                           }]
                   }
               },
               {
                   $lookup: {
                       from: "games",
                       localField: "game_id",
                       foreignField: "_id",
                       as: "productWithGame",
                   },
               }
           ]).sort({'name': 1}).limit(3);
   
           products_with_prize = await Product
               .aggregate([
                  {
                     $match:
                     {
                         $and: [ 
                             { prize_id: { $ne: null } },  
                             { status: "Active" }
                        ]
                     }
                 },
                   {
                       $lookup: {
                           from: "prizes",
                           localField: "prize_id",
                           foreignField: "_id",
                           as: "productWithPrize",
                       },
                   }
               ]).sort({'name': 1}).limit(4);
        }


            var yalla_3_top_winner = []
            if(yalla_3_obj.length > 0) {
                yalla_3_top_winner = await Winner
                .aggregate([
                    {
                        $match:
                            {
                                game_id: yalla_3_obj[0]._id
                            }
                    },
                    {
                        $lookup: {
                            from: 'tickets',
                            localField: "ticket_id",
                            foreignField: "_id",
                            as: "winnersWithTickets",
                        }
                    }
    
                ]).sort({'winning_date': -1}).limit(1);
            }
    
    
            var yalla_4_top_winner = []
            if(yalla_4_obj.length > 0) {
                yalla_4_top_winner = await Winner
                .aggregate([
                    {
                        //$match: { game_name: 'Yalla 4' },
                        $match:
                            {
                                game_id: yalla_4_obj[0]._id
                            }
                    },
                    {
                        $lookup: {
                            from: 'tickets',
                            localField: "ticket_id",
                            foreignField: "_id",
                            as: "winnersWithTickets",
                        }
                    }
                ]).sort({'winning_date': -1}).limit(1);
            }
    
            var yalla_6_top_winner = []
            if(yalla_6_obj.length > 0) {
                yalla_6_top_winner = await Winner
                .aggregate([
                    {
                        $match:
                            {
                                game_id: yalla_6_obj[0]._id
                            }
                    },
                    {
                        $lookup: {
                            from: 'tickets',
                            localField: "ticket_id",
                            foreignField: "_id",
                            as: "winnersWithTickets",
                        }
                    },
                    
                ]).sort({'winning_date': -1}).limit(1);
            }
;    


            
        return NextResponse.json({
            messge: "query successful ....",
            //upcoming_draws: upcoming_draws,
            game_winners: game_winners,
            product_winners: product_winners,
            products_with_game: products_with_game,
            products_with_prize: products_with_prize,
            yalla_3_top_winner: yalla_3_top_winner,
            yalla_4_top_winner: yalla_4_top_winner,
            yalla_6_top_winner: yalla_6_top_winner,
            game_draws: game_draws,
            prize_draws: prize_draws,
            }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: error instanceof Error ? error.message : JSON.stringify(error)
          }, {status: 500});
    }

}