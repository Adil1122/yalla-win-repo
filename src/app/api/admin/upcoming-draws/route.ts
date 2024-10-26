import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Draw from "@/models/DrawModel";
import Product from "@/models/ProductModel";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        
        var product_id:any = data.get('product_id');
        var draw_date: any = data.get('draw_date');
        var draw_type: any = data.get('draw_type');
        var platform_type: any = data.get('platform_type');
        var date_only:any = data.get('date_only');
        var time_only:any = data.get('time_only');

        if(draw_type === 'games') {
            var game_id:any = data.get('game_id');
            var game_name:any = data.get('game_name');
        }
        if(draw_type === 'products') {
            var prize_id: any = data.get('prize_id');
            var prize_name:any = data.get('prize_name');
        }

        console.log('1')
    
        let newDocument: any = {
            product_id: product_id,
            draw_date: draw_date,
            draw_type: draw_type,
            date_only: date_only,
            time_only: time_only,
            platform_type: platform_type
        };
        if(draw_type === 'games') {
            newDocument['game_id'] = game_id
            newDocument['game_name'] = game_name
        }
        if(draw_type === 'products') {
            newDocument['prize_id'] = prize_id
            newDocument['prize_name'] = prize_name
        }
        console.log('newDocument: ', newDocument)
        let record = await Draw.create(newDocument);

        return NextResponse.json({
            messge: "Record successfully created ....",
            record: record
          }, {status: 200});
        
    } catch (error) {

        return NextResponse.json({
            messge: "Record could not be created ....",
            error: JSON.stringify(error)
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
        var product_id:any = data.get('product_id');
        var draw_date: any = data.get('draw_date');
        var draw_type: any = data.get('draw_type');
        var date_only:any = data.get('date_only');
        var time_only:any = data.get('time_only');

        if(draw_type === 'games') {
            var game_id:any = data.get('game_id');
            var game_name:any = data.get('game_name');
        }
        if(draw_type === 'products') {
            var prize_id: any = data.get('prize_id');
            var prize_name: any = data.get('prize_name');
        }

        const query = { _id: id };
        var updateDocument: any = {
            product_id: product_id,
            draw_date: draw_date,
            draw_type: draw_type,
            date_only: date_only,
            time_only: time_only,
        }

        if(draw_type === 'games') {
            updateDocument['game_id'] = game_id
            updateDocument['game_name'] = game_name
        }
        if(draw_type === 'products') {
            updateDocument['prize_id'] = prize_id
            updateDocument['prize_name'] = prize_name
        }

        let updates = {
            $set: updateDocument
        };
        var record = await Draw.updateOne(query, updates);
        return NextResponse.json({
            messge: "Record successfully updated ....",
            record: record
            }, {status: 200});
        
    } catch (error) {

        return NextResponse.json({
            messge: "Record could not be updated ....",
          }, {status: 500});
        
    }
}

export async function DELETE(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var deleted = await Draw.deleteOne({_id: id});
        if(deleted) {
            return NextResponse.json({
                messge: "Record successfully deleted ....",
                deleted: deleted
              }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Record could not be deleted ....",
              }, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({
            messge: "Record could not be deleted ....",
          }, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var record = await Draw.findOne({_id: id});
        return NextResponse.json({
            messge: "Query successful ....",
            record: record
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
        var draw_type = searchparams.get('draw_type') + '';
        var platform_type = searchparams.get('platform_type') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');

        const records = await Draw
        .aggregate([
            {
                $match:
                {
                    $and: [ 
                        { draw_type: draw_type },
                        {platform_type: platform_type}
                    ]
                }
            },
            {
                $lookup: {
                    from: 'games',
                    localField: "game_id",
                    foreignField: "_id",
                    as: "gameWithDraw",
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "product_id",
                    foreignField: "_id",
                    as: "productWithDraw",
                }
            }
        ]).sort({'createdAt': -1}).skip(skip).limit(limit);

        return NextResponse.json({
            messge: "Query successful ....",
            records: records
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

        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var draw_type = searchparams.get('draw_type') + '';
        var products = []
        if(draw_type === 'games') {

            products = await Product
            .aggregate([
                {
                    $match:{
                        game_id: {$ne: null}
                    }
                },
                {
                    $lookup: {
                        from: 'games',
                        localField: "game_id",
                        foreignField: "_id",
                        as: "gameWithProduct",
                    }
                }
            ]).sort({'name': 1});

            //products = await Product.find({game_id: {$ne: null}}).sort({'name': 1}).select(['_id', 'name', 'game_id'])
        } else {
            products = await Product
            .aggregate([
                {
                    $match:{
                        prize_id: {$ne: null}
                    }
                },
                {
                    $lookup: {
                        from: 'prizes',
                        localField: "prize_id",
                        foreignField: "_id",
                        as: "prizeWithProduct",
                    }
                }
            ]).sort({'name': 1});

            //products = await Product.find({prize_id: {$ne: null}}).sort({'name': 1}).select(['_id', 'name', 'prize_id'])
        }

        var app_web_games_draw_count = await Draw.find({ 
            $and:[
                {draw_type: 'games'},
                {platform_type: 'app-web'}
            ]
        }).countDocuments();

        var app_web_products_draw_count = await Draw.find({
            $and:[
                {draw_type: 'products'},
                {platform_type: 'app-web'}
            ]
        }).countDocuments();

        var merchant_games_draw_count = await Draw.find({
            $and:[
                {draw_type: 'games'},
                {platform_type: 'merchant'}
            ]
        }).countDocuments();

        var merchant_products_draw_count = await Draw.find({
            $and:[
                {draw_type: 'products'},
                {platform_type: 'merchant'}
            ]
        }).countDocuments();

        return NextResponse.json({
            messge: "query successful ....",
            app_web_games_draw_count: app_web_games_draw_count,
            app_web_products_draw_count: app_web_products_draw_count,
            merchant_games_draw_count: merchant_games_draw_count,
            merchant_products_draw_count: merchant_products_draw_count,
            products: products

        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error)
        }, {status: 200});
    }
    
}