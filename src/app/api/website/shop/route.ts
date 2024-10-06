import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";

import Product from "@/models/ProductModel";
//import Draw from "@/models/DrawModel";
import Winner from "@/models/WinnerModel";

export async function GET(request: any) {

    try {
        await connectMongoDB();

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

        const products_with_game = await Product
            .aggregate([
                {
                    $lookup: {
                        from: "games",
                        localField: "game_id",
                        foreignField: "_id",
                        as: "productWithGame",
                    },
                }
            ]).sort({'createdAt': -1}).limit(10);

        const products_with_prize = await Product
            .aggregate([
                {
                    $lookup: {
                        from: "prizes",
                        localField: "prize_id",
                        foreignField: "_id",
                        as: "productWithPrize",
                    },
                }
            ]).sort({'createdAt': -1}).limit(10);

            const yalla_3_top_winner = await Winner
        .aggregate([
            {
                $match: { game_name: 'Yalla 3' },
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
                $match: { game_name: 'Yalla 4' },
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
                $match: { game_name: 'Yalla 6' },
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
            yalla_6_top_winner: yalla_6_top_winner
            }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: error
          }, {status: 500});
    }

}