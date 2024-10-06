import Product from "@/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import mongoose from "mongoose";
export async function GET(request: NextRequest) {

  try {
      await connectMongoDB();
      var url = new URL(request.url);
      var searchparams = new URLSearchParams(url.searchParams);
      var product_id = searchparams.get('id') + '';
      let query = { _id: new mongoose.Types.ObjectId(product_id) };
      const product_with_game = await Product
            .aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(product_id)  },
                },
                {
                    $lookup: {
                        from: "games",
                        localField: "game_id",
                        foreignField: "_id",
                        as: "productWithGame",
                    },
                }
            ]).sort({'createdAt': -1}).limit(10);

      return NextResponse.json({
          message: "query successful ....",
          result: product_with_game
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({
          message: "error query ....",
          error: error
        }, {status: 500});
    }
}

