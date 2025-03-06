import { prismaClient } from "@/app/database";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { id } = req.query;
  const username = session.user.username;

  if (req.method === "PATCH") {
    const { todo, status, deleting, undoing } = req.body;

    try {
      if (todo) {
        const isExist = await prismaClient.todolist.count({
          where: {
            username: username,
            id: parseInt(id as string),
          },
        });

        console.log(id);

        if (isExist >= 1) {
          await prismaClient.todolist.update({
            where: {
              username: username,
              id: parseInt(id as string),
            },
            data: {
              todo: todo,
              updated_at: new Date(),
            },
          });

          return res.status(200).json({ message: "Successfully updated" });
        }

        return res.status(404).json({ error: "Todolist not found" });
      } else if (deleting) {
        await prismaClient.todolist.update({
          where: {
            username: username,
            id: parseInt(id as string),
          },
          data: {
            deleted_at: new Date(),
          },
        });

        return res.status(200).json({ success: true });
      } else if (undoing) {
        await prismaClient.todolist.update({
          where: {
            username: username,
            id: parseInt(id as string),
          },
          data: {
            deleted_at: null,
          },
        });

        return res.status(200).json({ success: true });
      } else {
        await prismaClient.todolist.update({
          where: {
            id: Number(id),
            username: username,
          },
          data: {
            status: status,
          },
        });

        return res.status(200).json({ success: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
