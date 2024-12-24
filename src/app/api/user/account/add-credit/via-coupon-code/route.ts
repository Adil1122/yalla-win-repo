import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
//import mongoose from "mongoose";
import mongoose from "mongoose";
import Wallet from "@/models/WalletModel";
import Coupon from "@/models/CouponModel";
import Transaction from "@/models/TransactionModel";
import connectMongoDB from "@/libs/mongoosdb";
import User from "@/models/UserModel";
export async function POST(request: NextRequest) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        var coupon_code = searchparams.get('coupon_code') + '';
        coupon_code = coupon_code.trim();
        var coupon = await Coupon.find({coupon_code: coupon_code});
        console.log('coupon: ', coupon_code)
        if(coupon && coupon.length > 0) {
            var amount = parseFloat(coupon[0].price);
            let query = { user_id: new mongoose.Types.ObjectId(user_id + '') };
            let walletResult = await Wallet.find(query);
            var user = await User.findOne({_id: user_id}).select(['_id', 'role'])

            if(coupon[0].active === 0) {
                return NextResponse.json({
                    message: "Coupon is not active ....",
                }, {status: 500});
            }

            if(coupon[0].purchased === 1) {
                return NextResponse.json({
                    message: "Coupon is already purchased ....",
                }, {status: 500});
            }

            if(user.role === 'merchant') {

                const couponUpdates = {
                    $set: {
                        active: 0,
                        purchased: 1
                    },
                };
                var couponUpdateResult = await Coupon.updateOne({coupon_code: coupon_code}, couponUpdates);

                var transDoc = {
                    user_id: user_id,
                    payment_type: 'deposit',
                    via: 'coupon',
                    card_details: coupon_code,
                    amount: amount,
                    date: new Date(),
                    closing_balance: 0,
                    note: 'Amount Added Via Coupon Code using Merchant App'
                }
                var TransactionDetails = await Transaction.create(transDoc);

                return NextResponse.json({
                    message: "Coupon successfully purchased ....",
                }, {status: 200});

            } else if(walletResult && walletResult.length > 0) {

                const updates = {
                    $set: {
                        amount: parseFloat(walletResult[0].amount) + amount,
                    },
                };
                var walletUpdateResult = await Wallet.updateOne(query, updates);
            } else {
                const newDoc = {
                    user_id: user_id,
                    amount: amount
                }
                walletUpdateResult = await Wallet.create(newDoc);
            }

            const couponUpdates = {
                $set: {
                    active: 0,
                    purchased: 1
                },
            };
            var couponUpdateResult = await Coupon.updateOne({coupon_code: coupon_code}, couponUpdates);

            walletResult = await Wallet.find(query);
            if(walletResult && walletResult.length > 0) {
                var transactionDoc = {
                    user_id: user_id,
                    payment_type: 'deposit',
                    via: 'coupon',
                    card_details: coupon_code,
                    amount: amount,
                    date: new Date(),
                    closing_balance: walletResult[0].amount,
                    note: 'Amount Added Via Coupon Code'
                }
                var TransactionDetails = await Transaction.create(transactionDoc);
            }

            return NextResponse.json({
                message: "Amount successfully added in wallet ....",
                walletUpdateResult: walletUpdateResult,
                couponUpdateResult: couponUpdateResult,
                TransactionDetails: TransactionDetails
            }, {status: 200});
        } else {
            return NextResponse.json({
                message: "No coupon found ....",
            }, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({
            message: "Amount could not be added in wallet ....",
        }, {status: 500});
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        var id = searchparams.get('id') + '';
        var quantity = searchparams.get('quantity') + '';
        //var type = searchparams.get('type') + '';
        //coupon_code = coupon_code.trim();
        var coupon: any = await Coupon.findOne({_id: id});
        if(coupon) {
            var amount = parseFloat(coupon.price) * parseInt(quantity);
            let query = { user_id: new mongoose.Types.ObjectId(user_id + '') };
            let walletResult = await Wallet.find(query);
            

            var user = await User.findOne({_id: user_id}).select(['_id', 'role'])

            if(coupon.active === 0) {
                return NextResponse.json({
                    message: "Coupon is not active ....",
                }, {status: 500});
            }

            if(coupon.purchased === 1) {
                return NextResponse.json({
                    message: "Coupon is already purchased ....",
                }, {status: 500});
            }

            var date = new Date()
            var date_only = date.toISOString().slice(0, 10)
            //var coupon_code = Math.floor(Math.random() * 899999 + 100000)
            var min = 100000000000
            var max = 999999999999
            var coupon_code = Math.floor(Math.random() * (max - min + 1)) + min
            console.log('before create')

            let newDocument: any = {
                coupon_code: coupon_code,
                price: amount,
                date_only: date_only,
                time_only: coupon.time_only,
                date: date,
                active: 0,
                purchased: 1,
                type: coupon.type,
                available_type: 'available',
                auto_generated: 1,
                user_id: user_id
            };
            let newCoupon = await Coupon.create(newDocument);
            console.log('after create')

            if(user.role === 'merchant') {

                /*const couponUpdates = {
                    $set: {
                        purchased: 1,
                    },
                };
                var couponUpdateResult = await Coupon.updateOne({coupon_code: coupon_code}, couponUpdates);*/

                var transDoc = {
                    user_id: user_id,
                    payment_type: 'withdraw',
                    via: 'coupon',
                    card_details: coupon_code,
                    amount: amount,
                    date: new Date(),
                    closing_balance: 0,
                    note: 'Amount Withdrawn Via Coupon Code Using Merchant App'
                }
                var TransactionDetails = await Transaction.create(transDoc);

                return NextResponse.json({
                    message: "Coupon successfully purchased ....",
                }, {status: 200});

            } else if(walletResult && walletResult.length > 0) {

                console.log('inside wallet ')

                if(walletResult[0].amount >= amount) {

                    const updates = {
                        $set: {
                            amount: parseFloat(walletResult[0].amount) - amount,
                        },
                    };
                    var walletUpdateResult = await Wallet.updateOne(query, updates);

                    /*const couponUpdates = {
                        $set: {
                            purchased: 1,
                        },
                    };
                    var couponUpdateResult = await Coupon.updateOne({coupon_code: coupon_code}, couponUpdates);*/
        
                    walletResult = await Wallet.find(query);
                    if(walletResult && walletResult.length > 0) {
                        var transactionDoc = {
                            user_id: user_id,
                            payment_type: 'withdraw',
                            via: 'coupon',
                            card_details: coupon_code,
                            amount: amount,
                            date: new Date(),
                            closing_balance: walletResult[0].amount,
                            note: 'Amount Withdrawn Via Coupon Code'
                        }
                        var TransactionDetails = await Transaction.create(transactionDoc);
                    }
        
                    return NextResponse.json({
                        message: "Amount successfully withdrawn from wallet ....",
                        walletUpdateResult: walletUpdateResult,
                        couponUpdateResult: [],
                        newCoupon: newCoupon,
                        TransactionDetails: TransactionDetails
                    }, {status: 200});

                } else {
                    return NextResponse.json({
                        message: "Insufficient balance in wallet ....",
                    }, {status: 500});
                }
            } else {
                return NextResponse.json({
                    message: "No balance in wallet ....",
                }, {status: 500});
            }
        } else {
            return NextResponse.json({
                message: "No coupon found ....",
            }, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({
            message: "Amount could not be withdrawn in wallet ....",
        }, {status: 500});
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var type = searchparams.get('type') + '';
        var user_id = searchparams.get('user_id') + '';

        var activeCoupons = await Coupon.find({
            $and: [
                {active: 1},
                {type: type},
                {auto_generated: 1},
                {coupon_code: ''},
                {date: {$lte: new Date()}}
            ]
        });

        var purchasedCoupons = await Coupon.find({
            $and: [
                {type: type},
                //{auto_generated: 1},
                {purchased: 1},
                {coupon_code: {$ne: ''}},
                {user_id: user_id}
            ]
        }).sort({createdAt: -1});

        return NextResponse.json({
            message: "Query successful ....",
            activeCoupons: activeCoupons,
            purchasedCoupons: purchasedCoupons
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            message: "Query error ....",
            error: error
        }, {status: 200});
    }
}

