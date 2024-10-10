import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Game from "@/models/GameModel";
import Category from "@/models/CategoryModel";
import Product from "@/models/ProductModel";
import { put } from '@vercel/blob';
import Prize from "@/models/PrizeModel";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        var type:any = data.get('type');
        var product_type:any = data.get('product_type');

        // game product starts ....
        if(product_type === 'games') {

            var game_name:any = data.get('game_name');
            var game_type:any = data.get('game_type');
            var game_description:any = data.get('game_description');

            var product_name:any = data.get('product_name');
            var product_price:any = data.get('product_price');
            var product_image:any = data.get('product_image');
            var product_status:any = data.get('product_status');
            var product_date:any = data.get('product_date');

            var image_name = '';
            var qr_code:any = Date.now() + Math.random();
            var blob = null;
            if(product_image) {
                image_name = qr_code + '-' + product_image.name;
                blob = await put(image_name, product_image, {
                    access: 'public',
                });
            }

            let gameNewDocument = {
                name: game_name,
                description: game_description,
                type: game_type
            }

            let category = await Category.find({slug: 'free-game-product'});

            if(category) {
                let game = await Game.create(gameNewDocument);
                if(game) {
                    let productNewDocument = {
                        name: product_name,
                        description: game_description,
                        price: parseFloat(product_price),
                        status: product_status,
                        date: product_date,
                        image: blob ? blob.url : '',
                        category_id: category[0]._id,
                        game_id: game._id,
                        type: type
                    }
                    let product = await Product.create(productNewDocument);
                    return NextResponse.json({
                        messge: "Game / Product created successfully ....",
                        game: game,
                        product: product
                    }, {status: 200});
                } else {
                    return NextResponse.json({
                        messge: "Failed to create Game / Product ....",
                    }, {status: 500});
                }
            } else {
                return NextResponse.json({
                    messge: "Failed to create Game / Product....",
                }, {status: 500});
            }

        }
        // game product ends ....

        if(product_type === 'products') {

            var prize_name:any = data.get('prize_name');
            var prize_image:any = data.get('prize_image');
            var prize_price:any = data.get('prize_price');
            var specifications: any = data.get('prize_specifications');
            var image_name = '';
            var qr_code:any = Date.now() + Math.random();
            var blob = null;
            if(prize_image) {
                image_name = qr_code + '-' + prize_image.name;
                blob = await put(image_name, prize_image, {
                access: 'public',
                });
            }

            console.log('prize_price: ', prize_price)

            let prizeNewDocument = {
                name: prize_name,
                specifications: specifications,
                price: parseFloat(prize_price),
                image: blob ? blob.url : '',
            }

            let prize = await Prize.create(prizeNewDocument);

            var product_name:any = data.get('product_name');
            var product_description: any = data.get('product_description');
            var product_price:any = data.get('product_price');
            var product_image:any = data.get('product_image');
            var product_status:any = data.get('product_status');
            var product_date:any = data.get('product_date');

            var image_name = '';
            var qr_code:any = Date.now() + Math.random();
            var blob = null;
            if(product_image) {
                image_name = qr_code + '-' + product_image.name;
                blob = await put(image_name, product_image, {
                access: 'public',
                });
            }

            console.log('product_price: ', product_price)
            let productNewDocument = {
                name: product_name,
                description: product_description,
                price: parseFloat(product_price),
                status: product_status,
                date: product_date,
                image: blob ? blob.url : '',
                type: type,
                prize_id: prize._id
            }
            let product = await Product.create(productNewDocument);

            if(product) {
                return NextResponse.json({
                    messge: "Prize / Product created successfully ....",
                    prize: prize,
                    product: product
                }, {status: 200});
            
            } else {
                return NextResponse.json({
                    messge: "Prize / Product could not be created ....",
                }, {status: 500});
            }
        }
        
    } catch (error) {
        return NextResponse.json({
            messge: "Failed to create Game / Product....",
            error: JSON.stringify(error)
          }, {status: 500});
    }
}

