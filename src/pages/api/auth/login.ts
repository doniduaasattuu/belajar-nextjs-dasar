import { prismaClient } from "@/app/database";
import { LoginUserSchema } from "@/validations/user-validation";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { toUserResponse } from "@/models/user-model";
import { SignJWT } from "jose";
import { serialize } from "cookie";

type ResponseData = {
  username: string;
  name: string;
};

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "RG9uaSBEYXJtYXdhbg=="
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const loginRequest = LoginUserSchema.parse(req.body);
    const user = await prismaClient.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = await new SignJWT({
      username: user.username,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(SECRET_KEY);

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 3600, // 1 hour
      })
    );

    const response: ResponseData = toUserResponse(user);

    return res.status(200).json({ data: response });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.errors[0],
      });
    }

    return res.status(500).json({
      message: "Error occured",
    });
  }
}
