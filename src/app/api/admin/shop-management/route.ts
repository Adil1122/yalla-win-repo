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
        
        if ((machine_id && machine_id !== '') || (merchant_id && merchant_id !== '')) {

            let conditions = [];

            if (merchant_id) conditions.push({ merchant_id });
            if (machine_id) conditions.push({ machine_id });
      
            let existingShop = null;
            if (conditions.length > 0) {
               existingShop = await Shop.findOne({ $or: conditions });
            }

            if (existingShop) {
               return NextResponse.json(
                  { message: "Shop already exists for the given Merchant ID or Machine ID." }, 
                  { status: 402 }
               );
            }
        }
        

        let newDocument : any = {
           name: name,
           location: location,
           registeration_date: registeration_date
         }
         
         if (machine_id && machine_id !== '') {
            newDocument.machine_id = machine_id;
         }
         
         if (merchant_id && merchant_id !== '') {
            var merchant: any = await User.findOne({_id: merchant_id}).select(['_id', 'city', 'country']);
            newDocument.merchant_id = merchant_id;
            newDocument.city = merchant.city;
            newDocument.country = merchant.country;
        }

        let result = await Shop.create(newDocument);

        let merchantUpdateResult : any = null
        let merchantUpdate : any = null

        if (merchant_id && merchant_id !== '') {
           
           merchantUpdate = {
               $set: {
                   shop_id: result._id
               }
           }

           if (machine_id && machine_id !== '') {
              merchantUpdate.$set.machine_id = machine_id;
           }

           merchantUpdateResult = await User.updateOne({_id: merchant_id}, merchantUpdate);
        }

        var machineUpdateResult = null
        if (machine_id && machine_id !== '') {

           var machineUpdate = {
               $set: {
                   merchant_id: merchant_id,
                   shop_id: result._id
               }
           }
           machineUpdateResult = await Machine.updateOne({_id: machine_id}, machineUpdate);
        }

        return NextResponse.json({
            messge: "Shop created successfully ....",
            result: result,
            merchantUpdateResult: merchantUpdateResult,
            machineUpdateResult: machineUpdateResult
        }, {status: 200});
    } catch (error) {
      console.log(error)
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

        var start_date = new Date().toISOString().slice(0, 10)
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        var end_date = tomorrowDate.toISOString().slice(0, 10);

        if(schedule === 'weekly') {
            start_date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        }

        if(schedule === 'monthly') {
            start_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        }

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
                        //search_json
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
        ]).sort({'registeration_date': -1});

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