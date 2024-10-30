import { NextResponse } from "next/server";
//import db from "../../../libs/mongodb";
import bcrypt from "bcryptjs";
//import getDistance from "@/libs/get_distance";
import User from "@/models/UserModel";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
//import getMAC, { isMAC } from 'getmac';

export async function POST(request: any) {

    try { 

        await connectMongoDB();
        //let {email, password, initial_coords} = await request.json();
        let {email, password, platform, mac, initial_coords} = await request.json();
        let user = await User.findOne({email});
        if(user) {

          /*var current_mac = getMAC();
          if(current_mac !== user.mac) {
            return NextResponse.json({
              messge: "Invalid User Device ....",
            }, {status: 400});
          }*/


          const isMatch = await bcrypt.compare(password, user.password);
          if(isMatch) {
            //request.session.user = user._id;
            //console.log(request.session.user);

            if(user.active === 0) {
              return NextResponse.json({
                message: "user account is inactive",
              }, {status: 201});
            }

            if(user.locked === 1) {
              return NextResponse.json({
                message: "user account is locked",
              }, {status: 201});
            }

            if(user.role === 'merchant') {

              if(platform !== 'mobile') {
                return NextResponse.json({
                  message: "You must login via Merchant App.",
                }, {status: 201});
              }

              if(user.mac !== '') {
                
                if(user.mac !== mac) {
                  return NextResponse.json({
                    message: "Merchant can only login via registered device.",
                    details: 'Role: ' + user.role + ', Given Platform: ' + platform + ', User Mac: ' + user.mac + ', Given Mac: ' + mac
                  }, {status: 201});
                }
              }

            }

            if(user.role === 'merchant' && platform === 'mobile' && user.mac === '') {
              const query = { _id: user._id };
              const updates = {
                $set: {
                  mac: mac,
                },
              };
              await User.updateOne(query, updates);
            }

            const query = { _id: user._id };
            const updates = {
              $set: {
                initial_coords: initial_coords,
              },
            };
            await User.updateOne(query, updates);

            /*var user_initial_coords = user.initial_coords;
            var distance = getDistance(user_initial_coords.lat, user_initial_coords.long, initial_coords.lat, initial_coords.long, 'K');
            console.log(distance)

            if(distance === 3000) {
              const query = { _id: user._id };
              const updates = {
                $set: {
                  locked: 1,
                },
              };

              let result = await collection.updateOne(query, updates);
              console.log(result)
              console.log(user._id)

              if(result.modifiedCount === 1) {
                return NextResponse.json({
                  messge: "user account is locked ....",
                }, {status: 500});
              } else {
                return NextResponse.json({
                  messge: "problem in locking account ....",
                }, {status: 500});
              }

            }*/

            const userWithoutPassword = Object.keys(user._doc).reduce((acc: any, key: any) => {
               if (key !== 'password') {
                     acc[key] = user[key];
               }
               return acc;
            }, {})

            return NextResponse.json({
              message: "User successfully logged in",
                user: userWithoutPassword
            }, {status: 200});
            //request.send(user).status(204);
          } else {
            return NextResponse.json({
                message: "Credentials Mismatched",
            }, {status: 201});
          }
        } else {
            return NextResponse.json({
              message: "User not found",
            }, {status: 201});
        }
      } catch (error) {
        return NextResponse.json({
          message: {error: error},
        }, {status: 500});
      }

}