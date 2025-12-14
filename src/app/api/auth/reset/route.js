import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { postWithApi } from "../../../../services/axiosService";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body;
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    //check if user exist in db
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email not found",
        },
        { status: 404 }
      );
    }
    //gen access token
    const access_token = randomBytes(32).toString("hex");
    //update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        access_token,
      },
    });

    //send email
    const response = await postWithApi("sendEmail", {
      email,
      access_token,
      type: "resetPassword",
    });

    if (response[0]) {
      return NextResponse.json(
        {
          success: true,
          message: "Email send succesfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Email not sent. Try again later",
        },
        { status: 500 }
      );
    }
  } catch {
    console.log("Error occured");
    return NextResponse.json(
      {
        success: false,
        message: "Error occured",
      },
      { status: 500 }
    );
  }
}
