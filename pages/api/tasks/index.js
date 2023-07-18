import prisma from "../../../lib/prismaClient";
import { Status } from "@prisma/client";
export default async function handler(req, res) {
  // const { description } = req.body;

  console.log(req.method, "req.method");
  if (req.method === "POST") {
    const { description, status = "TODO" } = JSON.parse(req.body);
    const task = await prisma.task.create({
      data: {
        description,
        status: Status[status],
      },
    });
    if (!task) {
      return res.status(400).json({
        message: "Error",
      });
    }
    return res.status(201).json({ task });
  }

  // get all tasks
  if (req.method === "GET") {
    console.log("hello get");
    const tasks = await prisma.task.findMany({});
    if (!tasks) {
      return res.status(404).json({ message: "no task found" });
    }

    return res.status(200).json({ tasks });
  }

  if (req.method === "DELETE") {
    const { id } = req.params;
    const task = await prisma.task.delete({
      where: {
        id,
      },
    });
    if (!task) {
      return res.status(400).json({ message: "error" });
    }
    return res.status(200).json({ message: "success" });
  }
  res.status(200).json({ hello: "hello" });
}
