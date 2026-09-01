import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token not found." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { access_token: token },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token or user not found",
        },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/account/already-verified`
      );
    }

    await prisma.user.update({
      where: { access_token: token },
      data: {
        verified: true,
        verified_at: new Date(),
        updated_at: new Date(),
        access_token: "",
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/account/verified`
    );
  } catch (error) {
    console.error("Error while verified:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
