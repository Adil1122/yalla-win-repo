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
      const ticketNumber = searchparams.get('ticket_number') + ''
      const gameId = searchparams.get('game_id') + ''
      const maxWinningAmount = parseInt(searchparams.get('max_amount') + '')
      const startDateTime = searchparams.get('start_date') + ''
      const endDateTime = searchparams.get('end_date') + ''
      const platformType = 'all'

   
      await connectMongoDB()
      const pipeline = getPipeline(gameId, ticketNumber, platformType, startDateTime, endDateTime)
      const records = await TicketModel.aggregate(pipeline)
      const {filteredResults, totalExpectedAmount} = getFilteredResults(records, gameId, ticketNumber, maxWinningAmount)
      const finalResults = filteredResults

      return NextResponse.json({
         messge: "query successful ....",
         items: finalResults,
         total_sum: totalExpectedAmount,
      }, {status: 200})

   } catch (error) {
      console.log(error)
       return NextResponse.json({
           messge: "query error ....",
           error: JSON.stringify(error)
       }, {status: 200})
   }
}

const getPipeline = (gameId : string, ticketNumber: string, platformType: string, startDateTime: string, endDateTime: string) => {
   
   let result : any = []
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
            from: "users",
            localField: "InvoiceDetails.user_id",
            foreignField: "_id",
            as: "UserDetails",
         },
      },
      {
         $unwind: "$UserDetails",
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
         $lookup: {
            from: "products",
            localField: "GameDetails._id",
            foreignField: "game_id",
            as: "ProductDetails",
         },
      }, 
      {
         $unwind: "$ProductDetails",
      },
      {
         $lookup: {
            from: "rules",
            localField: "ProductDetails._id",
            foreignField: "product_id",
            as: "RuleDetails",
         },
      }, 
      {
         $unwind: "$RuleDetails",
      },
      {
         $match: {
            "InvoiceDetails.game_id": new mongoose.Types.ObjectId(gameId),
            ...(platformType && platformType != 'all' && platformType != 'null' && platformType != '' ? { "UserDetails.user_type": platformType } : {}),
            "createdAt": {
               $gte: new Date(startDateTime + ":00.000Z"),
               $lte: new Date(endDateTime + ":00.000Z")
            }
         }
      },
      {
         $sort: { createdAt: -1 }
      },
      {
         $project: {
            _id: 1,
            ticket_number: 1,
            ticket_splitted: 1,
            ticket_type: 1,
            createdAt: 1,
            "UserDetails.first_name": 1,
            "UserDetails.last_name": 1,
            "UserDetails.city": 1,
            "UserDetails.country": 1,
            "UserDetails.area": 1,
            "ProductDetails._id": 1,
            "InvoiceDetails._id": 1,
            "GameDetails.name": 1,
            "GameDetails._id": 1,
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
         }
      }
   ]

   return result
}

