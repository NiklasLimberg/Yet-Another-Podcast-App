import zod from 'zod';

import { seriesOutput } from './Series';

export const episodeOutput = zod.object({
    id: zod.string(),
    guid: zod.string(),
    title: zod.string(),
    description: zod.string(),
    descriptionHTML: zod.string(),
    pubDate: zod.date(),
    enclosure: zod.string(),
    image: zod.string(),
    link: zod.string(),
    duration: zod.number(),
    created: zod.date(),
    updated: zod.date().optional(),
    playbackProgress: zod.number(),
});

export const episodeWithSeriesOutput = episodeOutput.extend({
    series: seriesOutput.pick({
        id: true,
        title: true,
    })
})

export type Episode = zod.infer<typeof episodeOutput>;
export type EpisodeWithSeries = zod.infer<typeof episodeWithSeriesOutput>;
