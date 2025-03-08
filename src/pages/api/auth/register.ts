// import { prismaClient } from "@/app/database";
import { prismaClient } from "@/app/database";
import { RegisterUserSchema } from "@/validations/user-validation";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import { toUserResponse } from "@/models/user-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const credentials = RegisterUserSchema.parse(req.body);
    const { username, name, password } = credentials;
    const userWithSameUsername = await prismaClient.user.count({
      where: {
        username: username,
      },
    });

    if (userWithSameUsername != 0) {
      return res.status(400).json({
        error: "Username already been taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        username: username,
        name: name,
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      data: toUserResponse(user),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.errors[0],
      });
    } else if (error instanceof Error) {
      return res.status(500).json({
        error: "Error occured",
      });
    }
  }
}
