/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "@/models/user-model";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
  token?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const user: User = req.body;
  const { username, password } = user;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (username === "doni" && password === "rahasia") {
    return res
      .status(200)
      .json({ message: "Login successful", token: "dummy-jwt-token" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}
