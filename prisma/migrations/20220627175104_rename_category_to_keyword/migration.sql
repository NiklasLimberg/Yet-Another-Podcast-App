/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToSeries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToEpisode" DROP CONSTRAINT "_CategoryToEpisode_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToEpisode" DROP CONSTRAINT "_CategoryToEpisode_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToSeries" DROP CONSTRAINT "_CategoryToSeries_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToSeries" DROP CONSTRAINT "_CategoryToSeries_B_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "_CategoryToEpisode";

-- DropTable
DROP TABLE "_CategoryToSeries";

-- CreateTable
CREATE TABLE "Keyword" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EpisodeToKeyword" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_KeywordToSeries" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_name_key" ON "Keyword"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EpisodeToKeyword_AB_unique" ON "_EpisodeToKeyword"("A", "B");

-- CreateIndex
CREATE INDEX "_EpisodeToKeyword_B_index" ON "_EpisodeToKeyword"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KeywordToSeries_AB_unique" ON "_KeywordToSeries"("A", "B");

-- CreateIndex
CREATE INDEX "_KeywordToSeries_B_index" ON "_KeywordToSeries"("B");

-- AddForeignKey
ALTER TABLE "_EpisodeToKeyword" ADD CONSTRAINT "_EpisodeToKeyword_A_fkey" FOREIGN KEY ("A") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EpisodeToKeyword" ADD CONSTRAINT "_EpisodeToKeyword_B_fkey" FOREIGN KEY ("B") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToSeries" ADD CONSTRAINT "_KeywordToSeries_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToSeries" ADD CONSTRAINT "_KeywordToSeries_B_fkey" FOREIGN KEY ("B") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
