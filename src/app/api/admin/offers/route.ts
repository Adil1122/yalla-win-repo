import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
//import Draw from "@/models/DrawModel";
import Offer from "@/models/OfferModel";
import Game from "@/models/GameModel";
import Product from "@/models/ProductModel";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        
        var name:any = data.get('name');
        var free_qty: any = data.get('free_qty');
        var platform_type: any = data.get('platform_type');
        var offer_type: any = data.get('offer_type');
        var start_date:any = data.get('start_date');
        var expiry_date:any = data.get('expiry_date');
        //var status:any = data.get('status');

        if(offer_type === 'games') {
            var game_id:any = data.get('game_id');
            var game = await Game.findOne({_id: game_id})
            var product = await Product.find({game_id: game_id}).select(['_id']).limit(1)
            var game_name:any = game.name;
            var product_id:any = product[0]._id.toString()
        } else {
            var product_id:any = data.get('product_id');
        }

        var qty_multiple = 1
        if(name === 'Buy One Get One') {
            qty_multiple = 2
        } else if(name === 'Buy One Get Two') {
            qty_multiple = 3
        } else if(name === 'Buy One Get Three') {
            qty_multiple = 4
        } else if(name === 'Buy One Get Four') {
            qty_multiple = 5
        }

    
        let newDocument: any = {
            name: name,
            free_qty: free_qty,
            platform_type: platform_type,
            offer_type: offer_type,
            start_date: start_date,
            expiry_date: expiry_date,
            status: 'active',
            product_id: product_id,
            qty_multiple: qty_multiple
        };
        if(offer_type === 'games') {
            newDocument['game_id'] = game_id
            newDocument['game_name'] = game_name
        }
        console.log('newDocument: ', newDocument)
        let record = await Offer.create(newDocument);

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
        var name:any = data.get('name');
        var free_qty: any = data.get('free_qty');
        var platform_type: any = data.get('platform_type');
        var offer_type: any = data.get('offer_type');
        var start_date:any = data.get('start_date');
        var expiry_date:any = data.get('expiry_date');
        //var status:any = data.get('status');

        if(offer_type === 'games') {
            var game_id:any = data.get('game_id');
            var game = await Game.findOne({_id: game_id})
            var product = await Product.find({game_id: game_id}).select(['_id']).limit(1)
            var game_name:any = game.name;
            var product_id:any = product[0]._id.toString()
        } else {
            var product_id:any = data.get('product_id');
        }

        var qty_multiple = 1
        if(name === 'Buy One Get One') {
            qty_multiple = 2
        } else if(name === 'Buy One Get Two') {
            qty_multiple = 3
        } else if(name === 'Buy One Get Three') {
            qty_multiple = 4
        } else if(name === 'Buy One Get Four') {
            qty_multiple = 5
        }

        const query = { _id: id };
        var updateDocument: any = {
            name: name,
            free_qty: free_qty,
            platform_type: platform_type,
            offer_type: offer_type,
            start_date: start_date,
            expiry_date: expiry_date,
            status: 'active',
            product_id: product_id,
            qty_multiple: qty_multiple
        }

        if(offer_type === 'games') {
            updateDocument['game_id'] = game_id
            updateDocument['game_name'] = game_name
        }

        let updates = {
            $set: updateDocument
        };
        var record = await Offer.updateOne(query, updates);
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
        var deleted = await Offer.deleteOne({_id: id});
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
        var record = await Offer.findOne({_id: id});
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
        var offer_type = searchparams.get('offer_type') + '';
        var platform_type = searchparams.get('platform_type') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');

        const records = await Offer
        .aggregate([
            {
                $match:
                {
                    $and: [ 
                        { offer_type: offer_type },
                        {platform_type: platform_type}
                    ]
                }
            },
            {
                $lookup: {
                    from: 'games',
                    localField: "game_id",
                    foreignField: "_id",
                    as: "gameWithOffer",
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "product_id",
                    foreignField: "_id",
                    as: "productWithOffer",
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
        //var offer_type = searchparams.get('offer_type') + '';

        var games: any = await Game.find({name: {$in: ['Yalla 3', 'Yalla 4', 'Yalla 6']}}).sort({name: 1})
        var products: any = await Product.find({prize_id: {$ne: null}}).select(['_id', 'name']).sort({name: 1})

        var app_web_games_offer_count = await Offer.find({ 
            $and:[
                {offer_type: 'games'},
                {platform_type: 'app-web'}
            ]
        }).countDocuments();

        var app_web_products_offer_count = await Offer.find({
            $and:[
                {offer_type: 'products'},
                {platform_type: 'app-web'}
            ]
        }).countDocuments();

        var merchant_games_offer_count = await Offer.find({
            $and:[
                {offer_type: 'games'},
                {platform_type: 'merchant'}
            ]
        }).countDocuments();

        var merchant_products_offer_count = await Offer.find({
            $and:[
                {offer_type: 'products'},
                {platform_type: 'merchant'}
            ]
        }).countDocuments();

        return NextResponse.json({
            messge: "query successful ....",
            app_web_games_offer_count: app_web_games_offer_count,
            app_web_products_offer_count: app_web_products_offer_count,
            merchant_games_offer_count: merchant_games_offer_count,
            merchant_products_offer_count: merchant_products_offer_count,
            games: games,
            products: products

        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error)
        }, {status: 200});
    }
    
}