const getFilteredResults = (records: any, gameId: string, ticketNumber: string, maxWinAmount: number) => {

   let filteredResults: any = []
   let totalExpectedAmount = 0

   for (const record of records) {
      const ticketType = record.ticket_type
      const productPrice = parseInt(record.RuleDetails?.product_price) || 0
      let expectedAmount = 0
      
      record.ticket_number = record.ticket_number.replace(/,/g, "").trim()

      if (record.GameDetails.name == 'Yalla 3' || record.GameDetails.name == 'Yalla 4') {

         if (ticketType == 'Straight' && record.ticket_number == ticketNumber) {
            filteredResults.push(record)
            expectedAmount = record.RuleDetails?.option_straight_win_price * productPrice
            record.winning_match = 'straight match'
            record.winning_amount = expectedAmount
         } else if (ticketType == 'Rumble') {
   
            const estimatedWinAmount = record.RuleDetails.option_rumble_win_price * productPrice
            if (estimatedWinAmount > maxWinAmount) {
               continue
            }
   
            const combinations = getCombinations(record.ticket_number)
            const combinationMatch = combinations.find(combination => combination === parseInt(ticketNumber)) || false
   
            if (combinationMatch && estimatedWinAmount <= maxWinAmount) {
   
               expectedAmount = estimatedWinAmount
               record.winning_match = 'rumble combination match'
               record.winning_amount = expectedAmount
               filteredResults.push(record)
            }
         } else if (ticketType == 'Chance') {
   
            const hasOneDigitMatching = isChanceMatch(parseInt(ticketNumber), record.ticket_number, 1)
            const hasTwoDigitsMatching = isChanceMatch(parseInt(ticketNumber), record.ticket_number, 2)
            const hasThreeDigitsMatching = isChanceMatch(parseInt(ticketNumber), record.ticket_number, 3)
            const hasFourDigitsMatching = isChanceMatch(parseInt(ticketNumber), record.ticket_number, 4)
console.log(ticketNumber, record.ticket_number)
            if (record.GameDetails.name == 'Yalla 4' && hasFourDigitsMatching) {
               console.log('4 matching')
               const estimatedWinAmount = record.RuleDetails.option_chance_4_correct_win_price * productPrice
               if (estimatedWinAmount <= maxWinAmount) {
                  
                  expectedAmount = estimatedWinAmount
                  record.winning_match = 'chance with 4 digits'
                  record.winning_amount = expectedAmount
                  filteredResults.push(record)
               }
            } else if (hasThreeDigitsMatching) {
               console.log('3 matching')
               const estimatedWinAmount = record.RuleDetails.option_chance_3_correct_win_price * productPrice
               if (estimatedWinAmount <= maxWinAmount) {
                  
                  expectedAmount = estimatedWinAmount
                  record.winning_match = 'chance with 3 digits'
                  record.winning_amount = expectedAmount
                  filteredResults.push(record)
               }
            } else if (hasTwoDigitsMatching) {console.log('2 matching')
               const estimatedWinAmount = record.RuleDetails.option_chance_2_correct_win_price * productPrice
               if (estimatedWinAmount <= maxWinAmount) {

                  expectedAmount = estimatedWinAmount
                  record.winning_match = 'chance with 2 digits'
                  record.winning_amount = expectedAmount
                  filteredResults.push(record)
               }
            } else if (hasOneDigitMatching) {console.log('1 matching')
               const estimatedWinAmount = record.RuleDetails.option_chance_1_correct_win_price * productPrice
               if (estimatedWinAmount <= maxWinAmount) {

                  expectedAmount = estimatedWinAmount
                  record.winning_match = 'chance 1 digit'
                  record.winning_amount = expectedAmount
                  filteredResults.push(record)
               }
            } else {
               console.log('0 matching')
            }
         }
      } else if (record.GameDetails.name == 'Yalla 6') {

         const inputDataArray : any = splitIntoSixPairs(ticketNumber)
         const matchingSets = countMatchingSets(record.ticket_splitted, inputDataArray)
         
         if (record.ticket_splitted.length == 6) {

            if (matchingSets == 6) {
               expectedAmount = record.RuleDetails.six_numbers_win_price * productPrice
               record.winning_match = '6 sets matching'
               record.winning_amount = expectedAmount
               filteredResults.push(record)
               break
            } else if (matchingSets == 5) {
               expectedAmount = record.RuleDetails.five_numbers_win_price * productPrice
               record.winning_match = '5 sets matching'
               record.winning_amount = expectedAmount
               filteredResults.push(record)
               break
            } else if (matchingSets == 4) {
               expectedAmount = record.RuleDetails.four_numbers_win_price * productPrice
               record.winning_match = '4 sets matching'
               record.winning_amount = expectedAmount
               filteredResults.push(record)
               break
            } else if (matchingSets == 3) {
               expectedAmount = record.RuleDetails.three_numbers_win_price * productPrice
               record.winning_match = '3 sets matching'
               record.winning_amount = expectedAmount
               filteredResults.push(record)
               break
            }
         }
      }

      totalExpectedAmount += expectedAmount
   }

   return { filteredResults, totalExpectedAmount }
}

const getCombinations = (num: number): number[] => {
   const numStr = num.toString()
   const results: number[] = []
 
   function permute(arr: string[], temp: string[] = []) {
      if (arr.length === 0) {
         results.push(parseInt(temp.join(""), 10))
      } else {
         for (let i = 0; i < arr.length; i++) {
            const current = arr.slice()
            const next = current.splice(i, 1)
            permute(current, temp.concat(next))
         }
      }
   }
 
   permute(numStr.split(""))
   return results
}

const splitIntoSixPairs = (inputNumber: string): string[] => {
   const numberStr = inputNumber.padStart(12, '0')
   const result: string[] = []

   for (let i = 0; i < 12; i += 2) {
      result.push(numberStr.slice(i, i + 2))
   }

   return result
}

const isChanceMatch = (givenNumber: number, ticketNumber: number, noOfDigits: number): boolean => {
   const givenStr = givenNumber.toString()
   const ticketStr = ticketNumber.toString()

   return givenStr.slice(-noOfDigits) === ticketStr.slice(-noOfDigits)
}

const countMatchingSets = (firstArray: string[], secondArray: string[]): number => {
   const setSecondArray = new Set(secondArray)
   return firstArray.filter(element => setSecondArray.has(element)).length
}

const getRandomWinner = async (winners: any) => {

   if (winners.length === 0) {
      return null
   }

   const randomIndex = Math.floor(Math.random() * winners.length)
   return winners[randomIndex]
}