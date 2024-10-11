import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
//import User from "@/models/UserModel";
import Machine from "@/models/MachineModel";
//import Product from "@/models/ProductModel";

export async function PUT(request: Request) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var action: any = searchparams.get('action') + '';

        if(action === 'change_status') {
            return changeStatus(request);
        }

        if(action === 'change_locked') {
            return changeLocked(request);
        }

    } catch (error) {
        return NextResponse.json({
            messge: "User could not be ....",
        }, {status: 500});
    }
}

async function changeStatus(request: Request) {
    try { 

        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var record: any = await Machine.findOne({_id: id}).select(['_id', 'status'])
        let updates = {
            $set: {
                status: record.status === 'Active' ? 'In Active' : 'Active',
            }
        }

        let updatedRecord = await Machine.updateOne({ _id: record._id }, updates);
        var record: any = await Machine.findOne({_id: id}).select(['_id', 'active'])

        return NextResponse.json({
            messge: "Record updated successfully ....",
            updatedRecord: updatedRecord,
            record: record
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Record could not be ....",
        }, {status: 500});
    }
    
}

async function changeLocked(request: Request) {
    try { 

        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        var record: any = await Machine.findOne({_id: id}).select(['_id', 'locked'])
        let updates = {
            $set: {
                locked: record.locked === 1 ? 0 : 1,
            }
        }

        let updatedRecord = await Machine.updateOne({ _id: record._id }, updates);
        var record: any = await Machine.findOne({_id: id}).select(['_id', 'locked'])

        return NextResponse.json({
            messge: "Record updated successfully ....",
            updatedRecord: updatedRecord,
            record: record
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "Record could not be ....",
        }, {status: 500});
    }
}