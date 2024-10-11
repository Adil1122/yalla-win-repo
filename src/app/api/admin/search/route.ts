import { NextResponse } from "next/server";
import User from "@/models/UserModel";

export async function GET(request: Request) {
    try {
        var users = await User.find({role: 'user'}).select(['id', 'city', 'country']);

        return NextResponse.json({
            messge: "Query successful ....",
            users: users
        }, {status: 200});

    } catch (error) {

        return NextResponse.json({
            messge: "Query error ....",
            error: JSON.stringify(error)
        }, {status: 500});

    }
}
