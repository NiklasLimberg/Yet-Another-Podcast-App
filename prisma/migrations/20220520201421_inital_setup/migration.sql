-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publicBroadcasting" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionToSeries" (
    "userId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionToSeries_pkey" PRIMARY KEY ("userId","seriesId")
);

-- CreateTable
CREATE TABLE "ProgressOnPlayback" (
    "userId" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressOnPlayback_pkey" PRIMARY KEY ("userId","episodeId")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "pubDate" TIMESTAMP(3) NOT NULL,
    "lastBuildDate" TIMESTAMP(3) NOT NULL,
    "ttl" INTEGER NOT NULL DEFAULT 5,
    "lastScraped" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionHTML" TEXT NOT NULL,
    "pubDate" TIMESTAMP(3) NOT NULL,
    "enclosure" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scrape" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" TIMESTAMP(3),
    "userId" TEXT,
    "manual" BOOLEAN NOT NULL DEFAULT false,
    "updatedSeries" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Scrape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EpisodeToScrape" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToSeries" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToEpisode" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EpisodeToScrape_AB_unique" ON "_EpisodeToScrape"("A", "B");

-- CreateIndex
CREATE INDEX "_EpisodeToScrape_B_index" ON "_EpisodeToScrape"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToSeries_AB_unique" ON "_CategoryToSeries"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToSeries_B_index" ON "_CategoryToSeries"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToEpisode_AB_unique" ON "_CategoryToEpisode"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToEpisode_B_index" ON "_CategoryToEpisode"("B");

-- AddForeignKey
ALTER TABLE "SubscriptionToSeries" ADD CONSTRAINT "SubscriptionToSeries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionToSeries" ADD CONSTRAINT "SubscriptionToSeries_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressOnPlayback" ADD CONSTRAINT "ProgressOnPlayback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressOnPlayback" ADD CONSTRAINT "ProgressOnPlayback_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scrape" ADD CONSTRAINT "Scrape_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scrape" ADD CONSTRAINT "Scrape_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EpisodeToScrape" ADD CONSTRAINT "_EpisodeToScrape_A_fkey" FOREIGN KEY ("A") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EpisodeToScrape" ADD CONSTRAINT "_EpisodeToScrape_B_fkey" FOREIGN KEY ("B") REFERENCES "Scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToSeries" ADD CONSTRAINT "_CategoryToSeries_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToSeries" ADD CONSTRAINT "_CategoryToSeries_B_fkey" FOREIGN KEY ("B") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToEpisode" ADD CONSTRAINT "_CategoryToEpisode_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToEpisode" ADD CONSTRAINT "_CategoryToEpisode_B_fkey" FOREIGN KEY ("B") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
