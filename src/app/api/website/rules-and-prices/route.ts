import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";

import Product from "@/models/ProductModel";
import Game from "@/models/GameModel";

export async function GET(request: any) {
    try {
        await connectMongoDB();
        var games = await Game.find(); 
        var yalla_3_product = await Product.find({game_id: games[0]._id}).select('_id');
        var yalla_4_product = await Product.find({game_id: games[1]._id}).select('_id');
        var yalla_6_product = await Product.find({game_id: games[2]._id}).select('_id');
        return NextResponse.json({
            messge: "query successful ....",
            yalla_3_product_id: yalla_3_product[0]._id,
            yalla_4_product_id: yalla_4_product[0]._id,
            yalla_6_product_id: yalla_6_product[0]._id,
            }, {status: 200});
    } catch (error) {
        
    }
}