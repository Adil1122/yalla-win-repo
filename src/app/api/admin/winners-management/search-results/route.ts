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

      const url = new URL(request.url)
      const searchparams = new URLSearchParams(url.searchParams)
      const userCity = searchparams.get('user_city') + ''
      const userCountry = searchparams.get('user_country') + ''
      const userArea = searchparams.get('user_area') + ''
      const estimatedAmount = searchparams.get('amount') + ''
      const gameId = searchparams.get('game_id') + ''
      const productId = searchparams.get('product_id') + ''
      const skip : number = parseInt(searchparams.get('skip') || '0')   
      const limit : number = parseInt(searchparams.get('limit') || '5')
      const percent = parseInt(searchparams.get('people_percent') + '')
   
      await connectMongoDB()
      const pipeline = getPipeline(gameId, productId, estimatedAmount, userCity, userCountry, userArea)
      const records = gameId && gameId !== '' ? await TicketModel.aggregate(pipeline) : await InvoiceModel.aggregate(pipeline)
      const filteredTickets = getFilteredTickets(records, parseInt(estimatedAmount), percent, userCountry, userCity, userArea)
      const finalTickets = filteredTickets.slice(skip, skip + limit)

      return NextResponse.json({
         messge: "query successful ....",
         tickets: finalTickets
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

      const url = new URL(request.url)
      const searchparams = new URLSearchParams(url.searchParams)
      const userCity = searchparams.get('user_city') + ''
      const userCountry = searchparams.get('user_country') + ''
      const userArea = searchparams.get('user_area') + ''
      const estimatedAmount = searchparams.get('amount') + ''
      const gameId = searchparams.get('game_id') + ''
      const productId = searchparams.get('product_id') + ''
      const percent = parseInt(searchparams.get('people_percent') + '')
   
      await connectMongoDB()

      const pipeline = getPipeline(gameId, productId, estimatedAmount, userCity, userCountry, userArea)
      const records = gameId && gameId !== '' ? await TicketModel.aggregate(pipeline) : await InvoiceModel.aggregate(pipeline)
      const filteredTickets = getFilteredTickets(records, parseInt(estimatedAmount), percent, userCountry, userCity, userArea)

      return NextResponse.json({
         messge: "query successful ....",
         count: filteredTickets.length
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
               from: "rules",
               localField: "InvoiceDetails.product_id",
               foreignField: "product_id",
               as: "RuleDetails",
            }
         },
         {
            $unwind: {
               path: "$RuleDetails",
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
               "InvoiceDetails.game_id": new mongoose.Types.ObjectId(gameId)
            }
         },
         {
            $project: {
               _id: 1,
               ticket_number: 1,
               ticket_type: 1,
               "UserDetails.first_name": 1,
               "UserDetails.last_name": 1,
               "UserDetails.city": 1,
               "UserDetails.country": 1,
               "UserDetails.area": 1,
               "InvoiceDetails._id": 1,
               "RuleDetails.product_price": 1,
               "RuleDetails.option_straight_win_price": 1,
               "RuleDetails.option_rumble_win_price": 1,
               "RuleDetails.option_chance_3_correct_win_price": 1,
               "RuleDetails.option_chance_2_correct_win_price": 1,
               "RuleDetails.option_chance_1_correct_win_price": 1,
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

const getFilteredTickets = (tickets: any, maxWinningAmount: number, percent: number, userCountry: string, userCity: string, userArea: string) => {

   let filteredTickets: any = []

   tickets.forEach((ticket: any) => {
      const ticketType = ticket.ticket_type
      const productPrice = parseInt(ticket.RuleDetails?.product_price) || 0
      
      let expectedAmounts: number[] = []

      if (ticketType === 'Straight') {
         const straightWinPrice = parseInt(ticket.RuleDetails?.option_straight_win_price) || 0
         const expectedAmount = productPrice * straightWinPrice
         expectedAmounts.push(expectedAmount)
      } else if (ticketType === 'Rumble') {
         const rumbleWinPrice = parseInt(ticket.RuleDetails?.option_rumble_win_price) || 0
         const expectedAmount = productPrice * rumbleWinPrice
         expectedAmounts.push(expectedAmount)
      } else if (ticketType === 'Chance') {
         const chance3Correct = parseInt(ticket.RuleDetails?.option_chance_3_correct_win_price) || 0
         const chance2Correct = parseInt(ticket.RuleDetails?.option_chance_2_correct_win_price) || 0
         const chance1Correct = parseInt(ticket.RuleDetails?.option_chance_1_correct_win_price) || 0

         expectedAmounts.push(
            productPrice * chance3Correct,
            productPrice * chance2Correct,
            productPrice * chance1Correct
         )
      }

      const isValidTicket = expectedAmounts.length ? expectedAmounts.every(amount => amount <= maxWinningAmount) : false

      if (isValidTicket) {
         filteredTickets.push(ticket)
      }
   })

   return filteredTickets
}
