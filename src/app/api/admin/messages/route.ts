import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Notification from "@/models/NotificationModel";
import Message from "@/models/MessageModel";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        var title:any = data.get('title');
        var contents:any = data.get('contents');
        var sender_id:any = data.get('sender_id');
        var receiver_id:any = data.get('receiver_id');
        var message_date:any = data.get('message_date');
        let newDocument = {
            title: title,
            contents: contents,
            message_date: message_date,
            sender_id: sender_id,
            receiver_id: receiver_id
        };
        let message = await Message.create(newDocument);

        return NextResponse.json({
            messge: "Message successfully created ....",
            message: message
          }, {status: 200});
        
    } catch (error) {

        console.log(error)

        return NextResponse.json({
            messge: "Message could not be created ....",
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
        var title:any = data.get('title');
        var contents:any = data.get('contents');
        var sender_id:any = data.get('sender_id');
        var receiver_id:any = data.get('receiver_id');
        var message_date:any = data.get('message_date');
        var messageObj = await Message.findOne({_id: id});
        if(messageObj) {
            const query = { _id: messageObj._id };
            let updates = {
                $set: {
                    title: title,
                    contents: contents,
                    message_date: message_date,
                    sender_id: sender_id,
                    receiver_id: receiver_id
                }
            };
            var message = await Message.updateOne(query, updates);
            return NextResponse.json({
                messge: "Message successfully updated ....",
                message: message
              }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Message could not be found ....",
              }, {status: 500});
        }
        
    } catch (error) {

        return NextResponse.json({
            messge: "Message could not be updated ....",
          }, {status: 500});
        
    }
}

export async function DELETE(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var deleted = await Message.deleteOne({_id: id});
        if(deleted) {
            return NextResponse.json({
                messge: "Message successfully deleted ....",
                deleted: deleted
              }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Message could not be deleted ....",
              }, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({
            messge: "Message could not be deleted ....",
          }, {status: 500});
    }
}