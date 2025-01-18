import { NextResponse } from "next/server";
import sendEmail from "@/libs/send_email";

export async function POST(request: any) {
    try {
         const data = await request.formData();
         const first_name = data.get('first_name');
         const last_name = data.get('last_name');
         const email = data.get('email');
         const topic = data.get('topic');
         const message = data.get('message');

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