import { prismaClient } from "@/app/database";
import { LoginUserSchema } from "@/validations/user-validation";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { toUserResponse } from "@/models/user-model";

type ResponseData = {
  username: string;
  name: string;
  token: string;
};

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

    if (passwordMatch) {
      const response: ResponseData = {
        ...toUserResponse(user),
        token: "dummy-jwt-token",
      };

      return res.status(200).json({
        data: response,
      });
    }

    return res.status(400).json({ error: "Invalid credentials" });
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
