import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";

import Product from "@/models/ProductModel";
import Draw from "@/models/DrawModel";
import Winner from "@/models/WinnerModel";
import Game from "@/models/GameModel";
import mongoose from "mongoose";
import Update from "@/models/UpdateModel";

export async function GET(request: any) {

    try {
        await connectMongoDB();
        //const categories = Category.find({});
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var search = searchparams.get('search') + '';

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
                $match:
                {
                    $and: [ 
                        { game_id: { $ne: null } },
                        {user_name: { $regex: '.*' + search + '.*', $options: 'i' }}
                    ]
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
                    $and: [ 
                        { prize_id: { $ne: null } },
                        {user_name: { $regex: '.*' + search + '.*', $options: 'i' }}
                    ]
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
                //$match: { game_name: 'Yalla 3' },
                $match:
                    {
                        $and: [ 
                            { game_name: 'Yalla 3' },  
                            {
                        $or: [ 
                            {game_name: { $regex: '.*' + search + '.*', $options: 'i' }}
                        ]}]
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
                        $and: [ 
                            { game_name: 'Yalla 4' },  
                            {
                        $or: [ 
                            {game_name: { $regex: '.*' + search + '.*', $options: 'i' }}
                        ]}]
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
                //$match: { game_name: 'Yalla 6' },
                $match:
                    {
                        $and: [ 
                            { game_name: 'Yalla 6' },  
                            {
                        $or: [ 
                            {game_name: { $regex: '.*' + search + '.*', $options: 'i' }}
                        ]}]
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

        const products_with_prize = await Product
            .aggregate([
                {
                    $match:
                    {
                        $and: [ 
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


            let today = new Date().toISOString().slice(0, 10)
            var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            var tomorrow = tomorrowDate.toISOString().slice(0, 10);

            const todayWinners = await Winner.find({
                winning_date: {
                    $gte : new Date(today), 
                    $lt: new Date(tomorrow)
                } 
            }).countDocuments();
            
            /*const todayWinners = await Winner.find({
                winning_date: {
                    $gte : (new Date).setHours(0, 0, 0, 0), 
                    $lte : (new Date).setHours(23, 59, 59, 999), 
                } 
            }).countDocuments();*/

            const previousWinners = await Winner.find({
                winning_date: {
                    $lt : (new Date).setHours(0, 0, 0, 0), 
                } 
            }).countDocuments(); 

        const home_page_banners: any = await Update.find({type: 'desktop-banners'});  


            
        return NextResponse.json({
            messge: "query successful ....",
            //result: result,
            //upcoming_draws: upcoming_draws,
            game_winners: game_winners,
            product_winners: product_winners,
            products_with_game: products_with_game,
            products_with_prize: products_with_prize,
            yalla_3_top_winner: yalla_3_top_winner,
            yalla_4_top_winner: yalla_4_top_winner,
            yalla_6_top_winner: yalla_6_top_winner,
            todayWinners: todayWinners,
            previousWinners: previousWinners,
            game_draws: game_draws,
            prize_draws: prize_draws,
            home_page_banners: home_page_banners
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