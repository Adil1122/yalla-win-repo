import Product from "@/models/ProductModel";
import Offer from "@/models/OfferModel";
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
      //let query = { _id: new mongoose.Types.ObjectId(product_id) };
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
            ]).sort({'createdAt': -1}).limit(1);

        if(product_with_game && product_with_game.length > 0) {

            var current_date = new Date().toISOString().slice(0, 10)
            var offer = await Offer
            .find({
                $and: [
                    {
                        platform_type: 'app-web',
                    },
                    {
                        offer_type: 'games'
                    },
                    {
                        product_id: product_id
                    },
                    {
                        status: 'active'
                    },
                    {
                        expiry_date: {
                            $gte: new Date(current_date)
                        }
                    }
                ]
            }).sort({createdAt: -1}).limit(1)

            return NextResponse.json({
                message: "query successful ....",
                result: product_with_game,
                offer: offer
              }, {status: 200});

        } else {
            return NextResponse.json({
                message: "not found ....",
              }, {status: 500});
        }    
    } catch (error) {
        return NextResponse.json({
          message: "error query ....",
          error: error
        }, {status: 500});
    }
}

