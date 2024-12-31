import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Machine from "@/models/MachineModel";
import User from "@/models/UserModel";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var machine_id: any = searchparams.get('machine_id') + '';

        var machine = await Machine.findOne({_id: machine_id})
        
        var merchant = null
        if(machine) {
            merchant = await User.findOne({_id: machine.merchant_id}).select(['name', 'initial_coords'])
            //console.log(merchant)
        }

        return NextResponse.json({
            messge: "Query success ....",
            merchant: merchant
         }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
         }, {status: 200});
    }
}