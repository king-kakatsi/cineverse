import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { postWithApi } from "../../../../services/axiosService";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, username, password, password_confirmation } = body;

    // Validation
    if (!email || !username || !password || !password_confirmation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email, username, password and password confirmation are required",
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
    //check if pasword are correctly confirmed
    if (password != password_confirmation) {
      return NextResponse.json(
        {
          success: false,
          message: "Password confirmation must match password",
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hashSync(password, 10);
    //generate personnal access token
    const access_token = randomBytes(32).toString("hex");
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: "USER",
        access_token,
      },
    });

    //send email
    const response = await postWithApi("sendEmail", {
      email,
      access_token,
      type: "validateAccount",
    });
    if (response[0]) {
      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully and email sent succesfully",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json({
        success: false,
        message: "Email not sent. Try again later",
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
