import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { access_token, password, password_confirmation } = body;

    //check if all are set
    if (!access_token || !password || !password_confirmation) {
      return NextResponse.json(
        {
          success: false,
          message: "Token, password and password confirmation are required",
        },
        { status: 400 }
      );
    }
    //check if token valid
    const user = await prisma.user.findUnique({
      where: { access_token },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Token invalid or expire",
        },
        { status: 404 }
      );
    }
    //hash password
    const hashedPassword = await bcrypt.hashSync(password, 10);
    //update user
    console.log(user);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        access_token: "",
        updated_at: new Date(),
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Password reset successful",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error occured",
      },
      {
        status: 500,
      }
    );
  }
}
