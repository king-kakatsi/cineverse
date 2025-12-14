import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, password are required",
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
    // Check if user already exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 404 }
      );
    }
    if (!user.verified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is not verified",
        },
        { status: 403 }
      );
    }
    //verified if user is actif
    if (!user.is_actif) {
      return NextResponse.json(
        {
          success: false,
          message: "Account blocked",
        },
        { status: 401 }
      );
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      userWithoutPassword.access_token = token;

      const response = NextResponse.json(
        {
          success: true,
          message: "User login successfully",
          data: {
            user: userWithoutPassword,
            access_token: token,
          },
        },
        { status: 200 }
      );

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;

    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error occured",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
