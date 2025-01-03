import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import User from "@/models/UserModel";
import Shop from "@/models/ShopModel";
import Machine from "@/models/MachineModel";
import { getStartEndDates } from "@/libs/common";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        var first_name:any = data.get('first_name');
        var last_name:any = data.get('last_name');
        var name:any = first_name + ' ' + last_name;
        var eid:any = data.get('eid');
        var email:any = data.get('email');
        var mobile:any = data.get('mobile');
        var shop_id:any = data.get('shop_id');
        var machine_id:any = data.get('machine_id');
        var profit_percentage:any = data.get('profit_percentage');
        var registeration_date:any = data.get('registeration_date');
        var country:any = data.get('country');
        var city:any = data.get('city');
        var area:any = data.get('area');
        var password:any = data.get('password');
        let bcrypt_password = await bcrypt.hash(password, 8);
        let newDocument = {
            first_name: first_name,
            last_name: last_name,
            name: name,
            eid: eid,
            email: email,
            password: bcrypt_password,
            password_text: password,
            mobile: mobile,
            shop_id: shop_id,
            machine_id: machine_id,
            profit_percentage: parseFloat(profit_percentage),
            registeration_date: registeration_date,
            role: 'merchant',
            active: 1,
            country: country,
            city: city,
            area: area,
            user_type: 'merchant',
            mac: ""
        }
        //console.log(newDocument)

        let result = await User.create(newDocument);

        var shopUpdate = {
            $set: {
                merchant_id: result._id,
                machine_id: machine_id
            }
        }
        var shopUpdateResult = await Shop.updateOne({_id: shop_id}, shopUpdate);

        var machineUpdate = {
            $set: {
                merchant_id: result._id,
                shop_id: shop_id
            }
        }
        var machineUpdateResult = await Machine.updateOne({_id: machine_id}, machineUpdate);



        return NextResponse.json({
            messge: "Merchant created successfully ....",
            result: result,
            shopUpdateResult: shopUpdateResult,
            machineUpdateResult: machineUpdateResult
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Merchant could not be created ....",
        }, {status: 500});
    }
}

export async function PUT(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var user = await User.findOne({_id: id})
        if(!user) {
            return NextResponse.json({
                messge: "Merchant not found ....",
            }, {status: 500});
        } else {
            const data = await request.formData();
            var first_name:any = data.get('first_name');
            var last_name:any = data.get('last_name');
            var name:any = first_name + ' ' + last_name;
            var eid:any = data.get('eid');
            var email:any = data.get('email');
            var mobile:any = data.get('mobile');
            var shop_id:any = data.get('shop_id');
            var machine_id:any = data.get('machine_id');
            var profit_percentage:any = data.get('profit_percentage');
            var registeration_date:any = data.get('registeration_date');
            var country:any = data.get('country');
            var city:any = data.get('city');
            var area:any = data.get('area');
            var password:any = data.get('password');
            let bcrypt_password = await bcrypt.hash(password, 8);
            let updates = {
                $set: {
                    first_name: first_name,
                    last_name: last_name,
                    name: name,
                    eid: eid,
                    email: email,
                    password: bcrypt_password,
                    password_text: password,
                    mobile: mobile,
                    shop_id: shop_id,
                    machine_id: machine_id,
                    profit_percentage: parseFloat(profit_percentage),
                    registeration_date: registeration_date,
                    role: 'merchant',
                    active: 1,
                    country: country,
                    city: city,
                    area: area,
                    user_type: 'merchant',
                    mac: ""
                }
            }
            var result = await User.updateOne({_id: user._id}, updates);

            var shopUpdate = {
                $set: {
                    merchant_id: user._id
                }
            }
            var shopUpdateResult = await Shop.updateOne({_id: shop_id}, shopUpdate);
    
            var machineUpdate = {
                $set: {
                    merchant_id: user._id
                }
            }
            var machineUpdateResult = await Machine.updateOne({_id: machine_id}, machineUpdate);

            return NextResponse.json({
                messge: "Merchant updated successfully ....",
                result: result,
                shopUpdateResult: shopUpdateResult,
                machineUpdateResult: machineUpdateResult
            }, {status: 200});
        }

    } catch (error) {
        return NextResponse.json({
            messge: "Merchant could not be updated ....",
        }, {status: 500});
    }
}

export async function DELETE(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var deletedMerchant = await User.deleteOne({_id: id});
        if(deletedMerchant) {
            return NextResponse.json({
                messge: "Merchant deleted successfully ....",
                deletedMerchant: deletedMerchant
            }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Merchant could not be deleted ....",
            }, {status: 500});
        }
    } catch(error) {
        return NextResponse.json({
            messge: "Merchant could not be deleted ....",
        }, {status: 500});
    }
} 

export async function PATCH(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var result = await User.findOne({_id: id});
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
       var shops_machines: any = searchparams.get('shops_machines') + '';
       var start: any = searchparams.get('start') + '';
       if(shops_machines === 'shops') {
           var shops = await Shop.find({registeration_date: {$ne: null}});
           return NextResponse.json({
               messge: "Query success ....",
               shops: shops,
           }, {status: 200});

       } else {
           var shop_id: any = searchparams.get('shop_id') + ''; 
           var machine = await Machine.find({shop_id: shop_id}).select(['_id']).limit(1);
           return NextResponse.json({
               messge: "Query success ....",
               machine_id: machine && machine.length > 0 ? machine[0]._id : null
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

        const merchants = await User
        .aggregate([
            { $match:
                {
                    $and: [ 
                        {
                            createdAt: {
                                $gte : new Date(start_date), 
                                $lt: new Date(end_date)
                            }
                        }, 
                        {role: 'merchant'},
                        search_json
                    ]
                },
            },
            {
                $lookup: {
                    from: 'machines',
                    localField: "machine_id",
                    foreignField: "_id",
                    as: "merchantWithMachine",
                }
            },
        ]).sort({'createdAt': -1}).skip(skip).limit(limit);

        if(merchants && merchants.length > 0) {
            /*var merchant_ids = [];
            for(var i = 0; i < merchants.length; i++) {
                merchant_ids.push(merchants[i]._id);
            }
            console.log(merchant_ids)

            const machines = await Machine
            .find({merchant_id: {$in: merchant_ids}}).select(['_id', 'machine_id', 'merchant_id']);*/
            
            return NextResponse.json({
                messge: "Query success ....",
                merchants: merchants,
                machines: [],
            }, {status: 200});

        } else {
            return NextResponse.json({
                messge: "Query success ....",
                merchants: [],
                machines: [],
            }, {status: 200});
        }

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}