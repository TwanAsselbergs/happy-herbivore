-- DropForeignKey
ALTER TABLE `CategoryTranslation` DROP FOREIGN KEY `CategoryTranslation_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryTranslation` DROP FOREIGN KEY `CategoryTranslation_languageId_fkey`;

-- DropIndex
DROP INDEX `CategoryTranslation_categoryId_fkey` ON `CategoryTranslation`;

-- DropIndex
DROP INDEX `CategoryTranslation_languageId_fkey` ON `CategoryTranslation`;

-- AddForeignKey
ALTER TABLE `CategoryTranslation` ADD CONSTRAINT `CategoryTranslation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryTranslation` ADD CONSTRAINT `CategoryTranslation_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
