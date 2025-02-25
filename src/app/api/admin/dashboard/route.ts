import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Invoice from "@/models/InvoiceModel";
import { getGraphResult, getStartEndDates } from "@/libs/common";
import User from "@/models/UserModel";

export async function GET(request: Request) {
   try {
      await connectMongoDB();
      var url = new URL(request.url);
      var searchparams = new URLSearchParams(url.searchParams);
      var platform: any = searchparams.get('platform') + '';
      var invoice_type: any = searchparams.get('invoice_type') + '';
      var schedule: any = searchparams.get('schedule') + '';
      var search_by = searchparams.get('search_by') + '';
      var search = searchparams.get('search') + '';

      var dates = getStartEndDates(schedule)
      var start_date = dates.start_date
      var end_date = dates.end_date

      let search_json = {};
      if (search_by === 'countries') {
         search_json = { user_country: { $regex: '.*' + search + '.*', $options: 'i' } };
      } else if (search_by === 'cities') {
         search_json = { user_city: { $regex: '.*' + search + '.*', $options: 'i' } };
      }

      let platformCondition = {};
      if (platform !== null && platform !== 'null') {
         platformCondition = { platform: platform };
      }

      // Initialize the query conditions
      let queryConditions: any[] = [
         {
            createdAt: {
               $gte: new Date(start_date), 
               $lte: new Date(end_date)
            }
         },
         { invoice_type: invoice_type }
      ];

      if (Object.keys(search_json).length > 0) {
         queryConditions.push(search_json);
      }

      if (Object.keys(platformCondition).length > 0) {
         queryConditions.push(platformCondition);
      }

      const records = await Invoice
         .find({
            $and: queryConditions
         })
         .sort({ 'createdAt': -1 })
         .select(['_id', 'user_id', 'user_city', 'user_country', 'total_amount', 'invoice_date', 'createdAt']);

      var merchants = await User.find({
         $and: [
            {role: 'merchant'},
            {initial_coords: {$ne: null}}
         ]
      }).select(['name', 'initial_coords'])   


      return NextResponse.json({
         messge: "Query success ....",
         graph_result: getGraphResult(records, start_date, end_date, schedule),
         records: records,
         merchants: merchants
      }, {status: 200});

   } catch (error) {
      return NextResponse.json({
         messge: "Query error ....",
         error: JSON.stringify(error),
      }, {status: 500});
   }
}