import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Machine from "@/models/MachineModel";
import User from "@/models/UserModel";
import Shop from "@/models/ShopModel";
import { getStartEndDates } from "@/libs/common";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        var merchant_id:any = data.get('merchant_id');
        var location:any = data.get('location');
        var machine_id:any = data.get('machine_id');
        var shop_id:any = data.get('shop_id');
        var merchant: any = await User.findOne({_id: merchant_id}).select(['_id', 'city', 'country']);

        if ((shop_id && shop_id !== '') || (merchant_id && merchant_id !== '')) {

            let conditions = [];

            if (shop_id) conditions.push({ shop_id });
            if (merchant_id) conditions.push({ merchant_id });
      
            let existingMachine = null;
            if (conditions.length > 0) {
               existingMachine = await Machine.findOne({ $or: conditions });
            }

            if (existingMachine) {
               return NextResponse.json(
                  { message: "Machine already exists for the given Merchant ID or Shop ID." }, 
                  { status: 402 }
               );
            }
      }

        if(merchant) {
            let newDocument = {
                merchant_id: merchant_id,
                location: location,
                machine_id: machine_id,
                shop_id: shop_id,
                status: "Active",
                locked: 0,
                city: merchant.city,
                country: merchant.country,
            }
    
            let result = await Machine.create(newDocument);

            var shopUpdate = {
                $set: {
                    merchant_id: merchant_id,
                    machine_id: result._id
                }
            }
            var shopUpdateResult = await Shop.updateOne({_id: shop_id}, shopUpdate);
    
            var merchantUpdate = {
                $set: {
                    machine_id: result._id,
                    shop_id: shop_id
                }
            }
            var merchantUpdateResult = await User.updateOne({_id: merchant_id}, merchantUpdate);
    
            return NextResponse.json({
                messge: "Machine created successfully ....",
                result: result,
                shopUpdateResult: shopUpdateResult,
                merchantUpdateResult: merchantUpdateResult
            }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Merchant not found ....",
            }, {status: 500}); 
        }

    } catch (error) {
        return NextResponse.json({
            messge: "Machine could not be created ....",
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
        var machine = await Machine.findOne({_id: id})
        if(!machine) {
            return NextResponse.json({
                messge: "Machine not found ....",
            }, {status: 500});
        } else {

            const data = await request.formData();
            var merchant_id:any = data.get('merchant_id');
            var location:any = data.get('location');
            var machine_id:any = data.get('machine_id');
            var shop_id:any = data.get('shop_id');
            var merchant: any = User.findOne({_id: merchant_id}).select(['_id', 'city', 'country']);
            if(merchant) {
                let updates = {
                    $set: {
                        merchant_id: merchant_id,
                        location: location,
                        machine_id: machine_id,
                        shop_id: shop_id,
                        status: "Active",
                        locked: 0,
                        city: merchant.city,
                        country: merchant.country,
                    }
                }

                let result = await Machine.updateOne({_id: machine._id}, updates);

                var shopUpdate = {
                    $set: {
                        merchant_id: merchant_id,
                        machine_id: machine._id
                    }
                }
                var shopUpdateResult = await Shop.updateOne({_id: shop_id}, shopUpdate);
        
                var merchantUpdate = {
                    $set: {
                        machine_id: machine._id,
                        shop_id: shop_id
                    }
                }
                var merchantUpdateResult = await User.updateOne({_id: machine_id}, merchantUpdate);

                return NextResponse.json({
                    messge: "Machine updated successfully ....",
                    result: result,
                    shopUpdateResult: shopUpdateResult,
                    merchantUpdateResult: merchantUpdateResult
                }, {status: 200});
            } else {
                return NextResponse.json({
                    messge: "Merchant not found ....",
                }, {status: 200});
            }

        }

    } catch (error) {
        return NextResponse.json({
            messge: "Machine could not be updated ....",
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
        console.log('id: ', id)
        var deletedMachine = await Machine.deleteOne({_id: id});
        if(deletedMachine) {
            return NextResponse.json({
                messge: "Machine deleted successfully ....",
                deletedMachine: deletedMachine
            }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Machine could not be deleted ....",
            }, {status: 500});
        }
    } catch(error) {
        return NextResponse.json({
            messge: "Machine could not be deleted ....",
        }, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var result = await Machine.findOne({_id: id});
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
       var merchants_shops: any = searchparams.get('merchants_shops') + '';
       var start: any = searchparams.get('start') + '';
       if(merchants_shops === 'merchants') {
           var merchants = await User.find({role: 'merchant'}, {active: 1}, {locked: 0}).select(['_id', 'name', 'first_name', 'last_name']);
           return NextResponse.json({
               messge: "Query success ....",
               merchants: merchants
           }, {status: 200});

       } else {
           var merchant_id: any = searchparams.get('merchant_id') + ''; 
           var shops = await Shop.find({merchant_id: merchant_id}).select(['_id', 'name']);
           return NextResponse.json({
               messge: "Query success ....",
               shops: shops
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

        const machines = await Machine
        .aggregate([
            {
                $match: {
                    
                    $and:[ 
                        {
                            createdAt: {
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
                    from: 'shops',
                    localField: "shop_id",
                    foreignField: "_id",
                    as: "machineWithShop",
                }
            }
        ]).sort({'createdAt': -1}).skip(skip).limit(limit);

        return NextResponse.json({
            messge: "Query successful ....",
            machines: machines
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}