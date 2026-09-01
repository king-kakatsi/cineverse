import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

/**
 * Get user from Authorization header: Bearer <token>
 */
export async function getUserFromToken(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    return user;
  } catch (err) {
    console.error("Invalid Token :", err.message);
    return null;
  }
}

/**
 * Check if a user is authenticated
 */
export async function requireAuthUser(req) {
  const user = await getUserFromToken(req);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Check if a user is authenticated and has ADMIN role
 */
export async function requireAdminUser(req) {
  const user = await getUserFromToken(req);
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}
