import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Coupon from "@/models/CouponModel";
import Settings from "@/models/SettingsModel";

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

export async function PUT(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var type = searchparams.get('type') + '';
        var settingObj = await Settings.findOne({_id: id});

        if(settingObj) {
            const query = { _id: settingObj._id };
            let updates;

            if(type === 'shop') {
                console.log('shop' + settingObj.show_coupons_shop)
                updates = {
                    $set: {
                        show_coupons_shop: settingObj.show_coupons_shop === '1' ? '0' : '1',
                    }
                };
            }

            if(type === 'app') {
                console.log('app' + settingObj.show_coupons_app)
                updates = {
                    $set: {
                        show_coupons_app: settingObj.show_coupons_app === '1' ? '0' : '1',
                    }
                };
            }

            if(type === 'website') {
                
                updates = {
                    $set: {
                        show_coupons_web: settingObj.show_coupons_web === '1' ? '0' : '1',
                    }
                };
                console.log('web: ' + updates)
            }

            var settingsUpdate = await Settings.updateOne(query, updates);
            var settings = await Settings.findOne({_id: id});
            return NextResponse.json({
                messge: "Coupon enabled / disabled successfully ....",
                settings: settings
            }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "settings not found ....",
            }, {status: 500});
        }

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}