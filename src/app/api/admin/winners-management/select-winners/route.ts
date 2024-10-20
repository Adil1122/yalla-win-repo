import { NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongoosdb"
import GameModel from "@/models/GameModel"
import ProductModel from "@/models/ProductModel"

export async function OPTIONS(request: Request) {
   try {
      await connectMongoDB()

      const allGames = await GameModel.find({})
      const allProducts = await ProductModel.find({ game_id: null })

      return NextResponse.json({
         messge: "query successful ....",
         allGames: allGames,
         allProducts: allProducts
      }, {status: 200})

   } catch (error) {
       return NextResponse.json({
           messge: "query error ....",
           error: JSON.stringify(error)
       }, {status: 200});
   }
   
}