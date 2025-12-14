import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    //verify if id is set
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "User is required",
        },
        { status: 400 }
      );
    }

    //check if user exist
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User is not found",
        },
        { status: 404 }
      );
    }

    //delete user
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User is deleted",
      },
      { status: 204 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, username, role, is_actif } = body;
    if (!email || !username || !role || !is_actif || !id) {
      return NextResponse.json(
        {
          success: false,
          message: "Fields are required",
        },
        { status: 400 }
      );
    }
    //check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    //check if user exist
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    //verify if email has change

    if (email != user.email) {
      //verify if email is not set in db
      const checkExistenceofEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (checkExistenceofEmail) {
        return NextResponse.json(
          { success: false, message: "Email alrerady exist in db" },
          { status: 409 }
        );
      }
    }

    //change information
    const newRule = role == "admin" ? "ADMIN" : "USER";
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: email,
        username: username,
        role: newRule,
        is_actif: is_actif,
        updated_at: new Date(),
      },
    });
    return NextResponse.json(
      { success: false, message: "User updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User is required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });
    const userReviews = await prisma.comment.findMany({
      where: { user_id: id },
      include: {
        movie: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        user: user,
        userReviews: userReviews,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
