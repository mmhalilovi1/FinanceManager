/*
  Warnings:

  - Changed the type of `type` on the `Expense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('EXPENSE', 'PLANNED');

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "type",
ADD COLUMN     "type" "ExpenseType" NOT NULL;

-- DropEnum
DROP TYPE "Type";
