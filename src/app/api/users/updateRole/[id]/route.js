import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const newRole = body;

    const toChangeUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!toChangeUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!toChangeUser.is_actif) {
      return NextResponse.json(
        {
          success: false,
          error: "User is blocked",
        },
        {
          status: 404,
        }
      );
    }

    if (!toChangeUser.verified) {
      return NextResponse.json(
        {
          success: false,
          error: "User email is not verified",
        },
        {
          status: 404,
        }
      );
    }

    const role = newRole === "admin" ? "ADMIN" : "USER";
    await prisma.user.update({
      where: { id },
      data: {
        role: role,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