export async function PUT(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        const data = await request.formData();
        var product_type:any = data.get('product_type');

        // game product starts ....
        if(product_type === 'games') {

            var product: any = await Product.findOne({_id: id});
            if(!product) {
                return NextResponse.json({
                    messge: "Product Not found ....",
                }, {status: 500});
            } else {

                var game_name:any = data.get('game_name');
                var game_type:any = data.get('game_type');
                var game_description:any = data.get('game_description');

                var product_name:any = data.get('product_name');
                var product_price:any = data.get('product_price');
                var product_image:any = data.get('product_image');
                var product_status:any = data.get('product_status');
                var product_date:any = data.get('product_date');
                
                let gameUpdates = {
                    $set: {
                        name: game_name,
                        description: game_description,
                        type: game_type
                    }
                }

                let gameUpdated = await Game.updateOne({ _id: product.game_id }, gameUpdates);

                if(product) {
                    var image_name = '';
                    var qr_code:any = Date.now() + Math.random();
                    var blob = null;
                    if(product_image) {
                        image_name = qr_code + '-' + product_image.name;
                        blob = await put(image_name, product_image, {
                            access: 'public',
                        });
                    }

                    let productUpdates = {
                        $set: {
                            name: product_name,
                            description: game_description,
                            price: parseFloat(product_price),
                            status: product_status,
                            date: product_date,
                            image: blob ? blob.url : product.image,
                            game_id: product.game_id
                        }
                        
                    }
                    let productUpdated = await Product.updateOne({_id: product._id}, productUpdates);
                    return NextResponse.json({
                        messge: "Game / Product updated successfully ....",
                        game: gameUpdated,
                        product: productUpdated
                    }, {status: 200});
                }

            }

        }
        // game product ends ....

        if(product_type === 'products') {

            let product: any = await Product.findOne({_id: id});
            if(product) {

                var product_name:any = data.get('product_name');
                var product_description: any = data.get('product_description');
                var product_price:any = data.get('product_price');
                var product_image:any = data.get('product_image');
                var product_status:any = data.get('product_status');
                var product_date:any = data.get('product_date');

                var image_name = '';
                var qr_code:any = Date.now() + Math.random();
                var blob = null;
                if(product_image) {
                    image_name = qr_code + '-' + product_image.name;
                    blob = await put(image_name, product_image, {
                    access: 'public',
                    });
                }
                let productUpdates = {
                    $set: {
                        name: product_name,
                        description: product_description,
                        price: parseFloat(product_price),
                        status: product_status,
                        date: product_date,
                        image: blob ? blob.url : product.image,
                    }
                }
                let productUpdated = await Product.updateOne({_id: product._id}, productUpdates);
                let prize = await Prize.findOne({_id: product.prize_id});
                if(prize) {
                    var prize_name:any = data.get('prize_name');
                    var prize_image:any = data.get('prize_image');
                    var prize_price:any = data.get('prize_price');
                    var specifications: any = data.get('prize_specifications');
                    var image_name = '';
                    var qr_code:any = Date.now() + Math.random();
                    var blob = null;
                    if(prize_image) {
                        image_name = qr_code + '-' + prize_image.name;
                        blob = await put(image_name, prize_image, {
                            access: 'public',
                        });
                    }
                    
                    let prizeUpdates = {
                        $set: {
                            name: prize_name,
                            specifications: specifications,
                            price: parseFloat(prize_price),
                            image: blob ? blob.url : prize.image,
                        }
                        
                    }
                    let prizeUpdated = await Prize.updateOne({_id: prize._id}, prizeUpdates);
                    return NextResponse.json({
                        messge: "Prize / Product updated successfully ....",
                        prizeUpdated: prizeUpdated,
                        productUpdated: productUpdated,
                        prize: prize,
                        product: product
                    }, {status: 200});

                } else {
                    return NextResponse.json({
                        messge: "prize not found ...",
                    }, {status: 200});
                }

            } else {
                return NextResponse.json({
                    messge: "Prize / Product could not be updated ....",
                }, {status: 500});
            }
        }

    } catch (error) {
        return NextResponse.json({
            messge: "Failed to update Product ....",
            error: JSON.stringify(error)
          }, {status: 500});
    }
}

export async function DELETE(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var product: any = await Product.findOne({_id: id})
        var deletedProduct = await Product.deleteOne({_id: id});
        if(deletedProduct) {
            if(product.game_id !== null) {
                var deletedGame = await Game.deleteOne({_id: product.game_id});
                return NextResponse.json({
                    messge: "Game / Product deleted successfully ....",
                    deletedGame: deletedGame,
                    deletedProduct: deletedProduct
                }, {status: 200});
            } else if(product.prize_id !== null) {
                var deletedPrize = await Prize.deleteOne({_id: product.prize_id});
                return NextResponse.json({
                    messge: "Game / Product deleted successfully ....",
                    deletedPrize: deletedPrize,
                    deletedProduct: deletedProduct
                }, {status: 200});
            }
        } else {
            return NextResponse.json({
                messge: "Failed to delete Game / Product ....",
              }, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({
            messge: "Failed to delete Game / Product ....",
          }, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var product = await Product.findOne({_id: id});
        var game: any = [];
        var prize: any = [];
        if(product && product.game_id !== null) {
            game = await Game.findOne({_id: product.game_id});
        }

        if(product && product.prize_id !== null) {
            prize = await Prize.findOne({_id: product.prize_id});
        }
        return NextResponse.json({
            messge: "Query successful ....",
            product: product,
            game: game,
            prize: prize

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
        var current_date = new Date().toISOString().slice(0, 10);
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var product_type = searchparams.get('product_type') + '';
        var type = searchparams.get('type') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');

        var game_prize_check = product_type === 'games' ?
        [
            {type: type},
            {game_id: {$ne: null}}
        ]
        :
        [
            {type: type},
            {prize_id: {$ne: null}}
        ]

        var products = await Product.
        aggregate([
            {
                $match: {
                  $and: game_prize_check
                },
            },
            {
                $lookup: {
                    from: "games",
                    localField: "game_id",
                    foreignField: "_id",
                    as: "gameInProduct",
                },
            },
            {
                $lookup: {
                    from: "prizes",
                    localField: "prize_id",
                    foreignField: "_id",
                    as: "prizeInProduct",
                },
            }
        ]).sort({'createdAt': -1}).skip(skip).limit(limit);

        return NextResponse.json({
            messge: "Query successful ....",
            products: products
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

        var merchant_game_products_count = await Product.find({
            type: 'merchant',
            game_id: {$ne: null} 
        }).countDocuments();

        var merchant_prize_products_count = await Product.find({
            type: 'merchant',
            prize_id: {$ne: null} 
        }).countDocuments();

        var app_game_products_count = await Product.find({
            type: 'app-web',
            game_id: {$ne: null} 
        }).countDocuments();

        var app_prize_products_count = await Product.find({
            type: 'app-web',
            prize_id: {$ne: null}
        }).countDocuments();

        return NextResponse.json({
            messge: "query successful ....",
            merchant_game_products_count: merchant_game_products_count,
            merchant_prize_products_count: merchant_prize_products_count,

            app_game_products_count: app_game_products_count,
            app_prize_products_count: app_prize_products_count

        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error)
        }, {status: 200});
    }
    
}