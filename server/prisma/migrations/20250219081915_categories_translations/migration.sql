/*
  Warnings:

  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `categories` DROP COLUMN `description`,
    DROP COLUMN `name`;

-- CreateTable
CREATE TABLE `CategoryTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `languageId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CategoryTranslation` ADD CONSTRAINT `CategoryTranslation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryTranslation` ADD CONSTRAINT `CategoryTranslation_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
