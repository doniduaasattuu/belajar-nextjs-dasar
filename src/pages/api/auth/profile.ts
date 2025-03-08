import { prismaClient } from "@/app/database";
import { UpdateUserSchema } from "@/validations/user-validation";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import { ZodError } from "zod";
import { toUserResponse } from "@/models/user-model";

type Credential = {
  username: string;
  name: string;
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
    const credentials: Credential = UpdateUserSchema.parse(req.body);

    const user = await prismaClient.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username != credentials.username) {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const nameTaken = await prismaClient.user.findFirst({
      where: {
        name: credentials.name,
      },
    });

    if (nameTaken) {
      return res.status(400).json({
        field: "name",
        message: "The name already been taken",
      });
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        username: username,
      },
      data: {
        name: credentials.name,
      },
    });

    return res.status(200).json({
      data: toUserResponse(updatedUser),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.errors[0],
      });
    }

    return res.status(500).json({
      field: null,
      message: "An unexpected error occurred",
    });
  }
}

// const userTaken = await prismaClient.user.findFirst({
//   where: {
//     username: credentials.username,
//   },
// });

// if (userTaken && credentials.username === userTaken.username) {
//   return res.status(400).json({
//     field: "username",
//     message: "Username already been taken",
//   });
// } else if (userTaken && credentials.name === userTaken.name) {
//   return res.status(400).json({
//     field: "name",
//     message: "Name already been taken",
//   });
// }
