/*
  Warnings:

  - Made the column `updated_at` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "User"
SET "updated_at" = NOW()
WHERE "updated_at" IS NULL;

ALTER TABLE "User" ALTER COLUMN "updated_at" SET NOT NULL;
