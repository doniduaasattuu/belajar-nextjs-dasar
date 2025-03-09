import { prismaClient } from "@/app/database";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { getSession } from "next-auth/react";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getSession({ req });
  if (!session || !session.user?.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const username: string = session.user.username;
  const previousName: string = session.user.name as string;

  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "public/avatars"),
      keepExtensions: true,
      multiples: false,
    });

    const [fields] = await form.parse(req);
    const name: string = fields.name?.[0] ?? previousName;

    const updatedProfile = await prismaClient.user.update({
      where: {
        username: username,
      },
      data: {
        name: name,
      },
    });

    return res
      .status(200)
      .json({ message: "Profile updated", data: updatedProfile });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Invalid request", error });
  }
}
