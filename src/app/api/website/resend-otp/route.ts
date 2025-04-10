import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import getDistance from "@/libs/get_distance";
// @ts-ignore
import getMAC, { isMAC } from 'getmac';
import User from "@/models/UserModel";
import connectMongoDB from "@/libs/mongoosdb";
//import { writeFile } from "fs/promises";
import { put } from '@vercel/blob';
import createMessage from "@/libs/send_sms";
import createWhatsAppMessage from "@/libs/send_whatsapp_message";
import sendEmail from "@/libs/send_email";

export async function POST(request: Request) {
    
   try {
   
      const data = await request.formData();
      var otp_type = data.get('type');
      var email = data.get('email') as string;
      var otp_number = Math.floor(Math.random() * 90000) + 10000;
      let emailResult : any = ''

      if(otp_type === 'email') {
         emailResult = await sendEmail(email, 'OTP Verification', '', 'Your OTP for Yalla Win Sign Up is <b>' + otp_number + '</b>');
      }

      if(otp_type === 'sms') {
         console.log('sms called')
      }

      if(otp_type === 'whatsapp') {
         console.log('whatsapp called')
      }

      return NextResponse.json({
         messge: "OTP resent ....",
         otp: otp_number,
         email: emailResult
      }, {status: 200});
   } catch (err) {
      console.error(err);
      return NextResponse.json({messge: JSON.stringify(err)}, {status: 500});
   }
}