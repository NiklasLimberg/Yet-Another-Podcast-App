import zod from 'zod';

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

export type Episode = zod.infer<typeof episodeOutput>;