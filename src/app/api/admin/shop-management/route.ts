import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Shop from "@/models/ShopModel";
import User from "@/models/UserModel";
import Machine from "@/models/MachineModel";
import Invoice from "@/models/InvoiceModel";
import { getStartEndDates } from "@/libs/common";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        var name:any = data.get('name');
        var merchant_id:any = data.get('merchant_id');
        var location:any = data.get('location');
        var machine_id:any = data.get('machine_id');
        var registeration_date:any = data.get('registeration_date');
        var merchant: any = await User.findOne({_id: merchant_id}).select(['_id', 'city', 'country']);

        if(merchant) {
            let newDocument = {
                name: name,
                merchant_id: merchant_id,
                location: location,
                machine_id: machine_id,
                registeration_date: registeration_date,
                city: merchant.city,
                country: merchant.country,
            }
    
            let result = await Shop.create(newDocument);

            var merchantUpdate = {
                $set: {
                    shop_id: result._id,
                    machine_id: machine_id
                }
            }
            var merchantUpdateResult = await User.updateOne({_id: merchant_id}, merchantUpdate);
    
            var machineUpdate = {
                $set: {
                    merchant_id: merchant_id,
                    shop_id: result._id
                }
            }
            var machineUpdateResult = await Machine.updateOne({_id: machine_id}, machineUpdate);
    
            return NextResponse.json({
                messge: "Shop created successfully ....",
                result: result,
                merchantUpdateResult: merchantUpdateResult,
                machineUpdateResult: machineUpdateResult
            }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Merchant not found ....",
            }, {status: 500});
        }

    } catch (error) {
        return NextResponse.json({
            messge: "Shop could not be created ....",
        }, {status: 500});
    }
}

export async function PUT(request: Request) {
    try {
        await connectMongoDB();

        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var shop = await Shop.findOne({_id: id})
        if(!shop) {
            return NextResponse.json({
                messge: "Shop not found ....",
            }, {status: 500});
        } else {

            const data = await request.formData();
            var name:any = data.get('name');
            var merchant_id:any = data.get('merchant_id');
            var location:any = data.get('location');
            var machine_id:any = data.get('machine_id');
            var registeration_date:any = data.get('registeration_date');
            var merchant: any = User.findOne({_id: merchant_id}).select(['_id', 'city', 'country']);
            if(merchant) {
                let updates = {
                    $set: {
                        name: name,
                        merchant_id: merchant_id,
                        location: location,
                        machine_id: machine_id,
                        registeration_date: registeration_date,
                        city: merchant.city,
                        country: merchant.country,
                    }
                }

                let result = await Shop.updateOne({_id: shop._id}, updates);
                
                var merchantUpdate = {
                    $set: {
                        shop_id: shop._id,
                        machine_id: machine_id
                    }
                }
                var merchantUpdateResult = await User.updateOne({_id: merchant_id}, merchantUpdate);
        
                var machineUpdate = {
                    $set: {
                        merchant_id: merchant_id,
                        shop_id: shop._id
                    }
                }
                var machineUpdateResult = await Machine.updateOne({_id: machine_id}, machineUpdate);

                return NextResponse.json({
                    messge: "Shop updated successfully ....",
                    result: result,
                    merchantUpdateResult: merchantUpdateResult,
                    machineUpdateResult: machineUpdateResult
                }, {status: 200});

            } else {
                return NextResponse.json({
                    messge: "Merchant not found ....",
                }, {status: 500});
            }
        }

    } catch (error) {
        return NextResponse.json({
            messge: "Shop could not be updated ....",
        }, {status: 500});
    }
}

export async function DELETE(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var deletedShop = await Shop.deleteOne({_id: id});
        if(deletedShop) {
            return NextResponse.json({
                messge: "Shop deleted successfully ....",
                deletedShop: deletedShop
            }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Shop could not be deleted ....",
            }, {status: 500});
        }
    } catch(error) {
        return NextResponse.json({
            messge: "Shop could not be deleted ....",
        }, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var result = await Shop.findOne({_id: id});
        return NextResponse.json({
            messge: "Query successful ....",
            result: result
          }, {status: 200});

    } catch (error) {

        return NextResponse.json({
            messge: "Query error ....",
          }, {status: 500});

    }
}

export async function OPTIONS(request: Request) {
    try {
       await connectMongoDB();
       var url = new URL(request.url);
       var searchparams = new URLSearchParams(url.searchParams);
       var merchants_machines: any = searchparams.get('merchants_machines') + '';
       var start: any = searchparams.get('start') + '';
       if(merchants_machines === 'merchants') {
           var merchants = await User.find({role: 'merchant'}, {active: 1}, {locked: 0}).select(['_id', 'name', 'first_name', 'last_name']);
           return NextResponse.json({
               messge: "Query success ....",
               merchants: merchants
           }, {status: 200});

       } else {
           var merchant_id: any = searchparams.get('merchant_id') + ''; 
           var machines = await Machine.find({merchant_id: merchant_id}).select(['_id', 'machine_id']);
           return NextResponse.json({
               messge: "Query success ....",
               machines: machines
           }, {status: 200}); 
       }
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
        var schedule = searchparams.get('schedule') + '';
        //var merchant_id = searchparams.get('merchant_id') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');
        var search_by = searchparams.get('search_by') + '';
        var search = searchparams.get('search') + '';

        var dates = getStartEndDates(schedule)
        var start_date = dates.start_date
        var end_date = dates.end_date

        var search_json = search_by === 'countries' ? 
        {country: { $regex: '.*' + search + '.*', $options: 'i' }} 
        :
        {city: { $regex: '.*' + search + '.*', $options: 'i' }}

        const shops = await Shop
        .aggregate([
            {
                $match: {
                    $and:[ 
                        {
                            registeration_date: {
                                $gte : new Date(start_date), 
                                $lt: new Date(end_date)
                            }
                        },
                        search_json
                    ]
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "merchant_id",
                    foreignField: "_id",
                    as: "merchantWithShop",
                }
            }
        ]).sort({'registeration_date': -1}).skip(skip).limit(limit);

        if(shops && shops.length > 0) {
            var merchant_ids = [];
            for(var i = 0; i < shops.length; i++) {
                merchant_ids.push(shops[i].merchant_id);
            }

            const invoices = await Invoice
            .aggregate([
                {
                    $match: {
                        user_id: {$in: merchant_ids}  
                    },
                },
                {
                    $group :
                      {
                        _id : "$user_id",
                        totalSaleAmount: { $sum: "$total_amount" }
                      }
                },
            ]);
            
            return NextResponse.json({
                messge: "Query success ....",
                invoices: invoices,
                shops: shops,
            }, {status: 200});

        } else {
            return NextResponse.json({
                messge: "Query success ....",
                invoices: [],
                shops: [],
            }, {status: 200});
        }

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}