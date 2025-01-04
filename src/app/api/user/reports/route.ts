import { NextResponse } from "next/server";
import Invoice from "@/models/InvoiceModel";
import { getGraphResult, getStartEndDates } from "@/libs/common";
import connectMongoDB from "@/libs/mongoosdb";

export async function GET(request: any) {

   await connectMongoDB()
   //var invoice_type: any = 'game'

   var url = new URL(request.url);
   var searchparams = new URLSearchParams(url.searchParams);
   var user_id = searchparams.get('user_id') + '';

   const dailyReport = await getReportBySchedule('game', 'daily', user_id)
   const updatedDailyReport = transformDailyReport(dailyReport);
   const productDailyReport = await getReportBySchedule('prize', 'daily', user_id)
   const updatedProductDailyReport = transformDailyReport(productDailyReport);

   const monthlyReport = await getReportBySchedule('game', 'monthly', user_id)
   const transformedMonthlyReport = transformMonthlyReport(monthlyReport)
   const prizeMonthlyReport = await getReportBySchedule('prize', 'monthly', user_id)
   const transformedPrizeMonthlyReport = transformMonthlyReport(prizeMonthlyReport)
   
   const weeklyReport = await getReportBySchedule('game', 'weekly', user_id)
   const transformedWeeklyReport = transformWeeklyData(weeklyReport)
   const productWeeklyReport = await getReportBySchedule('prize', 'weekly', user_id)
   const transformedProductWeeklyReport = transformWeeklyData(productWeeklyReport)

   const tillDateReport = await getReportBySchedule('game', 'till_date', user_id)
   const transformedTillDateReport = transformWeeklyData(tillDateReport)
   const productTillDateReport = await getReportBySchedule('prize', 'till_date', user_id)
   const transformedProductTillDateReport = transformWeeklyData(productTillDateReport)

   try {
      var data =  {
         "status": "success",
         "data": {
            "daily_report": updatedDailyReport,
            "daily_product_report": updatedProductDailyReport,
            "weekly_report": transformedWeeklyReport,
            "weekly_product_report": transformedProductWeeklyReport,
            "sales_till_today": transformedTillDateReport/*[
               {
                     "JAN": 4,
                     "FEB": 10,
                     "MAR": 2,
                     "APR": 5,
                     "MAY": 7,
                     "JUN": 3,
                     "JUL": 10,
                     "AUG": 11,
                     "SEP": 4
               }
            ]*/,
            "sales_till_today_product": transformedProductTillDateReport,
            "monthly_report": [
               transformedMonthlyReport
            ],
            "monthly_product_report": [
               transformedPrizeMonthlyReport
            ]
         }
      }

      return NextResponse.json({
         messge: "query success ....",
         data: data
      }, {status: 200})

   } catch (error) {
      return NextResponse.json({
         messge: "query error ....",
         }, {status: 500})
   }
}

const getReportBySchedule = async (invoice_type: any, schedule: any, user_id: any) => {

   var dates = getStartEndDates(schedule)
   var start_date = dates.start_date
   var end_date = dates.end_date

   let queryConditions: any[] = [
      {
         createdAt: {
            $gte: new Date(start_date), 
            $lt: new Date(end_date)
         }
      },
      { invoice_type: invoice_type },
      {user_id: user_id}
   ]

   const records = await Invoice
      .find({
         $and: queryConditions
      })
      .sort({ 'createdAt': -1 })
      .select(['_id', 'user_id', 'user_city', 'user_country', 'total_amount', 'invoice_date', 'createdAt'])

   return getGraphResult(records, start_date, end_date, schedule).data
}

const transformDailyReport = (dailyReport: any[]): any[] => {
   return dailyReport.map((record: any) => ({
     time_period: record.day,
     sales: record.sales
   }));
 }

 const transformMonthlyReport = (monthlyReport: any[]): any => {
   return monthlyReport.reduce((acc: any, { day, sales }) => {
     acc[`Day ${day}`] = sales
     return acc
   }, {})
 }

 const transformWeeklyData = (weeklyData: any[]): any[] => {
   const salesByDay: any = {}
 
   weeklyData.forEach((item) => {
     const day = item.day
     const sales = item.sales

     salesByDay[day] = (salesByDay[day] || 0) + sales
   })
 
   return [salesByDay]
 }