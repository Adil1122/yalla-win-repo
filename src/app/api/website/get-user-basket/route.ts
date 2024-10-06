//import Product from "@/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import mongoose from "mongoose";
import Basket from "@/models/BasketModel";
export async function GET(request: NextRequest) {

  try {
      await connectMongoDB();
      var url = new URL(request.url);
      var searchparams = new URLSearchParams(url.searchParams);
      var user_id = searchparams.get('user_id') + '';
      let query = { _id: new mongoose.Types.ObjectId(user_id) };
      const products_in_basket = await Basket
            .aggregate([
                {
                    $match: { user_id: new mongoose.Types.ObjectId(user_id)  },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "product_id",
                        foreignField: "_id",
                        as: "productInBasket",
                    },
                }
            ]).sort({'createdAt': -1}).limit(10);

      return NextResponse.json({
          message: "query successful ....",
          result: products_in_basket
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({
          message: "error query ....",
          error: error
        }, {status: 500});
    }
}

