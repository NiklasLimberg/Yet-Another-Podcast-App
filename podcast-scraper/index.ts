import { PrismaClient } from '@prisma/client';

import Parser from 'rss-parser';

const db = new PrismaClient();

export default async function scrapeByURL(podcastURL: string) {
    const parser: Parser<{
        title: string,
        description: string,
        category: string[];
        ttl: string;
        pubDate: string;
        lastBuildDate: string;
        image: { url: string };
        language: string;
        itunes: {
            'new-feed-ur': string,
            keywords: string[]
        }
    }, {
        guid: string,
        title: string,
        description: string,
        descriptionHTML: string,
        pubDate: string,
        'content:encoded': string,
        enclosure: string,
        'itunes:image': string,
        link: string,
        'itunes:duration': string,
    }
    > = new Parser();

    const series = await parser.parseURL(podcastURL);

    const transformedSeries = {
        title: series.title,
        description: series.description,
        language: series.language,
        image: series.image.url,
        link: series.itunes['new-feed-ur'] ?? series.link,
        explicit: series.itunes.explicit === 'true',
        pubDate: new Date(series.pubDate),
        lastBuildDate: new Date(series.lastBuildDate),
        ttl: parseInt(series.ttl, 10),
        categories: {
            connectOrCreate: series.itunes.keywords.map((keyword) => {
                const normalizedKeyword = keyword.replace('WDR 5', 'WDR5').trim();
                return {
                    where: { name: normalizedKeyword },
                    create: { name: normalizedKeyword },
                };
            }),
        },
    };

    const insertedSeries = await db.series.upsert({
        create: transformedSeries,
        update: transformedSeries,
        where: { link: transformedSeries.link },
    });

    const seriesID = insertedSeries.id;

    await Promise.allSettled(series.items.map((episode) => {
        const transformedEpisode = {
            guid: episode.guid,
            title: episode.title,
            description: episode.description,
            descriptionHTML: episode['content:encoded'],
            pubDate: new Date(episode.pubDate),
            enclosure: episode.enclosure,
            image: episode['itunes:image'],
            link: episode.link,
            duration: parseInt(episode['itunes:duration'], 10),
            seriesId: seriesID,
        };

        console.log(transformedEpisode);

        return db.episode.upsert({
            create: transformedEpisode,
            update: transformedEpisode,
            where: { guid: episode.guid },
        });
    }));
}

scrapeByURL('https://www1.wdr.de/mediathek/audio/wdr5/wdr5-politikum/politikum116.podcast').then(() => scrapeByURL('https://www1.wdr.de/mediathek/audio/wdr5/wdr5-dok5-das-feature/dokfuenf140.podcast'));
