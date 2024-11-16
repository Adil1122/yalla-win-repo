import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Draw from "@/models/DrawModel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        let today = new Date().toISOString().slice(0, 10)
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        var tomorrow = tomorrowDate.toISOString().slice(0, 10);
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var limit = parseInt(searchparams.get('limit') + '');
        var skip = parseInt(searchparams.get('skip') + '');

        console.log(today + '/' + tomorrow)

        const draws = await Draw
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
              ]).sort({'draw_date': -1}).skip(skip).limit(limit);

        
        return NextResponse.json({
            message: "query successful ....",
            draws: draws
            }, {status: 200});
        

    } catch(error) {
        return NextResponse.json({
            message: "query error ....",
          }, {status: 500});
    }
}

export async function OPTIONS(request: NextRequest) {
    try {

        await connectMongoDB();
        //let today = new Date().toISOString().slice(0, 10)
        //var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        //var tomorrow = tomorrowDate.toISOString().slice(0, 10);
        const draw_count = await Draw.find({
            $and: [
                {draw_type: 'products'},
                {
                    draw_date: {
                        $gt : new Date()
                    }
                }
            ]
        }).countDocuments()

        return NextResponse.json({
            message: "query successful ....",
            draw_count: draw_count
            }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            message: "query error ....",
            error: JSON.stringify(error)
            }, {status: 200});
    }
}