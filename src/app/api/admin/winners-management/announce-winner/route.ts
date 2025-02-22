import { NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongoosdb"
import mongoose from "mongoose"
import WinnerModel from "@/models/WinnerModel"
import TicketModel from "@/models/TicketModel"
import GameModel from "@/models/GameModel"
import ProductModel from "@/models/ProductModel"
import InvoiceModel from "@/models/InvoiceModel"
import { faBullseye } from "@fortawesome/free-solid-svg-icons"
import { match } from "assert"

export async function POST(request: Request) {

   try {
      
      await connectMongoDB()
      const {inputType, inputValue, inputData, dateAnnounced, maxWinAmount} = await request.json()
   
      if (inputType != 'game' && inputType != 'product') {
         
         return NextResponse.json({message: "invalid request body"}, {status: 401})
      }

      const pipeline = getPipeline(inputType, inputValue, inputData)
      const records = inputType == 'game' ? await TicketModel.aggregate(pipeline) : await InvoiceModel.aggregate(pipeline)
      const winners = await getWinners(records, inputType, inputValue, inputData, parseInt(maxWinAmount), dateAnnounced)
      
      if (winners.length) {
         //await insertWinners(winners, inputType, dateAnnounced)
      }
      
      return NextResponse.json({message: winners.length ? 'winners created successfully' : 'no winners found', data: winners, records: records}, {status: 200})
   } catch (error) {
      return NextResponse.json({message: error}, {status: 500})
   }
}

const getPipeline = (inputType: string, inputValue: string, inputData: string) => {

   let result : any = []
   if (inputType == 'game') {
      
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
            $unwind: "$ProductDetails",
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
            $match: {
               "InvoiceDetails.game_id": new mongoose.Types.ObjectId(inputValue),
               "InvoiceDetails.invoice_type": "game"
            }
         },
         {
            $project: {
               _id: 1,
               ticket_number: 1,
               ticket_type: 1,
               ticket_splitted: 1,
               createdAt: 1,
               "InvoiceDetails.game_id": 1,
               "InvoiceDetails.user_id": 1,
               "InvoiceDetails.product_id": 1,
               "InvoiceDetails.invoice_number": 1,
               "InvoiceDetails.draw_id": 1,
               "InvoiceDetails._id": 1,
               "UserDetails.first_name": 1,
               "UserDetails.last_name": 1,
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
               "GameDetails.name": 1
            }
         }
      ]
   } else if (inputType == 'product') {

      result = [
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
            $match: {
               invoice_number: inputData,
               invoice_type: "prize"
            }
         },
         {
            $project: {
               _id: 1,
               invoice_type: 1,
               invoice_number: 1,
               draws: 1,
               cart_product_details: 1,
               user_id: 1,
               "UserDetails.first_name": 1,
               "UserDetails.last_name": 1,
            }
         }
      ]
   }

   return result
}

const isGivenDateWinner = (dateString: string, givenDate: string) => {
   const recordDate = new Date(dateString)
   const comparisonDate = new Date(givenDate)

   return (
      recordDate.getUTCFullYear() === comparisonDate.getUTCFullYear() &&
      recordDate.getUTCMonth() === comparisonDate.getUTCMonth() &&
      recordDate.getUTCDate() === comparisonDate.getUTCDate()
   )
}

