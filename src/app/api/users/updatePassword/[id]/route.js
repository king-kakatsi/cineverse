import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { oldPassword, newPassword, password_confirmation } = body;
    console.log(oldPassword);
    console.log(newPassword);
    console.log(password_confirmation);
    //check informations
    if (!id || !newPassword || !password_confirmation) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalids parameters",
        },
        { status: 400 }
      );
    }

    //check comparision between new pass
    if (newPassword != password_confirmation) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalids parameters",
        },
        { status: 400 }
      );
    }

    //get user
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    if (user.provider == "LOCAL") {
      if (!oldPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "old Password is required",
          },
          { status: 400 }
        );
      }
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return NextResponse.json(
          {
            success: false,
            message: "old Password don't match",
          },
          { status: 404 }
        );
      }
    }

    //hash new password
    const hashPassword = bcrypt.hashSync(newPassword, 10);
    //update password
    await prisma.user.update({
      where: { id: id },
      data: {
        password: hashPassword,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
