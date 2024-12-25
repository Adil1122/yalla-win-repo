import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Coupon from "@/models/CouponModel";
import Settings from "@/models/SettingsModel";

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
        var auto_generated: any = parseInt(data.get('auto_generated') + '');
        console.log(auto_generated)
        if(auto_generated === 0) {
            var alreadyAdded = await Coupon.find({coupon_code: coupon_code}).select(['_id']);
            if(alreadyAdded && alreadyAdded.length > 0) {
                return NextResponse.json({
                    messge: "Coupon code already exists ....",
                }, {status: 500});
            }
        }
        
        let newDocument = {
            coupon_code: coupon_code,
            price: price,
            date_only: date_only,
            time_only: time_only,
            date: date,
            active: 1,
            purchased: 0,
            type: type,
            available_type: 'available',
            auto_generated: auto_generated
        };
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

        var couponObj = await Coupon.findOne({_id: id});
        var auto_generated: any = parseInt(data.get('auto_generated') + '');
        if(auto_generated === 0) {
            var alreadyAdded = await Coupon.find({
                $and: [
                    {coupon_code: coupon_code},
                    {_id: {$ne: id}}
                ]
            }).select(['_id']);
            if(alreadyAdded && alreadyAdded.length > 0) {
                return NextResponse.json({
                    messge: "Coupon code already exists ....",
                }, {status: 500});
            }
        }

        
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
                    available_type: 'available',
                    auto_generated: auto_generated
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

        var coupons = await Coupon.find({
            $and: [
                {type: type}, 
                {available_type: 'available'}
            ]
        }).sort({'date': -1}).skip(skip).limit(limit);

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
            available_type: 'available'
        }).countDocuments();

        var app_coupons_count = await Coupon.find({
            type: 'app',
            available_type: 'available'
        }).countDocuments();

        var web_coupons_count = await Coupon.find({
            type: 'website',
            available_type: 'available'
        }).countDocuments();

        var settings = await Settings.find({}).sort({created_at: -1}).limit(1)

        return NextResponse.json({
            messge: "query successful ....",
            shop_coupons_count: shop_coupons_count,
            app_coupons_count: app_coupons_count,
            web_coupons_count: web_coupons_count,
            settings: settings[0]

        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error)
        }, {status: 200});
    }
    
}