import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Favourite from "@/models/FavouriteNodel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();

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
              ]).sort({'createdAt': -1}).limit(100);

        
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