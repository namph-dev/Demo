// pages/api/updateNote.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id, title, content } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Note ID is required" });
    }

    try {
      const updatedNote = await prisma.note.update({
        where: { id: Number(id) },
        data: {
          title,
          content,
        },
      });
      return res.status(200).json(updatedNote);
    } catch (error) {
      console.error("Failure", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
