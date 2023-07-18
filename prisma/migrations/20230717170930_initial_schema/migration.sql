-- CreateEnum
CREATE TYPE "Status" AS ENUM ('BACKLOG', 'TODO', 'ONGOING', 'DONE');

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'TODO',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
