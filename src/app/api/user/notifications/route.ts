import { NextResponse } from "next/server";
// @ts-ignore
import connectMongoDB from "@/libs/mongoosdb";
import Notification from "@/models/NotificationModel";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        var notifications = await Notification.find({_id: {$ne: null}}).sort({'createdAt': -1}).limit(1000);
        return NextResponse.json({
            messge: "Query successful ....",
            notifications: notifications
          }, {status: 200});
    } catch (error) {
        return NextResponse.json({
            messge: "Query error ....",
          }, {status: 500});
    }
}