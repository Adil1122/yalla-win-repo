import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Update from "@/models/UpdateModel";
import Product from "@/models/ProductModel";
import { put } from '@vercel/blob';

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        var type:any = data.get('type');
        var file:any = data.get('file');
        var thumbnail:any = data.get('thumbnail');

        var blob = null;
        var qr_code:any = Date.now() + Math.random();
        var file_name = '';
        if(file) {
            file_name = qr_code + '-' + file.name;
            blob = await put(file_name, file, {
                access: 'public',
            });

        }

        let newDocument = {
            type: type,
            file_url: blob ? blob.url : '',
            thumbnail: thumbnail
        }
        let result = await Update.create(newDocument);

        return NextResponse.json({
            messge: "Update created successfully ....",
            result: result
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
                messge: "Update failed to create ....",
            }, {status: 500});
    }
}

export async function DELETE(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var deletedRecord = await Update.deleteOne({_id: id});
        if(deletedRecord) {
            return NextResponse.json({
                messge: "Update deleted successfully ....",
                deletedRecord: deletedRecord
            }, {status: 200});
        } else {

        } 
    } catch (error) {
        return NextResponse.json({
            messge: "Update could not be deleted ....",
        }, {status: 500});
    }

}

export async function GET(request: Request) {
    try {

        await connectMongoDB();
        var records = await Update.find({_id: {$ne: null}}).sort({'createdAt': -1});
        const products = await Product.aggregate([
         {
             $match: {
                 prize_id: null,
                 game_id: { $ne: null }
             }
         },
         {
             $lookup: {
                 from: "games",
                 localField: "game_id",
                 foreignField: "_id",
                 as: "gameDetails"
             }
         },
         {
             $sort: { createdAt: 1 }
         },
         {
             $limit: 3
         }
     ]);
        return NextResponse.json({
            messge: "Query successful ....",
            records: records,
            products: products
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
        }, {status: 500});
    }
}