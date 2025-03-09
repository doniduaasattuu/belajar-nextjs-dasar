import { prismaClient } from "@/app/database";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prismaClient.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.username = user.username;
        token.name = user.name;
        token.image = user.image;
      }

      if (trigger === "update") {
        token.name = session.user.name;
        token.image = session.user.image;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.username = token.username;
      session.user.name = token.name;
      session.user.image = token.image;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Export NextAuth handler with authOptions
export default NextAuth(authOptions);
