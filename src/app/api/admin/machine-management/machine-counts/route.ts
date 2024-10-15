
import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Machine from "@/models/MachineModel";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var search_by = searchparams.get('search_by') + '';
        var search = searchparams.get('search') + '';

        var daily_start_date = new Date().toISOString().slice(0, 10)
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        var end_date = tomorrowDate.toISOString().slice(0, 10);
        var weekly_start_date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        var monthly_start_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        var search_json = search_by === 'countries' ? 
        {country: { $regex: '.*' + search + '.*', $options: 'i' }} 
        :
        {city: { $regex: '.*' + search + '.*', $options: 'i' }}

        const daily_machine_counts = await Machine
        .find({
            $and:[ 
                {
                    createdAt: {
                        $gte : new Date(daily_start_date), 
                        $lt: new Date(end_date)
                    }
                },
                search_json
            ]
        }).countDocuments();

        const weekly_machine_counts = await Machine
        .find({
            $and:[ 
                {
                    createdAt: {
                        $gte : new Date(weekly_start_date), 
                        $lt: new Date(end_date)
                    }
                },
                search_json
            ]
        }).countDocuments();

        const monthly_machine_counts = await Machine
        .find({

            $and:[ 
                {
                    createdAt: {
                        $gte : new Date(monthly_start_date), 
                        $lt: new Date(end_date)
                    }
                },
                search_json
            ]
        }).countDocuments();
            
        return NextResponse.json({
            messge: "Query success ....",
            daily_machine_counts: daily_machine_counts,
            weekly_machine_counts: weekly_machine_counts,
            monthly_machine_counts: monthly_machine_counts,
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}