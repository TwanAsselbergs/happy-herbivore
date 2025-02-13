-- AlterTable
ALTER TABLE `categories` ADD COLUMN `imageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `images`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
