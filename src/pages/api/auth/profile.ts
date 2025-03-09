import { prismaClient } from "@/app/database";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
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
  const user = await prismaClient.user.findFirst({
    where: { username },
    select: {
      username: true,
      name: true,
      image: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const uploadDir = path.join(process.cwd(), "public/images");

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      multiples: false,
      filename: (name, ext) => {
        return `${username}${ext}`; // Custom file name
      },
    });

    // Parse form using Promise
    const parseForm = () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new Promise<{ fields: any; files: any }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

    const { fields, files } = await parseForm();
    const name: string = fields.name?.[0] ?? user.name;

    // Update profile in database
    const updatedProfile = await prismaClient.user.update({
      where: { username },
      data: {
        name,
        ...(files.image
          ? {
              image: `/images/${username}${path.extname(
                files.image?.[0]?.filepath || ""
              )}`,
            }
          : {}), // Store the new image path
      },
      select: {
        username: true,
        name: true,
        image: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(400).json({ message: "Invalid request", error });
  }
}
