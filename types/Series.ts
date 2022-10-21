import zod from 'zod';

import { creatorOutput } from './Creator';
import { keywordOutput } from './Keyword';

export const seriesOutput = zod.object({
    id: zod.string(),
    title: zod.string(),
    description: zod.string(),
    language: zod.string(),
    link: zod.string(),
    image: zod.string(),
    explicit: zod.boolean(),
    pubDate: zod.date(),
    lastBuildDate: zod.date(),
    created: zod.date(),
    updated: zod.date().optional(),
    creator: creatorOutput,
    keywords: keywordOutput.array(),
});

export type Series = zod.infer<typeof seriesOutput>;