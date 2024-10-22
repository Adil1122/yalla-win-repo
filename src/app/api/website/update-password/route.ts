import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import connectMongoDB from '@/libs/mongoosdb'; // Adjust this import based on your file structure
import User from '@/models/UserModel'; // Adjust this import based on your file structure

export async function POST(request: Request) {
  try {

    connectMongoDB();
    let {user_id, password} = await request.json();

    console.log('user_id: ', password)
    let bcrypt_password = await bcrypt.hash(password, 8);
    console.log('user_id: ', bcrypt_password)

    const query = { _id: user_id };
    const updates = {
      $set: {
        password: bcrypt_password,
        password_text: password
      },
    };
    let result = await User.updateOne(query, updates);

    if(result && result.modifiedCount === 1) {
      return NextResponse.json({
        messge: "user password is updated ....",
      }, {status: 200});
    } else {
      return NextResponse.json({
        messge: "user password is not updated ....",
      }, {status: 500});
    }


    
  } catch (error) {
    return NextResponse.json({
      messge: "some server error ....",
    }, {status: 500});
  }
}
