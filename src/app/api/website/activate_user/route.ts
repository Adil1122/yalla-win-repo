import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import User from "@/models/UserModel";

export async function POST(request: any) {

    try {
        connectMongoDB();
        let {email, otp, saved_otp} = await request.json();
        let user = await User.findOne({email});
        if(user) {
            if(otp === saved_otp) {

              const query = { _id: user._id };
              const updates = {
                $set: {
                  active: 1,
                },
              };

              let result = await User.updateOne(query, updates);

              if(result.modifiedCount === 1) {
                return NextResponse.json({
                  messge: "user account is activated ....",
                }, {status: 200});
              } else {
                return NextResponse.json({
                  messge: "problem in activating account ....",
                }, {status: 500});
              }

            } else {
                return NextResponse.json({
                    messge: "otp mismatched ....",
                  }, {status: 500});
            }
        } else {
            return NextResponse.json({
                messge: "user not found ....",
              }, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({
            messge: "An error accured ....",
            error: error,
        }, {status: 500});
    }
}