import { prismaClient } from "@/app/database";
import { UpdatePasswordSchema } from "@/validations/user-validation";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import bcrypt from "bcrypt";
import { ZodError } from "zod";

type Credential = {
  password: string;
  new_password: string;
  confirm: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const username = session.user.username;

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const credentials: Credential = UpdatePasswordSchema.parse(req.body);

    const user = await prismaClient.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        field: "password",
        message: "Current password is incorrect",
      });
    }

    await prismaClient.user.update({
      where: {
        username: username,
      },
      data: {
        password: await bcrypt.hash(credentials.new_password, 10),
      },
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.errors[0],
      });
    }

    return res.status(500).json({
      field: null, // No specific field
      message: "An unexpected error occurred",
    });
  }
}
