import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Basket from "@/models/BasketModel";
import mongoose from "mongoose";
export async function POST(request: NextRequest) {

  try {
    await connectMongoDB();
    let {
        product_id, 
        user_id,
        quantity
    } = await request.json();

    let basketDocument = {
        product_id: product_id, 
        user_id: user_id, 
        quantity: quantity
    }

    let basket:any = await Basket.find({
      user_id: new mongoose.Types.ObjectId(user_id + ''),
      product_id: new mongoose.Types.ObjectId(product_id + '')
    }).limit(1);

    if(basket && basket.length > 0) {
      var basket_quantity = basket[0].quantity;
      const query = { 
        _id: new mongoose.Types.ObjectId(basket[0]._id + '')
      };
      const updates = {
        $set: {
          quantity: quantity + basket_quantity,
        },
      };

      let basketResult = await Basket.updateOne(query, updates);

      if(basketResult) {
        return NextResponse.json({
            message: "successful query ....",
            basketResult: basketResult
          }, {status: 200});
      } else {
        return NextResponse.json({
          message: "Could not add to cart ....",
          basketResult: basketResult
        }, {status: 500});
      }

    } else {

      let basketResult = await Basket.create(basketDocument);

      if(basketResult && basketResult._id) {
        return NextResponse.json({
            message: "successful query ....",
            basketResult: basketResult
          }, {status: 200});
      } else {
        return NextResponse.json({
          message: "Could not add to cart ....",
          basketResult: basketResult
        }, {status: 500});
      }
    }


    } catch (error) {
        return NextResponse.json({
          message: "error query ....",
          error: error
        }, {status: 500});
    }
}

