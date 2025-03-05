import { prismaClient } from "@/app/database";
import { CreateTodolistSchema } from "@/validations/todolist-validation";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const username = session.user.username;
  const search = req.query.todo as string;

  if (req.method === "GET") {
    const todos = await prismaClient.todolist.findMany({
      where: {
        username: username,
        deleted_at: null,
        todo: search
          ? {
              contains: search as string,
            }
          : undefined,
      },
      select: {
        id: true,
        todo: true,
        status: true,
        created_at: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (todos.length > 0) {
      return res.status(200).json({ data: todos });
    }

    return res.status(404).json({ error: "Todolist not found" });
  } else if (req.method === "POST") {
    try {
      if (!username) {
        return res.status(400).json({ error: "Request Invalid" });
      }

      const parsed = CreateTodolistSchema.parse(req.body);

      const isExist = await prismaClient.todolist.findFirst({
        where: {
          username: username,
          todo: parsed.todo,
        },
      });

      if (isExist) {
        await prismaClient.todolist.update({
          where: {
            username: username,
            id: isExist.id,
          },
          data: {
            todo: parsed.todo,
            status: parsed.status,
            deleted_at: null,
          },
        });

        return res.status(200).json({ data: isExist, restored: true });
      } else {
        const todos = await prismaClient.todolist.create({
          data: {
            todo: parsed.todo,
            status: parsed.status,
            username: username,
          },
        });

        return res.status(200).json({ data: todos });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(400).json({ error: "Error occured" });
      }
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
