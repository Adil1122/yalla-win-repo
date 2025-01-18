import { NextResponse } from "next/server";
import sendEmail from "@/libs/send_email";
import connectMongoDB from '@/libs/mongoosdb';
import User from '@/models/UserModel'; // Assuming you have a User model

export async function POST(request: any) {
    try {

        // Connect to the MongoDB database
        await connectMongoDB();
        let { email } = await request.json();
        console.log(email);

        // Get the user from the database using the email address
        const user = await User.findOne({ email });

        if(user) {
            console.log('user', user);

            // Define your reset link. Consider using environment variables in production.
            const resetLink = `${process.env.BASE_URL}reset-password/${user._id.toString()}`;

            // Send reset password email
            await sendEmail(email, 'Your Reset Password link', '', `<a href="${resetLink}">Reset Password</a>`);

            return NextResponse.json({ message: "An email sent to reset your password ..." }, { status: 200 });
        } else {
            return NextResponse.json({ message: "User not found..." }, { status: 201 });
        }

    } catch (error) {
        return NextResponse.json({
            message: "email not sent",
            error: error
        }, { status: 500 });
    }
}
