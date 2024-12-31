import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import WinnerModel from '@/models/WinnerModel'

export async function POST(req: NextRequest) {
   // const formData = await req.formData();
   // const file = formData.get('file');
   // const winnerId = formData.get('winner');
 
   // if (!file || !(file instanceof Blob)) {
   //   return NextResponse.json({ message: 'No file uploaded or invalid file type' }, { status: 400 });
   // }
 
   // if (!winnerId) {
   //   return NextResponse.json({ message: 'No winner specified' }, { status: 400 });
   // }
 
   // // Get the file stream directly
   // const fileStream = file.stream(); // Get the file stream from the Blob object
 
   // // Wrap the file stream in a Node.js Readable stream
   // const readable = new Readable({
   //   read() {
   //     const reader = fileStream.getReader();
   //     const pushData = async () => {
   //       try {
   //         const { done, value } = await reader.read();
   //         if (done) {
   //           this.push(null); // End the stream
   //           return;
   //         }
   //         this.push(value); // Push chunk to the stream
   //         pushData();
   //       } catch (err) {
   //         this.emit('error', err);
   //       }
   //     };
   //     pushData();
   //   },
   // });
 
   // const base64String = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON as string;
 
   try {
   //   if (!base64String) {
   //     throw new Error('Environment variable GOOGLE_APPLICATION_CREDENTIALS_JSON is not set.');
   //   }
 
   //   const winner = await WinnerModel.findById(winnerId);
   //   if (!winner) {
   //     return NextResponse.json({ message: 'Winner not found' }, { status: 404 });
   //   }
 
   //   const decoded = Buffer.from(base64String, 'base64').toString('utf8');
   //   const credentials = JSON.parse(decoded);
 
   //   const auth = new google.auth.GoogleAuth({
   //     credentials,
   //     scopes: ['https://www.googleapis.com/auth/drive.file'],
   //   });
 
   //   const drive = google.drive({ version: 'v3', auth });
 
   //   // Use the readable stream for the media body
   //   const response = await drive.files.create({
   //     media: {
   //       mimeType: 'video/webm',
   //       body: readable, // Directly use the stream here
   //     },
   //     requestBody: {
   //       name: `${winnerId}.webm`,
   //       parents: [process.env.GOOGLE_DRIVE_FOLDER_ID as string],
   //     },
   //     fields: 'id',
   //   });
 
   //   const document = {
   //     animation_video: response.data.id,
   //   };
 
   //   await WinnerModel.findOneAndUpdate(
   //     { _id: winnerId },
   //     { $set: document },
   //     { new: true }
   //   );
 
   //   return NextResponse.json({ message: 'Video uploaded successfully', fileId: response.data.id }, { status: 200 });
      return NextResponse.json({ message: 'Video uploaded successfully', fileId: '123' }, { status: 200 });
   } catch (err: any) {
     console.error('Error uploading to Google Drive:', err);
     return NextResponse.json({ message: 'Error uploading video', error: err.message }, { status: 500 });
   }
 }
