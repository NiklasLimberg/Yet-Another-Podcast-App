/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `RefreshToken_id_userId_key` ON `RefreshToken`(`id`, `userId`);
