/*
  Warnings:

  - You are about to drop the column `datetime` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `datetime`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `products` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
