-- CreateTable
CREATE TABLE `forms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `requirements` TEXT NULL,
    `is_open` BOOLEAN NOT NULL DEFAULT false,
    `open_at` DATETIME(3) NULL,
    `close_at` DATETIME(3) NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fields` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `form_id` INTEGER NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'NUMBER', 'DATE', 'CHECKBOX', 'RADIO', 'SELECT') NOT NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `field_id` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `form_submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `form_id` INTEGER NOT NULL,
    `cv_file_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `form_submissions_cv_file_id_key`(`cv_file_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submission_answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submission_id` INTEGER NOT NULL,
    `field_id` INTEGER NOT NULL,
    `value` VARCHAR(191) NULL,
    `option_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `forms` ADD CONSTRAINT `forms_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fields` ADD CONSTRAINT `fields_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `options` ADD CONSTRAINT `options_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `fields`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_cv_file_id_fkey` FOREIGN KEY (`cv_file_id`) REFERENCES `files`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submission_answers` ADD CONSTRAINT `submission_answers_submission_id_fkey` FOREIGN KEY (`submission_id`) REFERENCES `form_submissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submission_answers` ADD CONSTRAINT `submission_answers_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `fields`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submission_answers` ADD CONSTRAINT `submission_answers_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `options`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
