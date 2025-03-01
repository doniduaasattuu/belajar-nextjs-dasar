import { prismaClient } from "@/app/database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    // const username = req.headers["x-username"] as string;

    const { id, status } = req.body;

    try {
      await prismaClient.todolist.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await prismaClient.todolist.delete({
        where: {
          id: parseInt(id as string),
        },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
