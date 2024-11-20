import { NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongoosdb"
import mongoose from "mongoose"
import WinnerModel from "@/models/WinnerModel"
import TicketModel from "@/models/TicketModel"
import GameModel from "@/models/GameModel"
import ProductModel from "@/models/ProductModel"
import InvoiceModel from "@/models/InvoiceModel"
import SettingsModel from "@/models/SettingsModel"
import { faBullseye } from "@fortawesome/free-solid-svg-icons"

export async function GET(request: Request) {

   try {
      
      await connectMongoDB()

      const settings = await SettingsModel.findOne()
      const gameWinners = await WinnerModel.aggregate(getPipeline('game'))
      const productWinners = await WinnerModel.aggregate(getPipeline('product'))
      const winnerImages = extractUserImages(gameWinners, productWinners)
      
      return NextResponse.json({game_winners: gameWinners, product_winners: productWinners, images: winnerImages, settings: settings}, {status: 200})
   } catch (error) {
      return NextResponse.json({message: error}, {status: 500})
   }
}

export async function POST(request: Request) {

   try {
      
      await connectMongoDB()
      const {settingName, settingValue} = await request.json()
   
      if (settingName == '' && settingValue == '') {
         
         return NextResponse.json({message: "invalid request body"}, {status: 401})
      }

      let update : any = {}

      if (settingName == 'show_winners_app') {
         update = {show_winners_app: settingValue}
      } else if (settingName == 'show_winners_shop') {
         update = {show_winners_shop: settingValue}
      } else if (settingName == 'show_winners_web') {
         update = {show_winners_web: settingValue}
      }
      
      const updateResult = await SettingsModel.findOneAndUpdate(
         {_id: "671dd96a8c31e89a256aa016"},
         { $set: update },
         {new: true}
      )

      return NextResponse.json({message: 'updated successfully', data: updateResult}, {status: 200})
   } catch (error) {
      return NextResponse.json({message: error}, {status: 500})
   }
}

const getPipeline = (type: string) => {

   let pipeline : any = []

   if (type == 'game') {

      pipeline = [
         {
            $lookup: {
               from: "tickets",
               localField: "ticket_id",
               foreignField: "_id",
               as: "TicketDetails",
            }
         },
         {
            $unwind: "$TicketDetails",
         },
         {
            $lookup: {
               from: "games",
               localField: "game_id",
               foreignField: "_id",
               as: "GameDetails",
            }
         },
         {
            $unwind: {
               path: "$GameDetails",
            }
         },
         {
            $lookup: {
               from: "users",
               localField: "user_id",
               foreignField: "_id",
               as: "UserDetails",
            },
         },
         {
            $unwind: "$UserDetails",
         },
         {
            $match: { game_id: {$ne: null} }
         },
         {
            $project: {
               _id: 1,
               animation_video: 1,
               createdAt: 1,
               prize_amount: 1,
               "GameDetails.name": 1,
               "UserDetails.first_name": 1,
               "UserDetails.last_name": 1,
               "UserDetails.image": 1,
               "TicketDetails.ticket_number": 1,
               "TicketDetails.ticket_splitted": 1
            }
         }
      ]
   } else if (type == 'product') {

      pipeline = [
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
            $lookup: {
               from: "prizes",
               localField: "prize_id",
               foreignField: "_id",
               as: "PrizeDetails",
            }
         },
         {
            $unwind: "$PrizeDetails",
         },
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
               from: "users",
               localField: "user_id",
               foreignField: "_id",
               as: "UserDetails",
            },
         },
         {
            $unwind: "$UserDetails",
         },
         {
            $match: { prize_id: {$ne: null} }
         },
         {
            $project: {
               _id: 1,
               prize_amount: 1,
               "ProductDetails.name": 1,
               "PrizeDetails.name": 1,
               "UserDetails.first_name": 1,
               "UserDetails.last_name": 1,
               "UserDetails.image": 1,
               "InvoiceDetails.invoice_number": 1
            }
         }
      ]
   }

   return pipeline
}

const extractUserImages = (gameWinners: any, productWinners: any): string[] => {
   const images = new Set<string>()

   gameWinners.forEach((winner: any) => {
      if (winner.UserDetails?.image) {
         images.add(winner.UserDetails.image)
      }
   })

   productWinners.forEach((winner: any) => {
      if (winner.UserDetails?.image) {
         images.add(winner.UserDetails.image)
      }
   })

   return Array.from(images)
}