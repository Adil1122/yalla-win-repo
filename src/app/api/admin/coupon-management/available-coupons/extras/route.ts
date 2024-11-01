import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Coupon from "@/models/CouponModel";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var couponObj = await Coupon.findOne({_id: id});
        if(couponObj) {
            const query = { _id: couponObj._id };
            let updates = {
                $set: {
                    active: couponObj.active === 1 ? 0 : 1,
                }
            };
            var coupon = await Coupon.updateOne(query, updates);
            return NextResponse.json({
                messge: "Coupon status successfully updated ....",
                coupon: coupon
              }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "coupon not found ....",
              }, {status: 500});
        }

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
          }, {status: 500});
    }
}