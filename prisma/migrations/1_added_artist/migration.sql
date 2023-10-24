-- CreateTable
CREATE TABLE `song` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `links` JSON NOT NULL,
    `level` CHAR(1) NOT NULL DEFAULT '0',
    `id_user` INTEGER NOT NULL,
    `id_artist` INTEGER NULL,

    INDEX `song_FK`(`id_user`),
    INDEX `song_FK_1`(`id_artist`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `role` CHAR(1) NOT NULL DEFAULT 'c',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `song` ADD CONSTRAINT `song_FK` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `song` ADD CONSTRAINT `song_FK_1` FOREIGN KEY (`id_artist`) REFERENCES `artist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

