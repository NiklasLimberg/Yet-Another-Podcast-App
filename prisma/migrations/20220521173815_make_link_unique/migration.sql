/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `Series` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Series_link_key" ON "Series"("link");
