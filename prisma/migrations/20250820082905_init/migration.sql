-- CreateTable
CREATE TABLE `Entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectName` VARCHAR(191) NOT NULL,
    `taskName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `filesChanged` VARCHAR(191) NOT NULL,
    `codeBefore` VARCHAR(191) NOT NULL,
    `codeAfter` VARCHAR(191) NOT NULL,
    `deployedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
