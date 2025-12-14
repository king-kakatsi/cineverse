//import { requireAdminUser, requireAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    //check if user is logged
    // const user_infos = await requireAuthUser(request);
    //check if logged'user is admin
    //const checkAdmin = await requireAdminUser(request);
    //get user id
    const { id } = await params;
    //get user new rule
    const body = await request.json();
    const newRule = body;

    //get user
    const toChangeUser = await prisma.user.findUnique({
      where: { id },
    });
    //check if user exist
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
    //check if user is actif
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
    //check if user email is verified
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
    //now change user rule
    const rule = newRule == "admin" ? "ADMIN" : "USER";
    const changeUser = await prisma.user.update({
      where: { id },
      data: {
        role: rule,
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
