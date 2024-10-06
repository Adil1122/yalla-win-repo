
import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import User from "@/models/UserModel";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var daily_start_date = new Date().toISOString().slice(0, 10)
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        var end_date = tomorrowDate.toISOString().slice(0, 10);
        var weekly_start_date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        var monthly_start_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        const daily_merchant_counts = await User
        .find({
                createdAt: {
                    $gte : new Date(daily_start_date), 
                    $lt: new Date(end_date)
                }
            },
            {role: 'merchant'}
        ).countDocuments();

        const weekly_merchant_counts = await User
        .find({
                createdAt: {
                    $gte : new Date(weekly_start_date), 
                    $lt: new Date(end_date)
                }
            },
            {role: 'merchant'}
        ).countDocuments();

        const monthly_merchant_counts = await User
        .find({
                createdAt: {
                    $gte : new Date(monthly_start_date), 
                    $lt: new Date(end_date)
                }
            },
            {role: 'merchant'}
        ).countDocuments();
            
        return NextResponse.json({
            messge: "Query success ....",
            daily_merchant_counts: daily_merchant_counts,
            weekly_merchant_counts: weekly_merchant_counts,
            monthly_merchant_counts: monthly_merchant_counts,
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}