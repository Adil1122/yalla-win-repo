import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";

import Product from "@/models/ProductModel";
import Winner from "@/models/WinnerModel";

export async function GET(request: any) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var search = searchparams.get('search') + '';

        if(search === '') {
            return NextResponse.json({
                messge: "query successful ....",
                products:  [],
                winners: [],
                }, {status: 200});
        }

        await connectMongoDB();
        var products = await Product.find({
            name: { $regex: '.*' + search + '.*', $options: 'i' }
        })
        .select('name').sort({'createdAt': -1}).limit(20);

        var winners = await Winner.find(
            {user_name: { $regex: '.*' + search + '.*', $options: 'i' }}
        )
        .select('user_name').sort({'winning_date': -1}).limit(20);

        return NextResponse.json({
            messge: "query successful ....",
            products:  products,
            winners: winners,
            }, {status: 200});
        
    } catch (error) {

        return NextResponse.json({
            messge: "query error ....",
            }, {status: 500});
        
    }
}