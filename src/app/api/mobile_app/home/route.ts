import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";

import Product from "@/models/ProductModel";
import Draw from "@/models/DrawModel";
import Winner from "@/models/WinnerModel";
import mongoose from "mongoose";

export async function GET(request: any) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var search = searchparams.get('search') + '';

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

        const yalla_3_top_winner = await Winner
        .aggregate([
            {
                $match:
                    {
                        game_name: 'Yalla 3'
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


        const yalla_4_top_winner = await Winner
        .aggregate([
            {
                //$match: { game_name: 'Yalla 4' },
                $match:
                    {
                        game_name: 'Yalla 4'
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

        const yalla_6_top_winner = await Winner
        .aggregate([
            {
                $match:
                    {
                        game_name: 'Yalla 6'
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

        const products_with_game = await Product
            .aggregate([
                {
                    $match:
                    {
                       $and: [
                        {game_id: { $ne: null }},
                        {
                            game_name: {
                                //$in : [new mongoose.Types.ObjectId('66b7739a5be99f25dc381535'), new mongoose.Types.ObjectId('66b773b15be99f25dc381536'), new mongoose.Types.ObjectId('66b773c55be99f25dc381537')], 
                                $in : ['Yalla 3', 'Yalla 4', 'Yalla 6'], 
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
            ]).sort({'createdAt': -1}).limit(3);

        const products_with_prize = await Product
            .aggregate([
                {
                    $match:
                    {
                        prize_id: { $ne: null }
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
            ]).sort({'createdAt': -1}).limit(4);


            
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