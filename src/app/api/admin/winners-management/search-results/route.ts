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
      const platformType : string = searchparams.get('platform_type') + ''
      const percent = parseInt(searchparams.get('people_percent') + '')
      const gameType : string = searchparams.get('game_type') + ''
   
      await connectMongoDB()
      const pipeline = getPipeline(gameId, productId, estimatedAmount, userCity, userCountry, userArea, platformType)
      const records = gameId && gameId !== '' && gameId !== 'null' ? await TicketModel.aggregate(pipeline) : await InvoiceModel.aggregate(pipeline)
      const {filteredResults, totalExpectedAmount} = getFilteredResults(records, gameId, productId, parseInt(estimatedAmount), percent, userCountry, userCity, userArea, gameType)
      const finalResults = filteredResults.slice(skip, skip + limit)

      return NextResponse.json({
         messge: "query successful ....",
         items: finalResults,
         total_count: filteredResults.length,
         total_sum: totalExpectedAmount,
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
      const skip : number = parseInt(searchparams.get('skip') || '0')   
      const limit : number = parseInt(searchparams.get('limit') || '5')
      const platformType : string = searchparams.get('platform_type') + ''
      const percent = parseInt(searchparams.get('people_percent') + '')
      const gameType : string = searchparams.get('game_type') + ''
   
      await connectMongoDB()
      const pipeline = getPipeline(gameId, productId, estimatedAmount, userCity, userCountry, userArea, platformType)
      const records = gameId && gameId !== '' && gameId !== 'null' ? await TicketModel.aggregate(pipeline) : await InvoiceModel.aggregate(pipeline)
      const {filteredResults, totalExpectedAmount} = getFilteredResults(records, gameId, productId, parseInt(estimatedAmount), percent, userCountry, userCity, userArea, gameType)

      return NextResponse.json({
         messge: "query successful ....",
         count: filteredResults.length,
         sum: totalExpectedAmount,
      }, {status: 200})

   } catch (error) {
       return NextResponse.json({
           messge: "query error ....",
           error: JSON.stringify(error)
       }, {status: 200})
   }
   
}

const getPipeline = (gameId: string, productId: string, estimatedAmount: string, userCity: string, userCountry: string, userArea: string, platformType: string) => {

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
         }, 
         {
            $unwind: "$GameDetails",
         },
         {
            $match: {
               "InvoiceDetails.game_id": new mongoose.Types.ObjectId(gameId),
               ...(platformType && platformType != 'all' && platformType != 'null' && platformType != '' ? { "UserDetails.user_type": platformType } : {}),
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
               "RuleDetails.three_numbers_win_price": 1,
               "RuleDetails.four_numbers_win_price": 1,
               "RuleDetails.five_numbers_win_price": 1,
               "RuleDetails.six_numbers_win_price": 1,
               ...(gameId && gameId !== '' ? { "GameDetails.name": 1 } : {}),
            }
         }
      ]
   } else if (productId && productId != '' && productId != 'null') {

      result = [
         {
            $lookup: {
               from: "users",              
               localField: "user_id",       
               foreignField: "_id",          
               as: "UserDetails"             
            }
         },
         {
            $match: {
               invoice_type: "prize",
               ...(platformType && platformType != 'all' && platformType != 'null' && platformType != '' ? { "UserDetails.user_type": platformType } : {}),
            }
         },
         {
            $project: {
               _id: 1,
               invoice_type: 1,
               invoice_number: 1,
               user_id: 1,
               "UserDetails.first_name": 1,
               "UserDetails.last_name": 1,
               "UserDetails.city": 1,
               "UserDetails.country": 1,
               "UserDetails.area": 1,
               cart_product_details: 1       
            }
         }
      ]
   }

   return result
}

const getFilteredResults = (records: any, gameId: string, productId: string, maxWinningAmount: number, percent: number, userCountry: string, userCity: string, userArea: string, gameType: string) => {

   let filteredResults: any = []
   let totalExpectedAmount = 0

   records.forEach((record: any) => {
      const ticketType = record.ticket_type
      const productPrice = parseInt(record.RuleDetails?.product_price) || 0
      let isValidTicket = false

      let expectedAmounts: number[] = []

      if (gameId && gameId !== '' && gameId !== 'null') {

         if (ticketType === 'Straight') {
            const straightWinPrice = parseInt(record.RuleDetails?.option_straight_win_price) || 0
            const expectedAmount = productPrice * straightWinPrice
            expectedAmounts.push(expectedAmount)
         } else if (ticketType === 'Rumble') {
            const rumbleWinPrice = parseInt(record.RuleDetails?.option_rumble_win_price) || 0
            const expectedAmount = productPrice * rumbleWinPrice
            expectedAmounts.push(expectedAmount)
         } else if (ticketType === 'Chance') {
            const chance3Correct = parseInt(record.RuleDetails?.option_chance_3_correct_win_price) || 0
            const chance2Correct = parseInt(record.RuleDetails?.option_chance_2_correct_win_price) || 0
            const chance1Correct = parseInt(record.RuleDetails?.option_chance_1_correct_win_price) || 0
   
            expectedAmounts.push(
               productPrice * chance3Correct,
               productPrice * chance2Correct,
               productPrice * chance1Correct
            )
         } else if (ticketType == null) {
            const chance6Correct = parseInt(record.RuleDetails?.six_numbers_win_price) || 0
            const chance5Correct = parseInt(record.RuleDetails?.five_numbers_win_price) || 0
            const chance4Correct = parseInt(record.RuleDetails?.four_numbers_win_price) || 0
            const chance3Correct = parseInt(record.RuleDetails?.three_numbers_win_price) || 0
   
            expectedAmounts.push(
               productPrice * chance6Correct,
               productPrice * chance5Correct,
               productPrice * chance4Correct,
               productPrice * chance3Correct
            )
         }
   
         isValidTicket = expectedAmounts.length ? expectedAmounts.some(amount => amount <= maxWinningAmount) : false
         isValidTicket = gameType && gameType != '' && gameType != 'null' && ticketType.toLowerCase() != gameType ? false : isValidTicket

         if (isValidTicket) {
            filteredResults.push(record)
            totalExpectedAmount += expectedAmounts.reduce((sum, amount) => sum + amount, 0)
            record.winning_amount = expectedAmounts
         }
      } else if (productId && productId !== '' && productId !== 'null') {

         if(record.cart_product_details) {
            
            const parsed = JSON.parse(record.cart_product_details)
            parsed.forEach((item: any) => {
               if (item.product_id == productId) {

                  const winningAmount = item.prize_price ? item.prize_price : 0
                  record.ProductDetails = { name: item.product_name }
                  record.winning_amount = [winningAmount]

                  filteredResults.push(record)
                  totalExpectedAmount += winningAmount
               }
            })
         }
      }
   })

   return { filteredResults, totalExpectedAmount }
}