const getWinners = async (records: any, inputType: string, inputValue: string, inputData: string, maxWinAmount: number, dateAnnounced: string) => {

   let filteredResults: any = []

   for (const record of records) {

      if (inputType == 'game') {

         // todo: Games names should be dynamic
         if (!isGivenDateWinner(record.createdAt, dateAnnounced)) {
            continue
         }

         if (record.GameDetails.name == 'Yalla 3' || record.GameDetails.name == 'Yalla 4') {
            
            if (record.ticket_type == 'Straight' && record.ticket_number == inputData) {
               const estimatedWinAmount = record.RuleDetails.option_straight_win_price * record.RuleDetails.product_price
               if (estimatedWinAmount <= maxWinAmount) {

                  filteredResults.push(record)
                  record.winning_price_multiplier = record.RuleDetails.option_straight_win_price
               }
            } else if (record.ticket_type == 'Rumble') {
               const estimatedWinAmount = record.RuleDetails.option_rumble_win_price * record.RuleDetails.product_price
               if (estimatedWinAmount > maxWinAmount) {
                  continue
               }

               const combinations = getCombinations(record.ticket_number)
               const combinationMatch = combinations.find(combination => combination === parseInt(inputData)) || false
   
               if (combinationMatch && estimatedWinAmount <= maxWinAmount) {

                  record.winning_price_multiplier = record.RuleDetails.option_rumble_win_price
                  filteredResults.push(record)
               }
            } else if (record.ticket_type == 'Chance') {
               const hasOneDigitMatching = isChanceMatch(parseInt(inputData), record.ticket_number, 1)
               const hasTwoDigitsMatching = isChanceMatch(parseInt(inputData), record.ticket_number, 2)
               const hasThreeDigitsMatching = isChanceMatch(parseInt(inputData), record.ticket_number, 3)
   
               if (hasThreeDigitsMatching) {

                  const estimatedWinAmount = record.RuleDetails.option_chance_3_correct_win_price * record.RuleDetails.product_price
                  if (estimatedWinAmount <= maxWinAmount) {
                     
                     record.winning_price_multiplier = record.RuleDetails.option_chance_3_correct_win_price
                     record.winning_match = 'chance with 3 digits'
                     filteredResults.push(record)
                  }
               } else if (hasTwoDigitsMatching) {
                  const estimatedWinAmount = record.RuleDetails.option_chance_2_correct_win_price * record.RuleDetails.product_price
                  if (estimatedWinAmount <= maxWinAmount) {

                     record.winning_price_multiplier = record.RuleDetails.option_chance_2_correct_win_price
                     record.winning_match = 'chance with 2 digits'
                     filteredResults.push(record)
                  }
               } else if (hasOneDigitMatching) {
                  const estimatedWinAmount = record.RuleDetails.option_chance_1_correct_win_price * record.RuleDetails.product_price
                  if (estimatedWinAmount <= maxWinAmount) {

                     record.winning_price_multiplier = record.RuleDetails.option_chance_1_correct_win_price
                     record.winning_match = 'chance 1 digit'
                     filteredResults.push(record)
                  }
               }
            }
         } else if (record.GameDetails.name == 'Yalla 6') {
            const inputDataArray : any = splitIntoSixPairs(inputData)
            const matchingSets = countMatchingSets(record.ticket_splitted, inputDataArray)
            
            if (record.ticket_splitted.length == 6) {

               if (matchingSets == 6) {
                  record.winning_price_multiplier = record.RuleDetails.six_numbers_win_price
                  record.winning_match = '6 sets matching'
                  filteredResults.push(record)
                  break
               } else if (matchingSets == 5) {
                  record.winning_price_multiplier = record.RuleDetails.five_numbers_win_price
                  record.winning_match = '5 sets matching'
                  filteredResults.push(record)
                  break
               } else if (matchingSets == 4) {
                  record.winning_price_multiplier = record.RuleDetails.four_numbers_win_price
                  record.winning_match = '4 sets matching'
                  filteredResults.push(record)
                  break
               } else if (matchingSets == 3) {
                  record.winning_price_multiplier = record.RuleDetails.three_numbers_win_price
                  record.winning_match = '3 sets matching'
                  filteredResults.push(record)
                  break
               }
            }
         }
      } else if (inputType == 'product') {

         if(record.cart_product_details && record.draws) {

            const parsed = JSON.parse(record.cart_product_details)
            for (let index = 0; index < parsed.length; index++) {

               const item = parsed[index]

               if (item.product_id === inputValue) {

                  const drawDetails = JSON.parse(record.draws)[index]
                  const productDetails = await ProductModel.aggregate([
                     {
                        $lookup: {
                           from: "prizes",
                           localField: "prize_id",
                           foreignField: "_id",
                           as: "PrizeDetails",
                        },
                     },
                     {
                        $unwind: "$PrizeDetails",
                     },
                     {
                        $match: {
                           _id: new mongoose.Types.ObjectId(item.product_id)
                        }
                     },
                     {
                        $project: {
                           _id: 1,
                           name: 1,
                           price: 1,
                           "PrizeDetails._id": 1,
                           "PrizeDetails.name": 1,
                           "PrizeDetails.price": 1,
                        }
                     }
                  ])
                  
                  if (productDetails.length) {
                     record.ProductDetails = { name: productDetails[0].name, id: productDetails[0]._id, price: productDetails[0].price, quantity: item.product_quantity, prize_id: productDetails[0].PrizeDetails._id, prize_price: productDetails[0].PrizeDetails.price }
                     record.DrawDetails = { id: drawDetails._id }
                     filteredResults.push(record)
                  }
               }
            }
         }
      }
   }

   return filteredResults
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

const isChanceMatch = (givenNumber: number, ticketNumber: number, noOfDigits: number): boolean => {
   const givenStr = givenNumber.toString()
   const ticketStr = ticketNumber.toString()

   const givenLastDigits = givenStr.slice(-noOfDigits)
   const ticketLastDigits = ticketStr.slice(-noOfDigits)

   if (givenLastDigits !== ticketLastDigits) {
      return false
   }

   const givenRemaining = givenStr.slice(0, -noOfDigits).split("")
   const ticketRemaining = ticketStr.slice(0, -noOfDigits).split("")

   return ticketRemaining.every(digit => {
      const index = givenRemaining.indexOf(digit)
      if (index !== -1) {
         givenRemaining.splice(index, 1)
         return true
      }
      return false
   })
}

const countMatchingSets = (firstArray: string[], secondArray: string[]): number => {
   const setSecondArray = new Set(secondArray)
   return firstArray.filter(element => setSecondArray.has(element)).length
}

const splitIntoSixPairs = (inputNumber: string): string[] => {
   const numberStr = inputNumber.padStart(12, '0')
   const result: string[] = []

   for (let i = 0; i < 12; i += 2) {
      result.push(numberStr.slice(i, i + 2))
   }

   return result
}

const insertWinners = async (winners: any, inputType: string, dateAnnounced: string) => {

   for (const winner of winners) {

      const data = getWinnerDataFormated(winner, inputType, dateAnnounced)
      const winnerData : any = {
         product_id: data?.productId,
         user_id: data?.userId,
         draw_id: data?.drawId,
         winning_date: data?.winningDate,
         prize_amount: data?.prizeAmount,
         user_name: data?.userName,
         invoice_id: data?.invoiceId,
         amount_withdrawn: data?.amountWithdrawn,
         platform_type: data?.platformType
      }

      if (inputType == 'game') {
         winnerData.game_id = data?.gameId
         winnerData.ticket_id = data?.ticketId
      } else if (inputType == 'product') {
         winnerData.prize_id = data?.prizeId
      }
   
      await WinnerModel.create(winnerData)
   }
}

const getWinnerDataFormated = (winner: any, inputType: string, date: string) => {

   let data
   if (inputType == 'game') {
      data = {
         ticketId: winner._id,
         gameId: winner.InvoiceDetails.game_id,
         productId: winner.InvoiceDetails.product_id,
         userId: winner.InvoiceDetails.user_id,
         drawId: winner.InvoiceDetails.draw_id,
         winningDate: date,
         prizeAmount: winner.RuleDetails.product_price * winner.winning_price_multiplier,
         userName: `${winner.UserDetails.first_name} ${winner.UserDetails.last_name}`,
         invoiceId: winner.InvoiceDetails._id,
         amountWithdrawn: 0,
         platformType: 'shop'
      }
   } else if (inputType == 'product') {
      data = {
         productId: winner.ProductDetails.id,
         userId: winner.user_id,
         drawId: winner.DrawDetails.id,
         winningDate: date,
         prizeId: winner.ProductDetails.prize_id,
         prizeAmount: winner.ProductDetails.prize_price * winner.ProductDetails.quantity,
         userName: `${winner.UserDetails.first_name} ${winner.UserDetails.last_name}`,
         invoiceId: winner._id,
         amountWithdrawn: 0,
         platformType: 'shop'
      }
   }

   return data
}