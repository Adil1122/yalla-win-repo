import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Notification from "@/models/NotificationModel";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const data = await request.formData();
        var title:any = data.get('title');
        var content:any = data.get('content');
        var date: any = data.get('date');
        var time: any = data.get('time');
        var type: any = data.get('type');
        var notification_date:any = data.get('notification_date');
        let newDocument = {
            title: title,
            content: content,
            notification_date: notification_date,
            date: date,
            time: time,
            type: type
        };
        let notification = await Notification.create(newDocument);

        return NextResponse.json({
            messge: "Notification successfully created ....",
            notification: notification
          }, {status: 200});
        
    } catch (error) {

        return NextResponse.json({
            messge: "Notification could not be created ....",
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
        var content:any = data.get('content');
        var date: any = data.get('date');
        var time: any = data.get('time');
        var notification_date:any = data.get('notification_date');
        var notificationObj = await Notification.findOne({_id: id});
        if(notificationObj) {
            const query = { _id: notificationObj._id };
            let updates = {
                $set: {
                    title: title,
                    content: content,
                    date: date,
                    time: time,
                    notification_date: notification_date,
                }
            };
            var notification = await Notification.updateOne(query, updates);
            return NextResponse.json({
                messge: "Notification successfully updated ....",
                notification: notification
              }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Notification could not be found ....",
              }, {status: 500});
        }
        
    } catch (error) {

        return NextResponse.json({
            messge: "Notification could not be updated ....",
          }, {status: 500});
        
    }
}

export async function DELETE(request: Request) {
    try {
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var deleted = await Notification.deleteOne({_id: id});
        if(deleted) {
            return NextResponse.json({
                messge: "Notification successfully deleted ....",
                deleted: deleted
              }, {status: 200});
        } else {
            return NextResponse.json({
                messge: "Notification could not be deleted ....",
              }, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({
            messge: "Notification could not be deleted ....",
          }, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var notification = await Notification.findOne({_id: id});
        return NextResponse.json({
            messge: "Query successful ....",
            notification: notification
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
        var new_past = searchparams.get('new_past') + '';
        var type = searchparams.get('type') + '';
        var skip = parseInt(searchparams.get('skip') + '');
        var limit = parseInt(searchparams.get('limit') + '');

        var date_check = new_past === 'new' ? {
            $gte : new Date(current_date)
        } : {
            $lt : new Date(current_date)
        }

        var notifications = await Notification.find({
            type: type,
            notification_date: date_check

        }).sort({'notification_date': -1}).skip(skip).limit(limit);

        return NextResponse.json({
            messge: "Query successful ....",
            notifications: notifications
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
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var current_date = new Date().toISOString().slice(0, 10);

        var new_merchant_notifications_count = await Notification.find({
            type: 'merchant',
            notification_date: {
                $gte : new Date(current_date)
            }
        }).countDocuments();

        var new_app_web_notifications_count = await Notification.find({
            type: 'app-web',
            notification_date: {
                $gte : new Date(current_date)
            }
        }).countDocuments();

        var old_merchant_notifications_count = await Notification.find({
            type: 'merchant',
            notification_date: {
                $lt : new Date(current_date)
            }
        }).countDocuments();

        var old_app_web_notifications_count = await Notification.find({
            type: 'app-web',
            notification_date: {
                $lt : new Date(current_date)
            }
        }).countDocuments();

        return NextResponse.json({
            messge: "query successful ....",
            new_merchant_notifications_count: new_merchant_notifications_count,
            new_app_web_notifications_count: new_app_web_notifications_count,

            old_merchant_notifications_count: old_merchant_notifications_count,
            old_app_web_notifications_count: old_app_web_notifications_count

        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error)
        }, {status: 200});
    }
    
}