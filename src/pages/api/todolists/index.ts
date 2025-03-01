import { prismaClient } from "@/app/database";
import { CreateTodolistSchema } from "@/validations/todolist-validation";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const username = req.headers["x-username"] as string;

    const todos = await prismaClient.todolist.findMany({
      where: {
        username: username,
      },
      select: {
        id: true,
        todo: true,
        status: true,
      },
    });

    if (todos.length > 0) {
      return res.status(200).json({ data: todos });
    }

    return res.status(404).json({ error: "Todolist not found" });
  } else if (req.method === "POST") {
    try {
      const username = req.headers["x-username"] as string;
      const todo = CreateTodolistSchema.parse(req.body);

      const todos = await prismaClient.todolist.create({
        data: {
          todo: todo.todo,
          status: todo.status,
          username: username,
        },
      });

      return res.status(200).json({ data: todos });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Error occured" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
