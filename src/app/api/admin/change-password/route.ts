import { NextResponse } from "next/server"
import User from "@/models/UserModel"
import connectMongoDB from "@/libs/mongoosdb"
import mongoose from "mongoose"
import bcrypt from 'bcryptjs'

export async function POST(request: Request, { params }: { params: { id: string } }) {
   try {
      await connectMongoDB()

      const url = new URL(request.url)
      const id = url.searchParams.get("id")?.toString()
      const { current_password, new_password, password_confirmation } = await request.json()

      if (!current_password || !new_password || !password_confirmation) {
         return NextResponse.json({ message: "current_password, new_password, and password_confirmation are required." }, { status: 400 })
      }

      if (new_password.length < 8) {
         return NextResponse.json({ message: "New password must be at least 8 characters long." }, { status: 400 })
      }

      if (new_password !== password_confirmation) {
         return NextResponse.json({ message: "New password and confirmation do not match." }, { status: 400 })
      }

      const existingUser = await User.findById(id)
      if (!existingUser) {
         return NextResponse.json({ message: "User not found." }, { status: 404 })
      }

      const isPasswordCorrect = await bcrypt.compare(current_password, existingUser.password)
      if (!isPasswordCorrect) {
         return NextResponse.json({ message: "Current password is incorrect." }, { status: 403 })
      }

      const hashedNewPassword = await bcrypt.hash(new_password, 8)

      const updatedUser = await User.findOneAndUpdate(
         { _id: new mongoose.Types.ObjectId(id) },
         { $set: { password: hashedNewPassword } },
         { new: true }
      )

      return NextResponse.json({
         message: 'Admin password successfully updated',
         result: updatedUser
      }, { status: 200 })

   } catch (err) {
      return NextResponse.json({ message: err || "Internal Server Error" }, { status: 500 })
   }
}
