import { NextResponse } from "next/server"
import User from "@/models/UserModel"
import connectMongoDB from "@/libs/mongoosdb"
import mongoose from "mongoose"

export async function POST(request: Request, { params }: { params: { id: string } }) {
   try {
      await connectMongoDB()

      const url = new URL(request.url)
      const id = url.searchParams.get("id")?.toString()
      const {first_name, last_name} = await request.json()
      const name = `${first_name} ${last_name}`

      if (!first_name || !last_name) {
         return NextResponse.json({ message: "first_name and last_name are required." }, { status: 400 })
      }

      const existingUser = await User.findById(id)
      if (!existingUser) {
         return NextResponse.json({ message: "User not found." }, { status: 404 })
      }

      const newDocument = {
         first_name,
         last_name,
         name
      }

      const updatedUser = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, newDocument, { new: true })

      return NextResponse.json({
         message: 'Admin successfully updated',
         result: updatedUser
      }, { status: 200 })

   } catch (err) {
      console.error("Error in update operation:", err);
      return NextResponse.json({ message: err || "Internal Server Error" }, { status: 500 })
   }
}
