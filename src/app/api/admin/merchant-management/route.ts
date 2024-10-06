import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import User from "@/models/UserModel";
import Shop from "@/models/ShopModel";
import Machine from "@/models/MachineModel";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        var name:any = data.get('name');
        var eid:any = data.get('eid');
        var email:any = data.get('email');
        var mobile:any = data.get('mobile');
        var shop_id:any = data.get('shop_id');
        //var machine_id:any = data.get('machine_id');
        var profit_percentage:any = data.get('profit_percentage');
        var registeration_date:any = data.get('registeration_date');
        let newDocument = {
            name: name,
            eid: eid,
            email: email,
            mobile: mobile,
            shop_id: shop_id,
            //machine_id: machine_id,
            profit_percentage: parseFloat(profit_percentage),
            registeration_date: registeration_date,
            role: 'merchant',
            active: 1
        }
        //console.log(newDocument)

        let result = await User.create(newDocument);
        console.log(result)

        return NextResponse.json({
            messge: "Merchant created successfully ....",
            result: result
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
            var name:any = data.get('name');
            var eid:any = data.get('eid');
            var email:any = data.get('email');
            var mobile:any = data.get('mobile');
            var shop_id:any = data.get('shop_id');
            //var machine_id:any = data.get('machine_id');
            var profit_percentage:any = data.get('profit_percentage');
            var registeration_date:any = data.get('registeration_date');
            let updates = {
                $set: {
                name: name,
                eid: eid,
                email: email,
                mobile: mobile,
                shop_id: shop_id,
                //machine_id: machine_id,
                profit_percentage: parseFloat(profit_percentage),
                registeration_date: registeration_date,
                role: 'merchant',
                active: 1
                }
            }
            var result = await User.updateOne({_id: user._id}, updates);
            return NextResponse.json({
                messge: "Merchant updated successfully ....",
                result: result
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

        var start_date = new Date().toISOString().slice(0, 10)
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        var end_date = tomorrowDate.toISOString().slice(0, 10);
        

        if(schedule === 'weekly') {
            start_date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        }

        if(schedule === 'monthly') {
            start_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        }

        const merchants = await User
        .find(
            {createdAt: {
                $gte : new Date(start_date), 
                $lt: new Date(end_date)
            }},
            {role: 'merchant'}
        ).sort({'createdAt': -1}).skip(skip).limit(limit).select(['_id', 'name', 'area', 'email', 'mobile']);

        if(merchants && merchants.length > 0) {
            var merchant_ids = [];
            for(var i = 0; i < merchants.length; i++) {
                merchant_ids.push(merchants[i]._id);
            }
            console.log(merchant_ids)

            const machines = await Machine
            .find({merchant_id: {$in: merchant_ids}}).select(['_id', 'machine_id']);
            
            return NextResponse.json({
                messge: "Query success ....",
                merchants: merchants,
                machines: machines,
            }, {status: 200});

        } else {
            return NextResponse.json({
                messge: "Machines not found ....",
            }, {status: 500});
        }

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});
    }
}