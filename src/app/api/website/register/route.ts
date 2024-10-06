import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sendMail from "@/libs/send_email";
import getDistance from "@/libs/get_distance";
// @ts-ignore
import getMAC, { isMAC } from 'getmac';
import User from "@/models/UserModel";
import connectMongoDB from "@/libs/mongoosdb";
//import { writeFile } from "fs/promises";
import { put } from '@vercel/blob';

export async function POST(request: Request) {
    
    try {
      
        const data = await request.formData();
        var email:any = data.get('email');
        await connectMongoDB();
        let user = await User.findOne({email});
        if(user) {
          return NextResponse.json({messge: "User already exists ..."}, {status: 201});
        } else {

          console.log(getDistance(33.995979999999996, 72.9376745, 33.684422, 73.047882, 'K'))
          console.log(getMAC())

          var qr_code:any = Date.now() + Math.random();

          
          var first_name = data.get('first_name');
          var last_name = data.get('last_name');
          var name = first_name + ' ' + last_name;
          var dateOfBirth = data.get('dateOfBirth');
          console.log('dateOfBirth: ', dateOfBirth);
          var shippingAddress = data.get('shippingAddress');
          var residentialAddress = data.get('residentialAddress');
          var state= data.get ('state');
          var password:any = data.get('password');
          var country = data.get ('country');
          var city = data.get('city');
          var area = data.get('area');
          var country_code = data.get('country_code');
          var mobile = data.get('mobile');
          var notification_type = data.get('notification_type');
          var image:any = data.get('image');
          var image_name = '';
          var blob = null;
          if(image) {
            /*console.log('image: ', image)
            const byteData = await image.arrayBuffer();
            const buffer = Buffer.from(byteData);
            image_name = qr_code + '-' + image.name;
            const path = `./public/uploads/users/${image_name}`;
            await writeFile(path, buffer);*/

            image_name = qr_code + '-' + image.name;
            blob = await put(image_name, image, {
              access: 'public',
            });

          }

          let bcrypt_password = await bcrypt.hash(password, 8);
          let newDocument = {
            name: name,
            first_name: first_name,
            last_name: last_name,
            dateOfBirth:dateOfBirth,
            shippingAddress:shippingAddress,
            residentialAddress:residentialAddress,
            state:state,
            email: email,
            password: bcrypt_password,
            country:country,
            city:city,
            area:area,
            country_code: country_code,
            mobile: mobile,
            active: 0,
            locked: 0,
            //initial_coords: initial_coords,
            mac: getMAC(),
            qr_code: qr_code,
            //image: '/uploads/users/' + image_name,
            image: blob ? blob.url : '',
            role: 'user'
          };
          
          let result = await User.create(newDocument);
          var otp = Math.floor(Math.random() * 90000) + 10000;

          if(notification_type === 'email') {
            sendMail(email, 'OTP Verification', '', 'Your OTP is <b>' + otp + '</b>');
          }

          if(notification_type === 'sms') {

          }

          if(notification_type === 'whatsapp') {
            
          }

          return NextResponse.json({
            messge: "User successfully registered ....",
            result: result,
            otp: otp
          }, {status: 200});
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({messge: JSON.stringify(err)}, {status: 500});
    }
}