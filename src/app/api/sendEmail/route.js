import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ValidateAccount from "@/components/emails/ValidateAccount";
import ValidateEmail from "@/components/emails/ValidateEmail";
import ResetPassword from "@/components/emails/ResetPassword";

export async function POST(request) {
  try {
    const { email, access_token, type } = await request.json();

    if (!email || !access_token || !type) {
      return NextResponse.json(
        { success: false, message: "Missing parameters" },
        { status: 400 }
      );
    }

    let emailHTML;
    let subject;

    switch (type) {
      case "validateAccount":
        emailHTML = await render(<ValidateAccount token={access_token} />);
        subject = "Welcome to CinéVerse - Verify your account";
        break;
      case "validateEmail":
        emailHTML = await render(<ValidateEmail token={access_token} />);
        subject = "CinéVerse - Confirm your new mail address";
        break;
      case "resetPassword":
        emailHTML = await render(<ResetPassword token={access_token} />);
        subject = "CinéVerse - Reset your password";
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid email type" },
          { status: 400 }
        );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    let mailOptions = {
      from: `"CinéVerse" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Account confirmation",
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Good, email send",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error occured", error);
    return NextResponse.json(
      {
        error: error,
        success: false,
        message: "Error where sending mail",
      },
      {
        status: 500,
      }
    );
  }
}
