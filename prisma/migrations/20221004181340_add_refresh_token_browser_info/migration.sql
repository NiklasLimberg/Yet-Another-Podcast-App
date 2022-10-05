/*
  Warnings:

  - You are about to drop the column `identificationString` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `browserIsMobile` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `browserName` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `browserOS` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `browserVersion` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RefreshToken` DROP COLUMN `identificationString`,
    ADD COLUMN `browserIsMobile` BOOLEAN NOT NULL,
    ADD COLUMN `browserName` VARCHAR(191) NOT NULL,
    ADD COLUMN `browserOS` VARCHAR(191) NOT NULL,
    ADD COLUMN `browserVersion` VARCHAR(191) NOT NULL;
