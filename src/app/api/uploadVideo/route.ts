import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import WinnerModel from '@/models/WinnerModel'

export async function POST(req: NextRequest) {
   const formData = await req.formData()
   const file = formData.get('file')
   const winnerId = formData.get('winner')

   if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ message: 'No file uploaded or invalid file type' }, { status: 400 })
   }
   
   if (!winnerId) {
      return NextResponse.json({ message: 'No winner specified' }, { status: 400 })
   }

   const arrayBuffer = await file.arrayBuffer()
   const uint8Array = new Uint8Array(arrayBuffer)

   try {

      const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH
      if (!credentialsPath) {
         return NextResponse.json({ message: 'Google credentials path is not defined' }, { status: 500 })
      }

      const winner = await WinnerModel.findById(winnerId)
      if (!winner) {
         return NextResponse.json({ message: 'Winner not found' }, { status: 404 })
      }

      const auth = new google.auth.GoogleAuth({
         keyFile: path.join(process.cwd(), credentialsPath),
         scopes: ['https://www.googleapis.com/auth/drive.file'],
      })

      const drive = google.drive({ version: 'v3', auth })
      const readable = new Readable()
      readable.push(uint8Array)
      readable.push(null)

      const response = await drive.files.create({
         media: {
            mimeType: 'video/webm',
            body: readable,
         },
         requestBody: {
            name: `${winnerId}.webm`,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID as string],
         },
      })

      const document = {
         animation_video: response.data.id
      }

      await WinnerModel.findOneAndUpdate(
         {_id: winnerId},
         { $set: document },
         {new: true}
      )

      return NextResponse.json({ message: 'Video uploaded successfully', fileId: response.data.id }, { status: 200 })
      // return NextResponse.json({ message: 'Video uploaded successfully', fileId: '' }, { status: 200 })
   } catch (err: any) {
      console.error('Error uploading to Google Drive:', err)
      return NextResponse.json({ message: 'Error uploading video', error: err.message }, { status: 500 })
   }
}
