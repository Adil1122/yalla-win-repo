import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Shop from "@/models/ShopModel";
import User from "@/models/UserModel";
import Machine from "@/models/MachineModel";
import Invoice from "@/models/InvoiceModel";

export async function OPTIONS(request: Request) {
    try {
       await connectMongoDB();
       var url = new URL(request.url);
       var searchparams = new URLSearchParams(url.searchParams);
       var for_type: any = searchparams.get('for_type') + '';
       if(for_type === 'user') {

           var merchants = await User.find({role: 'merchant'}, {active: 1}, {locked: 0}).select(['_id', 'name', 'first_name', 'last_name']);
           var users = await User.find({role: 'user'}, {active: 1}, {locked: 0}).select(['_id', 'name', 'first_name', 'last_name']);
           return NextResponse.json({
               messge: "Query success ....",
               merchants: merchants,
               users: users
           }, {status: 200});

       } else {

            var merchant_selected: any = searchparams.get('merchant_selected') + '';
            if(merchant_selected === '0') {

                var merchants = await User.find({role: 'merchant'}, {active: 1}, {locked: 0}).select(['_id', 'name', 'first_name', 'last_name']);
                return NextResponse.json({
                    messge: "Query success ....",
                    merchants: merchants,
                }, {status: 200});

            } else {

                var merchant_id: any = searchparams.get('merchant_id') + ''; 
                var shops = await Shop.find({merchant_id: merchant_id}).select(['_id', 'name']);
                return NextResponse.json({
                    messge: "Query success ....",
                    shops: shops,
                }, {status: 200});

            }

       }             
    } catch (error) {

       return NextResponse.json({
           messge: "Query error ....",
       }, {status: 500});

    }
}