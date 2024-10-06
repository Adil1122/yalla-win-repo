import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Winner from "@/models/WinnerModel";

export async function GET(request: any) {

    try {
        await connectMongoDB(); 

        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var min_price = parseInt(searchparams.get('min_price') + '');
        var max_price = parseInt(searchparams.get('max_price') + '');
        var schedule = searchparams.get('schedule') + '';

        var start_date = new Date().toISOString().slice(0, 10)
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        var end_date = tomorrowDate.toISOString().slice(0, 10);

        if(schedule === 'weekly') {
            start_date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        }

        if(schedule === 'monthly') {
            start_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        }

        const game_winners = await Winner
        .aggregate([
            {
                $match: { 
                    $and: [ 
                        {game_id: { $ne: null }},
                        {prize_amount: { $gte: min_price }},
                        {prize_amount: { $lte: max_price }},
                        {
                            winning_date: {
                                $gte : new Date(start_date), 
                                $lt: new Date(end_date)
                            }
                        }
                    ]
                },
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
                $match: { 
                    $and: [ 
                        {prize_id: { $ne: null }},
                        {prize_amount: { $gte: min_price }},
                        {prize_amount: { $lte: max_price }},
                        {
                            winning_date: {
                                $gte : new Date(start_date), 
                                $lt: new Date(end_date)
                            }
                        }
                    ]
                },
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

        
;    


            
        return NextResponse.json({
            messge: "query successful ....",
            game_winners: game_winners,
            product_winners: product_winners,
            }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: error
          }, {status: 500});
    }

}


/*export async function POST(request: Request) {
    const {name, image, price, stock, vat, currency, category_id, game_id} = await request.json();
    await connectMongoDB();
    const product_json = {name, image, price, stock, vat, currency, category_id, game_id};
    await Product.create(product_json);
    return NextResponse.json({messge: "product successfully added"}, {status: 200});
}*/