/*
  Warnings:

  - Added the required column `progress` to the `PlaybackProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PlaybackProgress` ADD COLUMN `progress` INTEGER NOT NULL;
