import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Coupon from "@/models/CouponModel";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        var coupon_code:any = data.get('coupon_code');
        var price:any = data.get('price');
        var date_only: any = data.get('date_only');
        var time_only: any = data.get('time_only');
        var date: any = data.get('date');
        var type: any = data.get('type');
        var for_type: any = data.get('for_type');
        var merchant_id: any = data.get('merchant_id');
        var user_id: any = data.get('user_id');
        var shop_id: any = data.get('shop_id');
        var active: any = data.get('active') + '';
        let newDocument: any = {
            coupon_code: coupon_code,
            price: price,
            date_only: date_only,
            time_only: time_only,
            date: date,
            active: parseInt(active),
            purchased: 0,
            type: type,
            for_type: for_type,
            //merchant_id: merchant_id,
            //user_id: user_id,
            //shop_id: shop_id,
            available_type: 'history'
        };

        if(shop_id !== '') {
            newDocument['shop_id'] = shop_id;
        }
        if(user_id !== '') {
            newDocument['user_id'] = user_id;
        }
        if(merchant_id !== '') {
            newDocument['merchant_id'] = merchant_id;
        }

        let coupon = await Coupon.create(newDocument);

        return NextResponse.json({
            messge: "Coupon successfully created ....",
            coupon: coupon
          }, {status: 200});
        
    } catch (error) {

        return NextResponse.json({
            messge: "Coupon could not be created ....",
          }, {status: 500});
        
    }
}

export async function PUT(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';

        const data = await request.formData();
        var coupon_code:any = data.get('coupon_code');
        var price:any = data.get('price');
        var date_only: any = data.get('date_only');
        var time_only: any = data.get('time_only');
        var date: any = data.get('date');
        var type: any = data.get('type');
        var for_type: any = data.get('for_type');
        var merchant_id: any = data.get('merchant_id');
        var user_id: any = data.get('user_id');
        var shop_id: any = data.get('shop_id');
        var couponObj = await Coupon.findOne({_id: id});
        if(couponObj) {
            const query = { _id: couponObj._id };
            let updates = {
                $set: {
                    coupon_code: coupon_code,
                    price: price,
                    date_only: date_only,
                    time_only: time_only,
                    date: date,
                    active: 1,
                    purchased: 0,
                    type: type,
                    for_type: for_type,
                    merchant_id: merchant_id,
                    user_id: user_id,
                    shop_id: shop_id,
                    available_type: 'history'
                }
            };
            var coupon = await Coupon.updateOne(query, updates);
            return NextResponse.json({
                messge: "Coupon successfully updated ....",
                coupon: coupon
              }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Coupon could not be found ....",
              }, {status: 500});
        }
        
    } catch (error) {

        return NextResponse.json({
            messge: "Coupon could not be updated ....",
          }, {status: 500});
        
    }
}

export async function DELETE(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var deleted = await Coupon.deleteOne({_id: id});
        if(deleted) {
            return NextResponse.json({
                messge: "Coupon successfully deleted ....",
                deleted: deleted
              }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Coupon could not be deleted ....",
              }, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({
            messge: "Coupon could not be deleted ....",
          }, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var coupon = await Coupon.findOne({_id: id});
        return NextResponse.json({
            messge: "Query successful ....",
            coupon: coupon
          }, {status: 200});

    } catch (error) {

        return NextResponse.json({
            messge: "Query error ....",
          }, {status: 500});

    }
}

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        var type = searchparams.get('type') + '';
        console.log('type: ' + type)

        var coupons = await Coupon.
        aggregate([
            {
                $match: {
                  $and: [
                    {type: type}, 
                    {available_type: 'history'}
                  ]

                },
            },
            {
                $lookup: {
                    from: "merchants",
                    localField: "merchant_id",
                    foreignField: "_id",
                    as: "merchantInCoupon",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userInCoupon",
                },
            },
            {
                $lookup: {
                    from: "shops",
                    localField: "shop_id",
                    foreignField: "_id",
                    as: "shopInCoupon",
                },
            },
        ]).sort({'date': -1}).skip(skip).limit(limit);

        return NextResponse.json({
            messge: "Query successful ....",
            coupons: coupons
          }, {status: 200});

    } catch (error) {

        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
          }, {status: 500});

    }
}

export async function OPTIONS(request: Request) {
    try {
        await connectMongoDB();
        var shop_coupons_count = await Coupon.find({
            type: 'shop',
            available_type: 'history'
        }).countDocuments();

        var app_coupons_count = await Coupon.find({
            type: 'app',
            available_type: 'history'
        }).countDocuments();

        var web_coupons_count = await Coupon.find({
            type: 'website',
            available_type: 'history'
        }).countDocuments();

        return NextResponse.json({
            messge: "query successful ....",
            shop_coupons_count: shop_coupons_count,
            app_coupons_count: app_coupons_count,
            web_coupons_count: web_coupons_count

        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error)
        }, {status: 200});
    }
    
}