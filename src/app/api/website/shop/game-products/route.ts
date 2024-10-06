import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Product from "@/models/ProductModel";

export async function GET(request: any) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var min_price = parseInt(searchparams.get('min_price') + '');
        var max_price = parseInt(searchparams.get('max_price') + '');
        var sort_by = searchparams.get('sort_by') + '';
        var sort_order = parseInt(searchparams.get('sort_order') + '');
        var sortJson: any = {'sold': sort_order};
        if(sort_by === 'name') {
            sortJson = {'name': sort_order};
        }

        const products_with_game = await Product
            .aggregate([
                {
                    $match:
                    {
                        $and: [ 
                            {price: { $gte: min_price }},
                            {price: { $lte: max_price }},
                        ]
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
            ]).sort(sortJson).limit(20);
;    


            
        return NextResponse.json({
            messge: "query successful ....",
            products_with_game: products_with_game,
            }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: error
          }, {status: 500});
    }

}