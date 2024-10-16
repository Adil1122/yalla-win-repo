import { NextResponse } from "next/server";
import Rule from "@/models/RuleModel";
import connectMongoDB from "@/libs/mongoosdb";
import mongoose from "mongoose";
import Product from "@/models/ProductModel";

export async function GET(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var record: any = await Rule.aggregate([
            {
                $match: {
                    product_id: new mongoose.Types.ObjectId(id + '') 
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "product_id",
                    foreignField: "_id",
                    as: "productWithRule",
                }
            }
        ]).limit(1);

        if(record && record.length > 0) {
            return NextResponse.json({
                messge: "Query success ....",
                record: record,
            }, {status: 200});
        }

        return NextResponse.json({
            messge: "Query error, record not found ....",
        }, {status: 500});

    } catch (error) {
        return NextResponse.json({
            messge: "Query success ....",
            error: JSON.stringify(error),
        }, {status: 500});
    }
}

export async function POST(request: Request) {
    
    try {

        await connectMongoDB();
        const data = await request.formData();
        var product_id:any = data.get('product_id');
        var product_name:any = data.get('product_name');
        var product_price:any = data.get('product_price');
        var introduction:any = data.get('introduction');
        var how_to_participate:any = data.get('how_to_participate');
        var option_straight_text:any = data.get('option_straight_text');
        var option_chance_text:any = data.get('option_chance_text');
        var option_rumble_text:any = data.get('option_rumble_text');
        var option_straight_win_price:any = data.get('option_straight_win_price');
        var option_rumble_win_price:any = data.get('option_rumble_win_price');
        var option_chance_3_correct_win_price:any = data.get('option_chance_3_correct_win_price');
        var option_chance_2_correct_win_price:any = data.get('option_chance_2_correct_win_price');
        var option_chance_1_correct_win_price:any = data.get('option_chance_1_correct_win_price');

        var rule: any = await Rule.find({product_id: product_id}).select('_id');

        let document = {
            product_name: product_name,
            product_price: product_price,
            introduction: introduction,
            how_to_participate: how_to_participate,
            option_straight_text: option_straight_text,
            option_chance_text: option_chance_text,
            option_rumble_text: option_rumble_text,
            option_straight_win_price: option_straight_win_price,
            option_rumble_win_price: option_rumble_win_price,
            option_chance_3_correct_win_price: option_chance_3_correct_win_price,
            option_chance_2_correct_win_price: option_chance_2_correct_win_price,
            option_chance_1_correct_win_price: option_chance_1_correct_win_price,
        }

        var result;

        if(rule && rule.length > 0) {
            let updates = {
                $set: document
            }
            result = await Rule.updateOne({_id: rule._id}, updates);
        } else {
            result = await Rule.create(document);
        }

        let productUpdates = {
            $set: {
                name: product_name,
                price: product_price
            }
        }
        let productResult = await Product.updateOne({_id: product_id}, productUpdates);

        return NextResponse.json({
            messge: "query successful ....",
            result: result,
            productResult: productResult

          }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error),

          }, {status: 500});
    }
}