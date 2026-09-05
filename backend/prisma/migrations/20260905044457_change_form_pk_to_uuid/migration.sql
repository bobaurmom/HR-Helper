/*
  Warnings:

  - The primary key for the `forms` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `fields` DROP FOREIGN KEY `fields_form_id_fkey`;

-- DropForeignKey
ALTER TABLE `form_submissions` DROP FOREIGN KEY `form_submissions_form_id_fkey`;

-- DropIndex
DROP INDEX `fields_form_id_fkey` ON `fields`;

-- DropIndex
DROP INDEX `form_submissions_form_id_fkey` ON `form_submissions`;

-- AlterTable
ALTER TABLE `fields` MODIFY `form_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `form_submissions` MODIFY `form_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `forms` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `fields` ADD CONSTRAINT `fields_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
