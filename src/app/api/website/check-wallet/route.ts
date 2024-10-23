//import Product from "@/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import mongoose from "mongoose";
import Wallet from "@/models/WalletModel";
import UserModel from "@/models/UserModel";
export async function GET(request: NextRequest) {

  try {
      await connectMongoDB();
      var url = new URL(request.url);
      var searchparams = new URLSearchParams(url.searchParams);
      var user_id_value = searchparams.get('user_id') + '';
      var total_amount = searchparams.get('total_amount') + '';
      let wallet = await Wallet.find({
        user_id: new mongoose.Types.ObjectId(user_id_value)
      }).limit(1);

      var user: any = await UserModel.findOne({_id: user_id_value}).select(['_id', 'role'])

      if(user && user.role === 'merchant') {
        return NextResponse.json({
          message: "Sufficient Funds Available in Your Wallet",
          result: wallet
        }, {status: 200});
      }

      if(wallet && wallet.length > 0) {
        if(wallet.length > 0) {
          if(parseFloat(wallet[0].amount) >= parseFloat(total_amount)) {
              return NextResponse.json({
                  message: "Sufficient Funds Available in Your Wallet",
                  result: wallet
                }, {status: 200});
          } else {
              return NextResponse.json({
                  message: "Insufficient Funds Available in your Wallet",
                  result: wallet
                }, {status: 201});
          }
        }
      } else {
        return NextResponse.json({
            message: "No Wallet added in your Account, Add Wallet First.",
          }, {status: 500});
      }

    } catch (error) {
        return NextResponse.json({
          message: "Server query ....",
        }, {status: 500});
    }
}

