/*
  Warnings:

  - You are about to drop the column `status` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `files` DROP COLUMN `status`,
    DROP COLUMN `url`,
    ADD COLUMN `key` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `files_key_key` ON `files`(`key`);
