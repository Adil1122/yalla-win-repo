import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";

import Product from "@/models/ProductModel";
import Draw from "@/models/DrawModel";
import Winner from "@/models/WinnerModel";
import mongoose from "mongoose";
import Game from "@/models/GameModel";

export async function GET(request: any) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var search = searchparams.get('search') + '';

        var yalla_3_obj = await Game.find({name: 'Yalla 3'}).select('_id').limit(1)
        var yalla_4_obj = await Game.find({name: 'Yalla 4'}).select('_id').limit(1)
        var yalla_6_obj = await Game.find({name: 'Yalla 6'}).select('_id').limit(1)

        const game_winners = await Winner
        .aggregate([
            {
                $match:
                {
                    game_id: { $ne: null },
                }
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
        ]).sort({'winning_date': -1}).limit(1);

        const product_winners = await Winner
        .aggregate([
            {
                $match:
                {
                    prize_id: { $ne: null }    
                }
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
        ]).sort({'winning_date': -1}).limit(4);

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

        const game_draws = await Draw
              .find({
                        $and: [
                            {draw_type: 'games'},
                            {
                                draw_date: {
                                    $gt : new Date(),
                                }
                            }
                        ]}
                ).select(['_id', 'product_id']).sort({'draw_date': -1}).limit(3);

        const prize_draws = await Draw
            .find({
                $and: [
                    {draw_type: 'products'},
                    {
                        draw_date: {
                            $gt : new Date(),
                        }
                    }
                ]
            }).select(['_id', 'product_id']).sort({'draw_date': -1}).limit(4);
        

        var products_with_game = []

        if(game_draws.length > 0) {

            var game_product_ids = []

            for(var i = 0; i < game_draws.length; i++) {
                game_product_ids.push(game_draws[i].product_id)
            }

            console.log('game_product_ids: ', game_product_ids)

            products_with_game = await Product
            .aggregate([
                {
                    $match:
                    {

                        $and: [ 
                            //{ _id: { $in: game_product_ids } }, 
                            { game_id: { $ne: null } }, 
                            {
                                game_name: {
                                    //$in : [new mongoose.Types.ObjectId('66b7739a5be99f25dc381535'), new mongoose.Types.ObjectId('66b773b15be99f25dc381536'), new mongoose.Types.ObjectId('66b773c55be99f25dc381537')], 
                                    $in : ['Yalla 3', 'Yalla 4', 'Yalla 6'], 
                                }
                            }, 
                            {
                        $or: [ 
                            {name: { $regex: '.*' + search + '.*', $options: 'i' }},
                            {price: { $regex: '.*' + search + '.*', $options: 'i' }},
                            {vat: { $regex: '.*' + search + '.*', $options: 'i' }},
                        ]}]
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
        }

        var products_with_prize = []
        
        if(prize_draws.length > 0) {

            var prize_product_ids = []

            for(var i = 0; i < prize_draws.length; i++) {
                prize_product_ids.push(prize_draws[i].product_id)
            }

            console.log('prize_product_ids: ', prize_product_ids)

            products_with_prize = await Product
            .aggregate([
                {
                    $match:
                    {
                        $and: [ 
                            //{_id: {$in: prize_product_ids}},
                            { prize_id: { $ne: null } },  
                            {
                        $or: [ 
                            {name: { $regex: '.*' + search + '.*', $options: 'i' }},
                            {price: { $regex: '.*' + search + '.*', $options: 'i' }},
                            {vat: { $regex: '.*' + search + '.*', $options: 'i' }},
                        ]}]
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


            
        return NextResponse.json({
            messge: "mobile app query successful ....",
            game_winners: game_winners,
            product_winners: product_winners,
            products_with_game: products_with_game,
            products_with_prize: products_with_prize,
            yalla_3_top_winner: yalla_3_top_winner,
            yalla_4_top_winner: yalla_4_top_winner,
            yalla_6_top_winner: yalla_6_top_winner,
            }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: error
          }, {status: 500});
    }

}


export async function POST(request: Request) {
    const {name, image, price, stock, vat, currency, category_id, game_id} = await request.json();
    await connectMongoDB();
    const product_json = {name, image, price, stock, vat, currency, category_id, game_id};
    await Product.create(product_json);
    return NextResponse.json({messge: "product successfully added"}, {status: 200});
}