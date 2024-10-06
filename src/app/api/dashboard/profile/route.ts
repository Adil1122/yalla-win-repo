import { NextResponse } from "next/server";
// @ts-ignore
import User from "@/models/UserModel";
import connectMongoDB from "@/libs/mongoosdb";
//import { writeFile } from "fs/promises";
//import fs from "fs";
//import { join } from "path";
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    await connectMongoDB();

    // Generate a unique code for the image file
    const qr_code = Date.now() + Math.random();

    const first_name = data.get('first_name');
    const last_name = data.get('last_name');
    const dateOfBirth = data.get('dateOfBirth');
    const shippingAddress = data.get('shippingAddress');
    const residentialAddress = data.get('residentialAddress');
    const state = data.get('state');
    const country = data.get('country');
    const city = data.get('city');
    const area = data.get('area');
    const country_code = data.get('country_code');
    const mobile = data.get('mobile');
    const id = data.get('id');
    
    let image = data.get('image');
    let image_name = '';
    let user: any = await User.findOne({_id: id});

    // Handle the image if present
    var blob = null;
    if (image && image instanceof Blob) {
      console.log('Image found:', image);

      // Convert image Blob to Buffer
      //const byteData = await image.arrayBuffer();
      //const buffer = Buffer.from(byteData);
      //const path = `./public/uploads/users/${image_name}`;
      //const path = join('/', 'tmp', image_name)
      //await writeFile(path, buffer);
      
      image_name = qr_code + '-' + image.name;
      blob = await put(image_name, image, {
        access: 'public',
      });

      console.log('Image successfully saved:', image_name); 
    }

    // Create the user update document
    var name = first_name + ' ' + last_name;
    const newDocument = {
      first_name,
      last_name,
      name,
      dateOfBirth,
      shippingAddress,
      residentialAddress,
      state,
      country,
      city,
      area,
      country_code,
      mobile,
      //image: '/uploads/users/' + image_name || undefined,  // Only update image if it's uploaded
      image: blob ? blob.url : user.image
    }; 

    // Update user by their ID
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },  // Use 'id' to find the user
      newDocument,
      { new: true }  // Return the updated document
    );

    /*if (!updatedUser) {
      return NextResponse.json({ message: "Failed to update user." }, { status: 500 });
    }*/

    return NextResponse.json({
      message: "User successfully updated.",
      result: updatedUser,
      blob: blob
    }, { status: 200 });

  } catch (err) {
    console.error("Error in update operation:", err);
    return NextResponse.json({ message: err || "Internal Server Error" }, { status: 500 });
  }
}
