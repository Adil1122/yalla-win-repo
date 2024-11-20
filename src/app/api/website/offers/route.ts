import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Offer from "@/models/OfferModel";

export async function GET(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var platform_type: any = searchparams.get('platform_type');
        var offer_type: any = searchparams.get('offer_type');
        var current_date = new Date().toISOString().slice(0, 10)
        var product_id: any = searchparams.get('product_id');

        var record = await Offer
            .find({
                $and: [
                    {
                        platform_type: platform_type,
                    },
                    {
                        offer_type: offer_type
                    },
                    {
                        product_id: product_id
                    },
                    {
                        status: 'active'
                    },
                    {
                        expiry_date: {
                            $gte: new Date(current_date)
                        }
                    }
                ]
            }).sort({createdAt: -1}).limit(1)

            return NextResponse.json({
                messge: "query successful ....",
                record: record
              }, {status: 200});
        
    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error)
          }, {status: 500});
    }
}