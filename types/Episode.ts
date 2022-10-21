import zod from 'zod';

import { seriesOutput } from './Series';
import { keywordOutput } from './Keyword';

export const episodeOutput = zod.object({
    id: zod.string(),
    guid: zod.string(),
    title: zod.string(),
    series: seriesOutput.pick({ 
        id: true,
        title: true,
        image: true
    }),
    description: zod.string(),
    descriptionHTML: zod.string(),
    pubDate: zod.date(),
    enclosure: zod.string(),
    image: zod.string(),
    link: zod.string(),
    duration: zod.number(),
    created: zod.date(),
    updated: zod.date().optional(),
    keywords: keywordOutput.pick({
        id: true,
        name: true
    }).array(),
    playbackProgress: zod.number(),
});

export type Episode = zod.infer<typeof episodeOutput>;