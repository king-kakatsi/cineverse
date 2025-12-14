import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days")) || 90;

  const dateAgo = new Date();
  dateAgo.setDate(dateAgo.getDate() - days);

  try {
    const rawUsers = await prisma.user.findMany({
      where: {
        created_at: {
          gte: dateAgo,
        },
      },
      select: {
        created_at: true,
      },
      orderBy: { created_at: "asc" },
    });

    const growthData = rawUsers.reduce((acc, user) => {
      const dateKey = user.created_at.toISOString().split("T")[0];
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.keys(growthData).map((date) => ({
      date: date,
      count: growthData[date],
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user registration trend:", error);
    return NextResponse.json(
      { error: "Failed to fetch user registration trend" },
      { status: 500 }
    );
  }
}
