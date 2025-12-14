import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              username: user.name || user.email.split("@")[0],
              email: user.email,
              image: user.image,
              provider: account.provider.toUpperCase(),
              verified: true,
              verified_at: new Date(),
              updated_at: new Date(),
              role: "USER",
            },
          });
        } else {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              provider: account.provider.toUpperCase(),
              image: user.image,
              updated_at: new Date(),
            },
          });
        }

        const token = jwt.sign(
          {
            userId: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        user.access_token = token;
        user.id = dbUser.id;
        user.role = dbUser.role;

        return true;
      } catch (err) {
        console.error("Erreur OAuth signIn:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.user = {
          id: user.id,
          username: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          created_at: user.created_at,
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.access_token = token.access_token;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
