import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Invoice from "@/models/InvoiceModel";
import { getGraphResult, getStartEndDates } from "@/libs/common";

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

        var search_json = search_by === 'countries' ? 
        {user_country: { $regex: '.*' + search + '.*', $options: 'i' }} 
        :
        {user_city: { $regex: '.*' + search + '.*', $options: 'i' }}

        const records = await Invoice
        .find({
            $and:[ 
                {
                    createdAt: {
                        $gte : new Date(start_date), 
                        $lt: new Date(end_date)
                    }
                }, 
                {invoice_type: invoice_type},
                {platform: platform},
                search_json
            ]
        }).sort({'createdAt': -1}).select(['_id', 'user_id', 'user_city', 'user_country', 'total_amount', 'invoice_date']);

        return NextResponse.json({
            messge: "Query success ....",
            graph_result: getGraphResult(records, start_date, end_date, schedule)
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error),
        }, {status: 500});
    }
}