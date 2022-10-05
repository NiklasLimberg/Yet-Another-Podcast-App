-- AlterTable
ALTER TABLE `RefreshToken` MODIFY `browserIsMobile` BOOLEAN NULL,
    MODIFY `browserName` VARCHAR(191) NULL,
    MODIFY `browserOS` VARCHAR(191) NULL,
    MODIFY `browserVersion` VARCHAR(191) NULL;
