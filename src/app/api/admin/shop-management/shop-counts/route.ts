
import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Shop from "@/models/ShopModel";
import { getStartEndDates } from "@/libs/common";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var search_by = searchparams.get('search_by') + '';
        var search = searchparams.get('search') + '';

        var daily_dates = getStartEndDates('daily')
        var daily_start_date = daily_dates.start_date
        var end_date = daily_dates.end_date

        var weekly_dates = getStartEndDates('weekly')
        var weekly_start_date = weekly_dates.start_date

        var monthly_dates = getStartEndDates('monthly')
        var monthly_start_date = monthly_dates.start_date

        var search_json = search_by === 'countries' ? 
        {country: { $regex: '.*' + search + '.*', $options: 'i' }} 
        :
        {city: { $regex: '.*' + search + '.*', $options: 'i' }}
        

        const daily_shop_counts = await Shop
        .find({
            $and: [
                {registeration_date: {
                    $gte : new Date(daily_start_date), 
                    $lt: new Date(end_date)
                }},
                search_json
            ]
        }).countDocuments();

        const weekly_shop_counts = await Shop
        .find({
            $and: [
                {registeration_date: {
                    $gte : new Date(weekly_start_date), 
                    $lt: new Date(end_date)
                }},
                search_json
            ]
        }).countDocuments();

        const monthly_shop_counts = await Shop
        .find({
            $and: [
                {registeration_date: {
                    $gte : new Date(monthly_start_date), 
                    $lt: new Date(end_date)
                }},
                search_json
            ]
        }).countDocuments();
            
        return NextResponse.json({
            messge: "Query success ....",
            daily_shop_counts: daily_shop_counts,
            weekly_shop_counts: weekly_shop_counts,
            monthly_shop_counts: monthly_shop_counts,
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}