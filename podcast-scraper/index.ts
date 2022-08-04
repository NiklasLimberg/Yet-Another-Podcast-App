import { PrismaClient } from '@prisma/client';

import { XMLParser } from 'fast-xml-parser';

const db = new PrismaClient();

function parseKeyWords(keywordString?: string) {
    if (typeof keywordString !== 'string') {
        return [];
    }

    return keywordString.split(', ').map((keyword: string) => {
        const normalizedKeyword = keyword.replace('WDR 5', 'WDR5').trim();
        return {
            where: { name: normalizedKeyword },
            create: { name: normalizedKeyword },
        };
    });
}

function parseDurationToNumber(duration: string) {
    return duration.split(':').reduce((acc, time) => acc * 60 + parseInt(time, 10), 0);
}

export default async function scrapeByURL(podcastURL: string) {
    const parser = new XMLParser({
        ignoreAttributes: false,
    });

    const response = await fetch(podcastURL);

    const parsedXML = await parser.parse(await response.text());

    const series = parsedXML.rss.channel;

    const transformedSeries = {
        title: series.title,
        description: series.description,
        language: series.language,
        image: series.image.url,
        link: series['itunes:new-feed-ur'] ?? series.link,
        explicit: series['itunes:explicit'] === 'yes',
        pubDate: new Date(series.pubDate),
        lastBuildDate: new Date(series.lastBuildDate),
        ttl: parseInt(series.ttl, 10),
        keywords: {
            connectOrCreate: parseKeyWords(series['itunes:keywords']),
        },
    };

    const insertedSeries = await db.series.upsert({
        create: transformedSeries,
        update: transformedSeries,
        where: { link: transformedSeries.link },
    });

    const seriesID = insertedSeries.id;

    const episodePromises = series.item.map((episode: any) => {
        const guid = episode.guid['#text'];

        const transformedEpisode = {
            guid,
            title: episode.title,
            description: episode.description ?? '',
            descriptionHTML: episode['content:encoded'] ?? '',
            pubDate: new Date(episode.pubDate),
            enclosure: episode.enclosure['@_url'],
            image: episode['itunes:image']?.['@_href'] ?? '',
            link: episode.link,
            duration: parseDurationToNumber(episode['itunes:duration']),
            seriesId: seriesID,
            keywords: {
                connectOrCreate: parseKeyWords(series['itunes:keywords']),
            },
        };

        return db.episode.upsert({
            create: transformedEpisode,
            update: transformedEpisode,
            where: { guid },
        });
    });

    await Promise.allSettled(episodePromises);
}

scrapeByURL('https://www1.wdr.de/mediathek/audio/wdr5/wdr5-politikum/politikum116.podcast')
    .then(() => scrapeByURL('https://www1.wdr.de/mediathek/audio/wdr5/wdr5-dok5-das-feature/dokfuenf140.podcast'));
