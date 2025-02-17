/*
  Warnings:

  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `description`,
    DROP COLUMN `name`;

-- CreateTable
CREATE TABLE `languages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(10) NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `languages_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `languageId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,

    UNIQUE INDEX `product_translations_productId_languageId_key`(`productId`, `languageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_translations` ADD CONSTRAINT `product_translations_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_translations` ADD CONSTRAINT `product_translations_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
