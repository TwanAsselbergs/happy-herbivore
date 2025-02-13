/*
  Warnings:

  - You are about to drop the column `order_status_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `order_status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderStatus` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_order_status_id_fkey`;

-- DropIndex
DROP INDEX `orders_order_status_id_idx` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `order_status_id`,
    ADD COLUMN `orderStatus` ENUM('STARTED', 'PLACED_AND_PAID', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP') NOT NULL;

-- DropTable
DROP TABLE `order_status`;
