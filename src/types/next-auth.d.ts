import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      password: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
    password: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    password: string;
  }
}
