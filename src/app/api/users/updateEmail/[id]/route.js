import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { requireAuthUser } from "@/lib/auth";

const prisma = new PrismaClient();
export async function PUT(request, { params }) {
  try {
    const user_infos = await requireAuthUser(request);
    const id = await params.id;
    const body = await request.json();
    const { username, email } = body;
    //check informations
    if (!id || !username || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalids parameters",
        },
        { status: 400 }
      );
    }
    //get user infos from DB
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
    //verifier si le mail a changé
    if (email != user.email) {
      //verifier le format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        //verifier si l'email  n'existe pas en db
        const checkEmail = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (checkEmail) {
          return NextResponse.json(
            {
              success: false,
              message: "Email always exist",
            },
            { status: 409 }
          );
        }
        //generer un access token
        const access_token = randomBytes(32).toString("hex");
        //mettre le mail en standby
        const new_user = await prisma.user.update({
          where: { id: id },
          data: {
            username: username,
            stand_by_email: email,
            access_token: access_token,
            updated_at: new Date(),
          },
        });
        //envoyer le mail
        const response = await postWithApi("sendEmail", {
          email,
          access_token,
          type: "validateEmail",
        });
        if (response[0]) {
          return NextResponse.json(
            {
              success: true,
              message: "Email sent ",
              user: new_user,
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json({
            success: false,
            message: "Email not sent. Try again later",
          });
        }
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Email misformed",
          },
          { status: 400 }
        );
      }
    }
    //verifier si le username a changé
    if (username != user.username) {
      //mettre à jour username
      const new_user = await prisma.user.update({
        where: { id: id },
        data: { username: username, updated_at: new Date() },
      });
      return NextResponse.json(
        {
          success: true,
          message: "Username updated",
          user: new_user,
        },
        { status: 200 }
      );
    }
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
