import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
//import User from "@/models/UserModel";
import Product from "@/models/ProductModel";

export async function PUT(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var action: any = searchparams.get('action') + '';

        if(action === 'change_status') {
            return changeStatus(request);
        }

    } catch (error) {
        return NextResponse.json({
            messge: "User could not be ....",
        }, {status: 500});
    }
}

async function changeStatus(request: Request) {
    try {

        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var record: any = await Product.findOne({_id: id}).select(['_id', 'status'])
        let updates = {
            $set: {
                status: record.status === 'Active' ? 'In Active' : 'Active',
            }
        }

        let updatedRecord = await Product.updateOne({ _id: record._id }, updates);
        var record: any = await Product.findOne({_id: id}).select(['_id', 'status'])

        return NextResponse.json({
            messge: "Record updated successfully ....",
            updatedRecord: updatedRecord,
            record: record
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Record could not be ....",
        }, {status: 500});
    }
    
}