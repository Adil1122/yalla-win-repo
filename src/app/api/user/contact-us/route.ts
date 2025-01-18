import { NextResponse } from "next/server";
import sendEmail from "@/libs/send_email";

export async function POST(request: any) {
    try {
        let {first_name, last_name, email, topic, message} = await request.json();
        await sendEmail(email, topic, 'Hi ' + first_name + ' ' + last_name, message);

        return NextResponse.json({
            messge: "Email successfully sent ....",
          }, {status: 200});

    } catch (error) {

        return NextResponse.json({
            messge: "Email sending failed ....",
            error: JSON.stringify(error)
          }, {status: 500});

    }
}