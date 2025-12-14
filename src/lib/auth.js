import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Récupère l'utilisateur depuis le header Authorization: Bearer <token>
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
 * Vérifie qu'un utilisateur est connecté
 */
export async function requireAuthUser(req) {
  const user = await getUserFromToken(req);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Vérifie qu'un utilisateur est connecté ET qu'il est admin
 */
export async function requireAdminUser(req) {
  const user = await getUserFromToken(req);
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}
