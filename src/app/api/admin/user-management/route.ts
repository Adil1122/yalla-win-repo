import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// @ts-ignore
import getMAC, { isMAC } from 'getmac';
import User from "@/models/UserModel";
import connectMongoDB from "@/libs/mongoosdb";
import Invoice from "@/models/InvoiceModel";
import { put } from '@vercel/blob';
import { getStartEndDates } from "@/libs/common";

export async function POST(request: Request) {
    
    try {
      
        await connectMongoDB();
        const data = await request.formData();
        var email:any = data.get('email');
        await connectMongoDB();
        let user = await User.findOne({email});
        if(user) { 
          return NextResponse.json({messge: "User already exists ..."}, {status: 201});
        } else {
          var qr_code:any = Date.now() + Math.random();
          var name = data.get('name') + '';
          var name_split = name.split(' ');
          var first_name = '';
          var last_name = '';
          if(name_split.length > 0) {
            first_name = name_split[0];
            if(name_split.length > 1) {
                last_name = name_split[1];
            }
          }
          var password:any = data.get('password');
          var country = data.get ('country');
          var city = data.get('city');
          var area = data.get('area');
          var mobile = data.get('mobile');
          var residentialAddress = data.get('residentialAddress');
          var image:any = data.get('image');
          var platform:any = data.get('platform');
          var user_type:any = data.get('user_type');
          var image_name = '';
          var blob = null;
          if(image) {
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
            residentialAddress:residentialAddress,
            email: email,
            password: bcrypt_password,
            password_text: password,
            country:country,
            city:city,
            area:area,
            mobile: mobile,
            active: 1,
            locked: 0,
            mac: getMAC(),
            qr_code: qr_code,
            image: blob ? blob.url : '',
            platform: platform,
            role: 'user',
            user_type: user_type
          };
          
          let result = await User.create(newDocument);

          return NextResponse.json({
            messge: "User created successfully ....",
            result: result
          }, {status: 200});
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({messge: err}, {status: 500});
    }
}

export async function PUT(request: Request) {
    
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id: any = searchparams.get('id') + '';
        console.log(id)
        const data = await request.formData();
        await connectMongoDB();
        let user = await User.findOne({_id: id});
        if(!user) {
          return NextResponse.json({messge: "User not found ..."}, {status: 201});
        } else {
          var email: any = data.get('email') + '';
          var qr_code:any = Date.now() + Math.random();
          var name = data.get('name') + '';
          var name_split = name.split(' ');
          var first_name = '';
          var last_name = '';
          if(name_split.length > 0) {
            first_name = name_split[0];
            if(name_split.length > 1) {
                last_name = name_split[1];
            }
          }
          var password:any = data.get('password');
          var country = data.get ('country');
          var city = data.get('city');
          var area = data.get('area');
          var mobile = data.get('mobile');
          var residentialAddress = data.get('residentialAddress');
          var image:any = data.get('image');
          var image_name = user.image;
          //console.log(name+ '/' + city + '/' + area)
          var blob = null;
          if(image) {
            image_name = qr_code + '-' + image.name;
            blob = await put(image_name, image, {
              access: 'public',
            });

          }

          let bcrypt_password = await bcrypt.hash(password, 8);
          let updates = {
            $set: {
                name: name,
                first_name: first_name,
                last_name: last_name,
                residentialAddress:residentialAddress,
                email: email,
                password: bcrypt_password,
                country:country,
                city:city,
                area:area,
                mobile: mobile,
                active: 1,
                locked: 0,
                mac: getMAC(),
                qr_code: qr_code,
                image: blob ? blob.url : user.image
            }
          };

          const query = { _id: user._id };

          let result = await User.updateOne(query, updates);

          return NextResponse.json({
            messge: "User updated successfully ....",
            result: result
          }, {status: 200});
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({messge: err}, {status: 500});
    }
}

export async function PATCH(request: Request) {
  try {

      await connectMongoDB();
      var url = new URL(request.url);
      var searchparams = new URLSearchParams(url.searchParams);
      var id = searchparams.get('id') + '';
      var result = await User.findOne({_id: id});
      return NextResponse.json({
          messge: "Query successful ....",
          result: result
        }, {status: 200});

  } catch (error) {

      return NextResponse.json({
          messge: "Query error ....",
        }, {status: 500});

  }
}

export async function GET(request: Request) {
  try {
      await connectMongoDB();
      var url = new URL(request.url);
      var searchparams = new URLSearchParams(url.searchParams);
      var user_type = searchparams.get('user_type') + '';
      var skip = parseInt(searchparams.get('skip') + '');
      var limit = parseInt(searchparams.get('limit') + '');
      var schedule = searchparams.get('schedule') + '';
      var search_by = searchparams.get('search_by') + '';
      var search = searchparams.get('search') + '';
      //schedule = 'monthly'; // for time being

      console.log('user_type: ', user_type)

      var dates = getStartEndDates(schedule)
      var start_date = dates.start_date
      var end_date = dates.end_date

      var search_json = search_by === 'countries' ? 
      {country: { $regex: '.*' + search + '.*', $options: 'i' }} 
      :
      {city: { $regex: '.*' + search + '.*', $options: 'i' }}

      var users = await User.find(
        { 
            $and:[ 
                {
                    createdAt: {
                        $gte : new Date(start_date), 
                        $lt: new Date(end_date)
                    }
                }, 
                {user_type: user_type},
                search_json
            ]
        }
      ).sort({'createdAt': -1}).skip(skip).limit(limit)
      .select(['_id', 'name', 'email', 'city', 'country', 'mobile', 'password_text']);


      var invoices: any = [];
      if(users && users.length) {
        for(var i = 0; i < users.length; i++) {
          var last_invoice = await Invoice.find({user_id: users[i]._id}).sort({'createdAt': -1}).limit(1).select(['id', 'user_id', 'createdAt']);
          invoices.push(last_invoice)
        }

        return NextResponse.json({
          messge: "Query successful ....",
          users: users,
          invoices: invoices
        }, {status: 200});

      } else {
        console.log('users not found issue ...')
        return NextResponse.json({
          messge: "Query successful ....",
          users: users
        }, {status: 200});

      }

  } catch (error) {

      return NextResponse.json({
          messge: "Query error ....",
          error: JSON.stringify(error)
        }, {status: 500});

  }
}

export async function OPTIONS(request: Request) {
  try {
      await connectMongoDB();

      var url = new URL(request.url);
      var searchparams = new URLSearchParams(url.searchParams);
      
      var schedule = searchparams.get('schedule') + '';
      var search_by = searchparams.get('search_by') + '';
      var search = searchparams.get('search') + '';

      var search_json = search_by === 'countries' ? 
      {country: { $regex: '.*' + search + '.*', $options: 'i' }} 
      :
      {city: { $regex: '.*' + search + '.*', $options: 'i' }}

      var start_date = new Date().toISOString().slice(0, 10)
      var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      var end_date = tomorrowDate.toISOString().slice(0, 10);

      if(schedule === 'weekly') {
          start_date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      }

      if(schedule === 'monthly') {
          start_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      }

      var app_users_count = await User.find({
          //user_type: 'app',
          $and: [ 
              {
                  createdAt: {
                      $gte : new Date(start_date), 
                      $lt: new Date(end_date)
                  }
              }, 
              {user_type: 'app'},
              search_json
          ]
      }).countDocuments();

      var web_users_count = await User.find({
          //user_type: 'web',
          $and: [ 
              {
                  createdAt: {
                      $gte : new Date(start_date), 
                      $lt: new Date(end_date)
                  }
              }, 
              {user_type: 'web'},
              search_json
          ]
      }).countDocuments();

      return NextResponse.json({
          messge: "query successful ....",
          app_users_count: app_users_count,
          web_users_count: web_users_count
      }, {status: 200});

  } catch (error) {
      return NextResponse.json({
          messge: "query error ....",
          error: JSON.stringify(error)
      }, {status: 200});
  }
  
}