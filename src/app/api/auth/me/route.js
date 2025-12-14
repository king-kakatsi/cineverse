// /app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

/**
 * GET /api/auth/me
 * Récupère l'utilisateur connecté à partir du token JWT
 */
export async function GET(req) {
    try {
        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { password, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            data: userWithoutPassword
        }, { status: 200 });

    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}