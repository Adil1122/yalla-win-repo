import { NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongoosdb"
import Ticket from "@/models/WinnerModel"
import { faTicketSimple } from "@fortawesome/free-solid-svg-icons"
import mongoose from "mongoose"
import TicketModel from "@/models/TicketModel"
import GameModel from "@/models/GameModel"
import ProductModel from "@/models/ProductModel"
import InvoiceModel from "@/models/InvoiceModel"

export async function GET(request: Request) {
   try {

      const url = new URL(request.url);
      const searchparams = new URLSearchParams(url.searchParams)
      const userCity = searchparams.get('user_city') + ''
      const userCountry = searchparams.get('user_country') + ''
      const userArea = searchparams.get('user_area') + ''
      const estimatedAmount = searchparams.get('amount') + ''
      const gameId = searchparams.get('game_id') + ''
      const productId = searchparams.get('product_id') + ''
      const skip : number = parseInt(searchparams.get('skip') || '0')   
      const limit : number = parseInt(searchparams.get('limit') || '5')
   
      await connectMongoDB()
      const pipeline = getPipeline(gameId, productId, estimatedAmount, userCity, userCountry, userArea)
      const records = gameId && gameId !== '' ? await TicketModel.aggregate(pipeline).skip(skip).limit(limit) : await InvoiceModel.aggregate(pipeline).skip(skip).limit(limit)

      return NextResponse.json({
         messge: "query successful ....",
         tickets: records
      }, {status: 200})

   } catch (error) {
       return NextResponse.json({
           messge: "query error ....",
           error: JSON.stringify(error)
       }, {status: 200})
   }
}

export async function OPTIONS(request: Request) {
   try {

      const url = new URL(request.url);
      const searchparams = new URLSearchParams(url.searchParams)
      const userCity = searchparams.get('user_city') + ''
      const userCountry = searchparams.get('user_country') + ''
      const userArea = searchparams.get('user_area') + ''
      const estimatedAmount = searchparams.get('amount') + ''
      const gameId = searchparams.get('game_id') + ''
      const productId = searchparams.get('product_id') + ''
   
      await connectMongoDB()

      const pipeline = getPipeline(gameId, productId, estimatedAmount, userCity, userCountry, userArea)
      const records = gameId && gameId !== '' ? await TicketModel.aggregate(pipeline) : await InvoiceModel.aggregate(pipeline)

      return NextResponse.json({
         messge: "query successful ....",
         count: records.length
      }, {status: 200})

   } catch (error) {
       return NextResponse.json({
           messge: "query error ....",
           error: JSON.stringify(error)
       }, {status: 200})
   }
   
}

const getPipeline = (gameId: string, productId: string, estimatedAmount: string, userCity: string, userCountry: string, userArea: string) => {

   let result : any = []
   if (gameId && gameId !== '' && gameId !== 'null') {

      result = [
         {
            $lookup: {
               from: "invoices",
               localField: "invoice_id",
               foreignField: "_id",
               as: "InvoiceDetails",
            }
         },
         {
            $unwind: "$InvoiceDetails",
         },
         {
            $lookup: {
               from: "products",
               localField: "InvoiceDetails.product_id",
               foreignField: "_id",
               as: "ProductDetails",
            }
         },
         {
            $lookup: {
            from: "users",
            localField: "InvoiceDetails.user_id",
            foreignField: "_id",
            as: "UserDetails",
            },
         },
         {
            $unwind: "$ProductDetails",
         },
         {
            $lookup: {
               from: "games",
               localField: "InvoiceDetails.game_id",
               foreignField: "_id",
               as: "GameDetails",
            },
         }, {
            $unwind: "$GameDetails",
         },
         {
            $match: {
               "InvoiceDetails.game_id": new mongoose.Types.ObjectId(gameId),
               //"ProductDetails.price": parseInt(estimatedAmount),
               ...(userCity && userCity != '' ? { "UserDetails.city": { $regex: new RegExp(userCity, 'i') } } : {}),
               ...(userCountry && userCountry != '' ? { "UserDetails.country": { $regex: new RegExp(userCountry, 'i') } } : {}),
               ...(userArea && userArea != '' ? { "UserDetails.area": { $regex: userArea, $options: 'i' } } : {}),
            }
         },
         {
            $project: {
               _id: 1,
               ticket_number: 1,
               "UserDetails.first_name": 1,
               "UserDetails.last_name": 1,
               "UserDetails.city": 1,
               "UserDetails.country": 1,
               "UserDetails.area": 1,
               "InvoiceDetails._id": 1,
               ...(gameId && gameId !== '' ? { "GameDetails.name": 1 } : {}),
            }
         }
      ]
   } else if (productId && productId != '' && productId != 'null') {
      
      result = [
         {
            $lookup: {
               from: "products",
               localField: "product_id",
               foreignField: "_id",
               as: "ProductDetails",
            }
         },
         {
            $unwind: "$ProductDetails",
         },
         {
            $match: {
               "product_id": new mongoose.Types.ObjectId(productId),
               //"ProductDetails.price": parseInt(estimatedAmount),
               ...(userCity && userCity != '' ? { "UserDetails.city": { $regex: new RegExp(userCity, 'i') } } : {}),
               ...(userCountry && userCountry != '' ? { "UserDetails.country": { $regex: new RegExp(userCountry, 'i') } } : {}),
               ...(userArea && userArea != '' ? { "UserDetails.area": { $regex: userArea, $options: 'i' } } : {}),
            }
         },
         {
            $project: {
               _id: 1,
               invoice_number: 1,
               "UserDetails.first_name": 1,
               "UserDetails.last_name": 1,
               "UserDetails.city": 1,
               "UserDetails.country": 1,
               "UserDetails.area": 1,
               "InvoiceDetails._id": 1
            }
         }
      ]
   }

   return result
}