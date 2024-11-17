import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Favourite from "@/models/FavouriteNodel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var limit = parseInt(searchparams.get('limit') + '');
        var skip = parseInt(searchparams.get('skip') + '');

        const favourites = await Favourite
              .aggregate([
                  {
                      $lookup: {
                          from: "users",
                          localField: "user_id",
                          foreignField: "_id",
                          as: "userInFavourite",
                      },
                  },
                  {
                    $lookup: {
                        from: "draws",
                        localField: "draw_id",
                        foreignField: "_id",
                        as: "drawInFavourite",
                    },
                  }
              ]).sort({'createdAt': -1}).skip(skip).limit(limit);

        
        return NextResponse.json({
            message: "query successful ....",
            favourites: favourites
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
        const favourite_count = await Favourite.find().countDocuments()
        return NextResponse.json({
            message: "query successful ....",
            favourite_count: favourite_count
            }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            message: "query error ....",
            error: JSON.stringify(error)
            }, {status: 500});
    }
}